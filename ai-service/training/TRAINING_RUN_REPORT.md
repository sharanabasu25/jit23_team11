# YOLOv8 Custom Training Run Evaluation Report

This validation report documents the performance parameters, dataset features, and training outputs for the custom civic issues model.

## Run Verdict: **SUCCESS**

---

## 1. Metadata and Parameters
*   **Execution Start Date/Time:** `2026-07-17 17:39:26`
*   **Base Pretrained Model:** `yolov8n.pt`
*   **Dataset Configuration File:** `dataset/data.yaml`
*   **Dataset Split:** Train: `252` images | Val: `63` images
*   **Input Image Dimensions:** `320`
*   **Epoch Length Target:** `3` (Baseline representative run)
*   **Batch Size Configured:** `16`
*   **Hardware Configured:** `CPU Mode (13th Gen Intel(R) Core(TM) i7-13700H)`
*   **Total Elapsed Duration:** `2.03 minutes`

---

## 2. Evaluation Performance Metrics

### Target Final Epoch Metrics
*   **Precision (P):** `0.0029`
*   **Recall (R):** `0.619`
*   **mAP @ 0.50:** `0.0402`
*   **mAP @ 0.50:0.95:** `0.0095`

### Best Epoch Validation Bounds (Max mAP50)
*   **Best mAP @ 0.50:** `0.0402`
*   **Precision at Best:** `0.0029`
*   **Recall at Best:** `0.619`

---

## 3. Training Artifacts and Weights

The trained custom weights and figures are located at:
*   **Output Path Location:** `training/runs/detect/civic_baseline/`
*   **Best Weights File (`best.pt`):** `training/runs/detect/civic_baseline/weights/best.pt`
*   **Last Weights File (`last.pt`):** `training/runs/detect/civic_baseline/weights/last.pt`

### Output Directory Directory Verification
The training output folder has successfully captured the following diagnostic files:
1. `weights/best.pt` & `weights/last.pt` (Inference weights files)
2. `results.csv` (CSV log containing metrics per epoch)
3. `results.png` (Graphed metrics visualization)
4. `confusion_matrix.png` (Confusion matrix map)
5. `val_batch0_labels.jpg` / `val_batch0_pred.jpg` (Visual verification predictions)

---

**Custom baseline training is complete and validated!**
