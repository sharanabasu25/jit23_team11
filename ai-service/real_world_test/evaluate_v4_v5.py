import os
import sys
import glob
from ultralytics import YOLO

# Define paths
TEST_IMAGES_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\external_pothole_split\external_test\images"
TEST_LABELS_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\external_pothole_split\external_test\labels"
MODEL_V4_PATH = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\training\runs\detect\civic_dataset_v4_100ep\weights\best.pt"
MODEL_V5_PATH = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\training\runs\detect\civic_dataset_v5_100ep\weights\best.pt"

# Verify paths
for path in [TEST_IMAGES_DIR, TEST_LABELS_DIR, MODEL_V4_PATH, MODEL_V5_PATH]:
    if not os.path.exists(path):
        print(f"Error: Path does not exist: {path}")
        sys.exit(1)

def calculate_iou(box1, box2):
    # box format: [xmin, ymin, xmax, ymax]
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

def load_gt_boxes(label_path):
    boxes = []
    if os.path.exists(label_path):
        with open(label_path, 'r') as f:
            for line in f:
                parts = line.strip().split()
                if not parts:
                    continue
                cls_id = int(parts[0])
                if cls_id == 0:  # Class 0: Pothole
                    cx, cy, w, h = map(float, parts[1:5])
                    xmin = cx - w / 2.0
                    ymin = cy - h / 2.0
                    xmax = cx + w / 2.0
                    ymax = cy + h / 2.0
                    boxes.append([xmin, ymin, xmax, ymax])
    return boxes

def evaluate_model_at_threshold(model_path, threshold):
    model = YOLO(model_path)
    supported_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    image_paths = sorted([os.path.join(TEST_IMAGES_DIR, f) for f in os.listdir(TEST_IMAGES_DIR) if f.lower().endswith(supported_extensions)])
    
    total_tp = 0
    total_fp = 0
    total_fn = 0
    total_gt_count = 0
    image_results = {}

    for img_path in image_paths:
        img_name = os.path.basename(img_path)
        base_name = os.path.splitext(img_name)[0]
        label_path = os.path.join(TEST_LABELS_DIR, f"{base_name}.txt")
        
        # Load GT boxes
        gt_boxes = load_gt_boxes(label_path)
        total_gt_count += len(gt_boxes)
        
        # Run inference
        results = model.predict(img_path, conf=threshold, iou=0.45, verbose=False)
        result = results[0]
        
        # Extract predictions for class 0
        pred_boxes = []
        pred_confs = []
        
        if result.boxes is not None:
            # result.boxes.xyxyn gives normalized coordinates
            xyxyn = result.boxes.xyxyn.cpu().numpy()
            clss = result.boxes.cls.cpu().numpy()
            confs = result.boxes.conf.cpu().numpy()
            
            for box, cls, conf in zip(xyxyn, clss, confs):
                if int(cls) == 0:
                    pred_boxes.append(box.tolist())
                    pred_confs.append(float(conf))
                    
        # Sort predictions by confidence desc
        sorted_indices = sorted(range(len(pred_confs)), key=lambda k: pred_confs[k], reverse=True)
        pred_boxes = [pred_boxes[i] for i in sorted_indices]
        pred_confs = [pred_confs[i] for i in sorted_indices]
        
        # Perform matching
        tp = 0
        fp = 0
        matched_gt = set()
        
        for p_box in pred_boxes:
            best_iou = -1.0
            best_gt_idx = -1
            
            for gt_idx, g_box in enumerate(gt_boxes):
                if gt_idx in matched_gt:
                    continue
                iou = calculate_iou(p_box, g_box)
                if iou >= 0.50 and iou > best_iou:
                    best_iou = iou
                    best_gt_idx = gt_idx
                    
            if best_gt_idx != -1:
                matched_gt.add(best_gt_idx)
                tp += 1
            else:
                fp += 1
                
        fn = len(gt_boxes) - tp
        
        total_tp += tp
        total_fp += fp
        total_fn += fn
        
        image_results[img_name] = {
            "gt_count": len(gt_boxes),
            "tp": tp,
            "fp": fp,
            "fn": fn
        }
        
    precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0.0
    recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0.0
    f1 = 2.0 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    accuracy = total_tp / (total_tp + total_fp + total_fn) if (total_tp + total_fp + total_fn) > 0 else 0.0
    
    return {
        "tp": total_tp,
        "fp": total_fp,
        "fn": total_fn,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "accuracy": accuracy,
        "gt": total_gt_count,
        "image_results": image_results
    }

def main():
    thresholds = [0.25, 0.50, 0.75]
    
    results = {}
    for model_name, path in [("v4", MODEL_V4_PATH), ("v5", MODEL_V5_PATH)]:
        results[model_name] = {}
        for th in thresholds:
            print(f"Evaluating {model_name} at threshold {th:.2f}...")
            res = evaluate_model_at_threshold(path, th)
            results[model_name][th] = res
            
    print("\n" + "=" * 50)
    print("EVALUATION RESULTS SUMMARY")
    print("=" * 50)
    for model_name in ["v4", "v5"]:
        print(f"\nModel: {model_name.upper()}")
        for th in thresholds:
            r = results[model_name][th]
            print(f"  Conf {th:.2f} -> TP: {r['tp']} | FP: {r['fp']} | FN: {r['fn']} | Precision: {r['precision']:.4f} | Recall: {r['recall']:.4f} | F1: {r['f1']:.4f} | Accuracy: {r['accuracy']:.4f}")
            
    # Direct comparison at Conf 0.25
    r4 = results["v4"][0.25]
    r5 = results["v5"][0.25]
    
    img_v4_wins = 0
    img_v5_wins = 0
    img_ties = 0
    
    missed_both = []
    detected_only_v4 = []
    detected_only_v5 = []
    
    for img in sorted(r4["image_results"].keys()):
        v4_res = r4["image_results"][img]
        v5_res = r5["image_results"][img]
        
        gt = v4_res["gt_count"]
        tp4, fp4 = v4_res["tp"], v4_res["fp"]
        tp5, fp5 = v5_res["tp"], v5_res["fp"]
        
        # Decide winner for image
        # Higher TP is better. If TP is equal, lower FP is better.
        if tp4 > tp5:
            img_v4_wins += 1
        elif tp5 > tp4:
            img_v5_wins += 1
        else:
            if fp4 < fp5:
                img_v4_wins += 1
            elif fp5 < fp4:
                img_v5_wins += 1
            else:
                img_ties += 1
                
        # Isolation analysis
        total_detections_v4 = tp4
        total_detections_v5 = tp5
        
        if total_detections_v4 == 0 and total_detections_v5 == 0 and gt > 0:
            missed_both.append(img)
        elif total_detections_v4 > 0 and total_detections_v5 == 0:
            detected_only_v4.append(img)
        elif total_detections_v5 > 0 and total_detections_v4 == 0:
            detected_only_v5.append(img)

    print("\n" + "=" * 50)
    print("DETAILED COMPARISON FOR CONF = 0.25")
    print("=" * 50)
    print(f"Total test images: {len(r4['image_results'])}")
    print(f"V4 (Image Wins): {img_v4_wins}")
    print(f"V5 (Image Wins): {img_v5_wins}")
    print(f"Ties: {img_ties}")
    print(f"Missed by both models: {len(missed_both)}")
    for img in missed_both:
        print(f"  - {img}")
    print(f"Detected only by V4: {len(detected_only_v4)}")
    for img in detected_only_v4:
        print(f"  - {img}")
    print(f"Detected only by V5: {len(detected_only_v5)}")
    for img in detected_only_v5:
        print(f"  - {img}")

    # Output detailed per-image comparison table contents
    print("\nIMAGE LEVEL DETAILED RESULTS (Conf=0.25):")
    print("| Image Filename | GT | V4 (TP/FP) | V5 (TP/FP) | Winner |")
    print("| :--- | :---: | :---: | :---: | :--- |")
    for img in sorted(r4["image_results"].keys()):
        v4_res = r4["image_results"][img]
        v5_res = r5["image_results"][img]
        gt = v4_res["gt_count"]
        tp4, fp4 = v4_res["tp"], v4_res["fp"]
        tp5, fp5 = v5_res["tp"], v5_res["fp"]
        
        if tp4 > tp5:
            winner = "Model A (v4)"
        elif tp5 > tp4:
            winner = "Model B (v5)"
        else:
            if fp4 < fp5:
                winner = "Model A (v4)"
            elif fp5 < fp4:
                winner = "Model B (v5)"
            else:
                winner = "Tie"
        print(f"| {img} | {gt} | {tp4}/{fp4} | {tp5}/{fp5} | {winner} |")

if __name__ == "__main__":
    main()
