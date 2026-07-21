import os
from PIL import Image
from ultralytics import YOLO

MODEL_PATH = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\training\runs\detect\civic_dataset_v5_100ep\weights\best.pt"
TEST_IMAGES_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_v5_pothole_targeted\images\test"
TEST_LABELS_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_v5_pothole_targeted\labels\test"

def main():
    model = YOLO(MODEL_PATH)
    supported_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    image_paths = sorted([os.path.join(TEST_IMAGES_DIR, f) for f in os.listdir(TEST_IMAGES_DIR) if f.lower().endswith(supported_extensions)])
    
    threshold = 0.50
    print(f"IMAGE LEVEL FAILURE ANALYSIS AT CONFIDENCE = {threshold:.2f}:\n")
    
    classes_names = {0: "Pothole", 1: "Electricity", 2: "Water Leakage"}
    
    for img_path in image_paths:
        img_name = os.path.basename(img_path)
        base = os.path.splitext(img_name)[0]
        label_path = os.path.join(TEST_LABELS_DIR, f"{base}.txt")
        
        # Load image size
        with Image.open(img_path) as im:
            width, height = im.size
            
        # Load GT
        gts = []
        if os.path.exists(label_path):
            with open(label_path, 'r') as f:
                for line in f:
                    parts = line.strip().split()
                    if not parts:
                        continue
                    cls_id = int(parts[0])
                    cx, cy, w, h = map(float, parts[1:5])
                    gts.append((cls_id, cx, cy, w, h))
                    
        # Predict
        res = model.predict(img_path, conf=threshold, iou=0.45, verbose=False)[0]
        preds = []
        if res.boxes is not None:
            xyxyn = res.boxes.xyxyn.cpu().numpy()
            clss = res.boxes.cls.cpu().numpy().astype(int)
            confs = res.boxes.conf.cpu().numpy()
            for box, cls, conf in zip(xyxyn, clss, confs):
                preds.append((cls, float(conf), box.tolist()))
                
        # Match
        matched_gt = set()
        matched_preds = set()
        
        # We compute IoU matrix
        for p_idx, (p_cls, p_conf, p_box) in enumerate(preds):
            best_iou = -1.0
            best_gt_idx = -1
            for gt_idx, (g_cls, g_cx, g_cy, g_w, g_h) in enumerate(gts):
                if gt_idx in matched_gt:
                    continue
                # convert GT center to xmin ymin xmax ymax
                g_box = [g_cx - g_w/2, g_cy - g_h/2, g_cx + g_w/2, g_cy + g_h/2]
                # calculate IoU
                x1 = max(p_box[0], g_box[0])
                y1 = max(p_box[1], g_box[1])
                x2 = min(p_box[2], g_box[2])
                y2 = min(p_box[3], g_box[3])
                inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)
                union = (p_box[2]-p_box[0])*(p_box[3]-p_box[1]) + g_w*g_h - inter
                iou = inter / union if union > 0 else 0
                if iou >= 0.50 and iou > best_iou:
                    best_iou = iou
                    best_gt_idx = gt_idx
                    
            if best_gt_idx != -1:
                matched_gt.add(best_gt_idx)
                matched_preds.add(p_idx)
                
        # 1. Check missed detections (FN)
        for gt_idx, (g_cls, g_cx, g_cy, g_w, g_h) in enumerate(gts):
            if gt_idx not in matched_gt:
                relative_area = g_w * g_h
                print(f"[-] MISSED DETECTION:")
                print(f"    Image: {img_name}")
                print(f"    GT Class: {classes_names[g_cls]} ({g_cls})")
                print(f"    GT Size (W x H norm): {g_w:.4f} x {g_h:.4f} (Area norm: {relative_area:.6f})")
                print(f"    Resolution: {width} x {height}")
                
        # 2. Check false positives (FP)
        for p_idx, (p_cls, p_conf, p_box) in enumerate(preds):
            if p_idx not in matched_preds:
                pw = p_box[2] - p_box[0]
                ph = p_box[3] - p_box[1]
                relative_area = pw * ph
                print(f"[+] FALSE POSITIVE:")
                print(f"    Image: {img_name}")
                print(f"    Predicted Class: {classes_names[p_cls]} ({p_cls})")
                print(f"    Confidence: {p_conf:.4f}")
                print(f"    Predicted Size (W x H norm): {pw:.4f} x {ph:.4f} (Area norm: {relative_area:.6f})")
                print(f"    Resolution: {width} x {height}")

if __name__ == "__main__":
    main()
