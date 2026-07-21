import os
import sys
import numpy as np
from ultralytics import YOLO

# Define paths
DATA_YAML = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_v5_pothole_targeted\data.yaml"
TEST_IMAGES_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_v5_pothole_targeted\images\test"
TEST_LABELS_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_v5_pothole_targeted\labels\test"
MODEL_PATH = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\training\runs\detect\civic_dataset_v5_100ep\weights\best.pt"

# Verify paths
for path in [DATA_YAML, TEST_IMAGES_DIR, TEST_LABELS_DIR, MODEL_PATH]:
    if not os.path.exists(path):
        print(f"Error: Path does not exist: {path}")
        sys.exit(1)

def calculate_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    
    inter_area = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    
    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    
    union_area = box1_area + box2_area - inter_area
    if union_area == 0.0:
        return 0.0
    return inter_area / union_area

def load_gt_boxes_all(label_path):
    # Returns list of (cls_id, [xmin, ymin, xmax, ymax])
    boxes = []
    if os.path.exists(label_path):
        with open(label_path, 'r') as f:
            for line in f:
                parts = line.strip().split()
                if not parts:
                    continue
                cls_id = int(parts[0])
                cx, cy, w, h = map(float, parts[1:5])
                xmin = cx - w / 2.0
                ymin = cy - h / 2.0
                xmax = cx + w / 2.0
                ymax = cy + h / 2.0
                boxes.append((cls_id, [xmin, ymin, xmax, ymax]))
    return boxes

def get_image_primary_class(img_name):
    # Determine primary class from filename prefix
    if img_name.startswith("pothole_"):
        return 0
    elif img_name.startswith("electricity_"):
        return 1
    elif img_name.startswith("water_leakage_"):
        return 2
    elif img_name.startswith("negative_"):
        return None
    return None

def run_evaluation_at_threshold(model, image_paths, threshold):
    # Confusion matrix structure: rows = actual (0,1,2,Background), columns = predicted (0,1,2,Background)
    # Class index mapping: 0=Pothole, 1=Electricity, 2=Water Leakage, 3=Background
    conf_matrix = np.zeros((4, 4), dtype=int)
    
    # Image level simulation results
    simulation_results = {
        "CORRECT ROUTING": 0,
        "WRONG ROUTING": 0,
        "MISSED ISSUE": 0,
        "FALSE ALARM": 0,
        "clean_correct": 0  # negative image with 0 detections
    }
    
    # Track class counts for safety analysis
    # class_sims[cls] = {"CORRECT ROUTING": 0, "WRONG ROUTING": 0, ...}
    class_sims = {cls: {"CORRECT ROUTING": 0, "WRONG ROUTING": 0, "MISSED ISSUE": 0, "FALSE ALARM": 0} for cls in [0, 1, 2]}
    
    # Image names by type
    image_routing_decisions = []

    for img_path in image_paths:
        img_name = os.path.basename(img_path)
        base_name = os.path.splitext(img_name)[0]
        label_path = os.path.join(TEST_LABELS_DIR, f"{base_name}.txt")
        
        gt_class = get_image_primary_class(img_name)
        gt_boxes = load_gt_boxes_all(label_path)
        
        # Run inference
        results = model.predict(img_path, conf=threshold, iou=0.45, verbose=False)
        result = results[0]
        
        # Get predictions: (cls_id, conf, box)
        pred_list = []
        if result.boxes is not None:
            xyxyn = result.boxes.xyxyn.cpu().numpy()
            clss = result.boxes.cls.cpu().numpy().astype(int)
            confs = result.boxes.conf.cpu().numpy()
            for box, cls, conf in zip(xyxyn, clss, confs):
                pred_list.append((cls, float(conf), box.tolist()))
                
        # Sort predictions by confidence descending
        pred_list = sorted(pred_list, key=lambda x: x[1], reverse=True)
        
        # 1. Bounding Box Matching for Confusion Matrix
        matched_gt = set()
        matched_preds = set()
        
        for p_idx, (p_cls, p_conf, p_box) in enumerate(pred_list):
            best_iou = -1.0
            best_gt_idx = -1
            
            for gt_idx, (g_cls, g_box) in enumerate(gt_boxes):
                if gt_idx in matched_gt:
                    continue
                iou = calculate_iou(p_box, g_box)
                if iou >= 0.50 and iou > best_iou:
                    best_iou = iou
                    best_gt_idx = gt_idx
            
            if best_gt_idx != -1:
                matched_gt.add(best_gt_idx)
                matched_preds.add(p_idx)
                g_cls = gt_boxes[best_gt_idx][0]
                conf_matrix[g_cls][p_cls] += 1
            else:
                # Prediction with no match => Background (FP)
                conf_matrix[3][p_cls] += 1
                
        # Unmatched GT boxes => Missed (FN)
        for gt_idx, (g_cls, g_box) in enumerate(gt_boxes):
            if gt_idx not in matched_gt:
                conf_matrix[g_cls][3] += 1
                
        # 2. Routing Decision Simulation
        decision = None
        if len(pred_list) == 0:
            if gt_class is None:
                # Negative sample, 0 predictions
                decision = "CORRECT ROUTING" # correct rejection
                simulation_results["clean_correct"] += 1
            else:
                decision = "MISSED ISSUE"
                simulation_results["MISSED ISSUE"] += 1
                class_sims[gt_class]["MISSED ISSUE"] += 1
        else:
            top_cls, top_conf, top_box = pred_list[0]
            if gt_class is None:
                decision = "FALSE ALARM"
                simulation_results["FALSE ALARM"] += 1
            else:
                # Find maximum IoU of top box with any GT in the image
                best_iou = 0.0
                best_gt_cls = -1
                for g_cls, g_box in gt_boxes:
                    iou = calculate_iou(top_box, g_box)
                    if iou > best_iou:
                        best_iou = iou
                        best_gt_cls = g_cls
                        
                if best_iou >= 0.50:
                    if top_cls == gt_class:
                        decision = "CORRECT ROUTING"
                        simulation_results["CORRECT ROUTING"] += 1
                        class_sims[gt_class]["CORRECT ROUTING"] += 1
                    else:
                        decision = "WRONG ROUTING"
                        simulation_results["WRONG ROUTING"] += 1
                        class_sims[gt_class]["WRONG ROUTING"] += 1
                else:
                    # Top box hit empty background
                    decision = "FALSE ALARM"
                    simulation_results["FALSE ALARM"] += 1
                    class_sims[gt_class]["FALSE ALARM"] += 1
                    
        image_routing_decisions.append({
            "image": img_name,
            "gt_class": gt_class,
            "predictions_count": len(pred_list),
            "decision": decision
        })
        
    # Calculate Precision, Recall, F1 for each class from the confusion matrix
    # Class mapping: 0, 1, 2
    class_metrics = {}
    for cls in [0, 1, 2]:
        tp = conf_matrix[cls][cls]
        fp = sum(conf_matrix[r][cls] for r in range(4) if r != cls)
        fn = sum(conf_matrix[cls][c] for c in range(4) if c != cls)
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2.0 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
        
        # Wrong class FP
        wrong_cls_fp = sum(conf_matrix[r][cls] for r in [0, 1, 2] if r != cls)
        # Background FP
        bg_fp = conf_matrix[3][cls]
        total_pred = tp + fp
        
        class_metrics[cls] = {
            "tp": tp,
            "fp": fp,
            "fn": fn,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "wrong_class_rate": wrong_cls_fp / total_pred if total_pred > 0 else 0.0,
            "false_positive_rate": bg_fp / total_pred if total_pred > 0 else 0.0
        }
        
    # Overall metrics summing all classes TP, FP, FN
    total_tp = sum(class_metrics[c]["tp"] for c in [0, 1, 2])
    total_fp = sum(class_metrics[c]["fp"] for c in [0, 1, 2])
    total_fn = sum(class_metrics[c]["fn"] for c in [0, 1, 2])
    overall_p = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0.0
    overall_r = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0.0
    overall_f1 = 2.0 * overall_p * overall_r / (overall_p + overall_r) if (overall_p + overall_r) > 0 else 0.0
    
    return {
        "conf_matrix": conf_matrix,
        "simulation_results": simulation_results,
        "class_sims": class_sims,
        "class_metrics": class_metrics,
        "overall": {
            "tp": total_tp,
            "fp": total_fp,
            "fn": total_fn,
            "precision": overall_p,
            "recall": overall_r,
            "f1": overall_f1
        },
        "image_decisions": image_routing_decisions
    }

def main():
    # 1. Load YOLO model
    model = YOLO(MODEL_PATH)
    
    # 2. Get mAP metrics using model.val() on the test split
    print("Running official validation on test split...")
    val_results = model.val(data=DATA_YAML, split='test', batch=8, imgsz=640, device='cpu', workers=0, verbose=False)
    
    # Class values from DetMetrics
    # box.maps maps class maps50-95 in alphabetic or dataset order
    # Let's inspect class names mapping
    names = val_results.names # {0: 'Pothole', 1: 'Electricity', 2: 'Water Leakage'}
    # map50 per class is in box.maps or val_results.box.ap50
    class_map50 = val_results.box.ap50 # map50 per class
    class_map50_95 = val_results.box.ap # map50-95 per class
    
    overall_map50 = val_results.box.map50
    overall_map50_95 = val_results.box.map

    
    # 3. Load all test split images
    supported_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    image_paths = sorted([os.path.join(TEST_IMAGES_DIR, f) for f in os.listdir(TEST_IMAGES_DIR) if f.lower().endswith(supported_extensions)])
    
    print(f"Total test images: {len(image_paths)}")
    
    thresholds = [0.25, 0.50, 0.75]
    results = {}
    for th in thresholds:
        print(f"\nEvaluating customized matching and simulation at confidence threshold {th:.2f}...")
        results[th] = run_evaluation_at_threshold(model, image_paths, th)
        
    print("\n" + "=" * 60)
    print("         SPRINT 5.9.23 EVALUATION COMPLETE")
    print("=" * 60)
    
    # Print official test mAPs
    print(f"\nOfficial test split validation mAP metrics:")
    print(f"  Overall mAP50: {overall_map50:.4f} | mAP50-95: {overall_map50_95:.4f}")
    for idx_cls, cls_name in names.items():
        name = names[idx_cls]
        ap50 = class_map50[idx_cls]
        ap95 = class_map50_95[idx_cls]
        print(f"  Class {idx_cls} ({name}) -> mAP50: {ap50:.4f} | mAP50-95: {ap95:.4f}")
        
    # Print simulation results comparative table
    print("\nRouting Simulation Comparison Table:")
    print("| Threshold | Correct Routing | Wrong Routing | Missed Issue | False Alarm | Clean Correct |")
    print("|---|---|---|---|---|---|")
    for th in thresholds:
        sim = results[th]["simulation_results"]
        # In prompt, we treat CORRECT ROUTING (positive images) + clean_correct (negative images with 0 detections)
        # combined under CORRECT ROUTING or report separately. Let's keep them separate or sum them.
        # Let's check how many negative images there are.
        # Filename starts with negative_ => negative clean image.
        # Number of negative images is 4: negative_008, negative_018, negative_020, negative_026.
        # Let's verify and keep correct routing: CORRECT ROUTING (for positive images) + clean_correct (for negative images).
        # We can sum them to get total correctly routed images:
        corr = sim["CORRECT ROUTING"] + sim["clean_correct"]
        print(f"| {th:.2f} | {corr} | {sim['WRONG ROUTING']} | {sim['MISSED ISSUE']} | {sim['FALSE ALARM']} | {sim['clean_correct']} |")
        
    # Print confusion matrices
    for th in thresholds:
        print(f"\nConfusion Matrix for Threshold {th:.2f}:")
        print("Rows: Actual Classes (Pothole, Electricity, Water Leakage, Background)")
        print("Cols: Predicted Classes (Pothole, Electricity, Water Leakage, Background)")
        print(results[th]["conf_matrix"])
        
    # Print safety metrics for threshold 0.50 (industry standard suggested)
    print("\nClass Safety & Routing Success Analytics at Threshold 0.50:")
    r50 = results[0.50]
    total_class_images = {0: 8, 1: 7, 2: 5} # Count of positive images (let's check details below)
    
    # Dynamic counts of source images of each class
    image_classes = [get_image_primary_class(f) for f in os.listdir(TEST_IMAGES_DIR) if f.lower().endswith(supported_extensions)]
    counts_cls = {cls: image_classes.count(cls) for cls in [0, 1, 2, None]}
    print(f"Image category counts in test split: Pothole(0): {counts_cls[0]}, Electricity(1): {counts_cls[1]}, Water Leakage(2): {counts_cls[2]}, Negative(None): {counts_cls[None]}")
    
    for cls in [0, 1, 2]:
        name = names[cls]
        m = r50["class_metrics"][cls]
        c_sims = r50["class_sims"][cls]
        tot_img = counts_cls[cls]
        
        # Success and wrong class rate calculations
        succ_rate = c_sims["CORRECT ROUTING"] / tot_img if tot_img > 0 else 0.0
        
        print(f"\nClass: {name.upper()}")
        print(f"  - Detection Recall: {m['recall']*100:.2f}% (TP={m['tp']} / GT_Objects={m['tp'] + m['fn']})")
        print(f"  - Classification Accuracy: {m['precision']*100:.2f}%")
        print(f"  - Wrong-class Rate: {m['wrong_class_rate']*100:.2f}%")
        print(f"  - False-positive Rate: {m['false_positive_rate']*100:.2f}%")
        print(f"  - Routing Success Rate (Image lvl): {succ_rate*100:.2f}% ({c_sims['CORRECT ROUTING']}/{tot_img})")
        print(f"  - Missed Issue Rate (Image lvl): {c_sims['MISSED ISSUE']/tot_img*100:.2f}% ({c_sims['MISSED ISSUE']}/{tot_img})")
        print(f"  - Wrong Routing Rate (Image lvl): {c_sims['WRONG ROUTING']/tot_img*100:.2f}% ({c_sims['WRONG ROUTING']}/{tot_img})")
        print(f"  - False Alarm Rate (Image lvl): {c_sims['FALSE ALARM']/tot_img*100:.2f}% ({c_sims['FALSE ALARM']}/{tot_img})")

if __name__ == "__main__":
    main()
