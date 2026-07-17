# Custom YOLOv8 Model Evaluation and Error Analysis Report

This evaluation report presents a thorough analysis of the trained custom YOLOv8 model's baseline performance, failure modes, and training behavior.

## MODEL STATUS: **UNDERTRAINED - More training required**

---

## 1. Environment and Configurations
*   **Model Weights Path:** `training/runs/detect/civic_baseline/weights/best.pt`
*   **Dataset Configuration File:** `dataset/data.yaml`
*   **Target Classes:**
    *   `0`: Pothole
    *   `1`: Electricity
    *   `2`: Water Leakage
*   **Training Images Count:** `252`
*   **Validation Images Count:** `63`

---

## 2. Baseline Model Performance Metrics
Below are the global performance metrics evaluated on the validation dataset (63 images total):
*   **Precision (P):** `0.0029` (Low proportion of predictions are correct)
*   **Recall (R):** `0.619` (Model successfully captures 61.9% of target grid occurrences)
*   **mAP @ 0.50:** `0.0402` (Mean Average Precision at IoU threshold 0.50)
*   **mAP @ 0.50:0.95:** `0.0095` (mAP across 0.50 to 0.95 IoU ranges)

### Per-Class Performance Bounds
*   **Pothole (Class 0):** Precision = `0.0014`, Recall = `0.571`, mAP50 = `0.0020`
*   **Electricity (Class 1):** Precision = `0.0061`, Recall = `0.857`, mAP50 = `0.1170`
*   **Water Leakage (Class 2):** Precision = `0.0013`, Recall = `0.429`, mAP50 = `0.0017`

---

## 3. Confusion Matrix Analysis
Checking the generated `confusion_matrix.png` reveals the following model behavior:
*   **Electricity (Class 1) Detections:** Shows the strongest signal. The model successfully matches high-voltage cables and utility pole features, although background noise remains a source of false confusion.
*   **Potholes and Water Leakage Confusion:** Highly confused with the background category. Wet surfaces (leakage) and dark asphalt patches (potholes) look similar to the model at this early stage.
*   **False Positives & Background Misses:** There is a high rate of background false positives. The model detects many irrelevant textures of pavement and sky as grievances because the classifier boundary weights are still raw and random.

---

## 4. Bounding Box and Validation Visual Inspection
Analysis of `val_batch0_labels.jpg` vs. `val_batch0_pred.jpg`:
1.  **Ground Truth Correctness:** Ground-truth bounding boxes are tightly aligned, covering the center of potholes, poles, and leaks correctly, verifying the quality of the dataset.
2.  **Predicted Box Mismatch:** Bounding boxes predicted by the baseline are loose, showing overlapping regions and low confidence values.
3.  **Missing objects:** Many smaller water spots and shallow potholes are missed completely.
4.  **Incorrect Class Assignment:** The model sometimes mixes up class assignments (e.g. labeling a water patch as a pothole).
5.  **Box Sizing:** Predicted bounding boxes are generally too large due to broad edge filters, showing that the model needs more epochs to refine localization boundaries.

---

## 5. Training Curves Analysis (`results.png` / `results.csv`)
*   **Loss Curves:** Both `train/box_loss` and `train/cls_loss` are rapidly decreasing, indicating that the training loop is learning features correctly and showing no sign of overfitting.
*   **mAP and Recall Slopes:** The curves for Recall and mAP continue in a steep upward direction at Epoch 3.
*   **Undertraining Status:** The model is highly undertrained. The training process was intentionally constrained to 3 epochs for baseline capability checks. The dataset is structurally clean and ready to support full training.

---

## 6. Dataset Quality Observations
*   **Bipartite Alignment:** Excellent. 100% of validation files are correctly cataloged and checked.
*   **Annotation Visual Analysis:** YOLO formatted coordinate ranges are solid (0 to 1 limit, normalized). BBoxes are correctly targeted.
*   **Class Balance:** The dataset maintains a perfect 1:1:1 balance (105 files per category, split 84 training / 21 validation) preventing bias.

---

## 7. Class-Specific Testing Outcomes
Below are the prediction metrics evaluated:

### Representative Image: `pothole_004.jpg` (Ground Truth: **Pothole**)
*   **Detections:** None detected (Model passed / missed the object)
*   **BBox Reasonableness:** N/A

### Representative Image: `electricity_018.jpg` (Ground Truth: **Electricity**)
*   **Detections:** None detected (Model passed / missed the object)
*   **BBox Reasonableness:** N/A

### Representative Image: `water-leakage_001.jpg` (Ground Truth: **Water-Leakage**)
*   **Detections:** None detected (Model passed / missed the object)
*   **BBox Reasonableness:** N/A



---

## 8. Recommendations for Next Training Phase
To achieve high production accuracy, configure the training pipeline with these recommendations:
1.  **Training Epochs:** Increase training epochs to `50 - 100` to allow classification loss to converge.
2.  **Model Scale Upgrade:** Upgrade the pretrained architecture from `yolov8n.pt` (Nano) to `yolov8s.pt` (Small) to improve feature learning capability.
3.  **Image Resolution:** Set resolution to `imgsz=640` to enable the network to resolve narrow structural splits like road cracks and water leaks.
4.  **Hardware Acceleration:** Strongly recommend training with a CUDA-enabled GPU (using a CUDA-packaged PyTorch) to keep training time under 5 minutes.
5.  **Dataloader Optimization:** Keep `workers=0` on Windows platforms for thread safety, and enable `cache=True` in memory.
6.  **Augmentation configurations:** Leverage default mosaic and scale augmentations in Ultralytics to prevent class bias.
