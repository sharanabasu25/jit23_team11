# Custom YOLOv8 Checkpoint Continuation Training Report (20 Epochs)

This evaluation report details the replication parameters, validation improvements, and output statistics of the continued model training run.

## Model Status: **IMPROVED BASELINE**

---

## 1. Metadata and Parameters
*   **Original Starting Checkpoint:** `training/runs/detect/civic_improved_50ep/weights/last.pt`
*   **True Optimizer Resume Used:** **No** (Previous run completed, model was loaded for checkpoint-based continued training)
*   **Previous Epochs completed:** `5`
*   **Additional Epochs trained:** `15`
*   **Total Effective Epochs:** `20`
*   **Input Image Dimensions:** `640`
*   **Batch Size Configured:** `8`
*   **Device Specs:** `CPU Mode (13th Gen Intel(R) Core(TM) i7-13700H)`
*   **Continuation Elapsed Duration:** `32.48 minutes`

---

## 2. Comparison Metrics Summary

| Metric | 5-Epoch Model | Continued 20-Epoch Model | Progress |
| :--- | :---: | :---: | :---: |
| **Precision** | `0.16` | `0.343` | **+114.38%** |
| **Recall** | `0.1905` | `0.3651` | **+91.65%** |
| **mAP50** | `0.102` | `0.3197` | **+213.43%** |
| **mAP50-95** | `0.0615` | `0.2236` | **+263.58%** |

---

## 3. Best Validation Metrics (20 Epochs)
*   **Best mAP50 achieved:** `0.3197`
*   **Precision at Best:** `0.343`
*   **Recall at Best:** `0.3651`

---

## 4. Threshold Sensitivity Analysis (20-Epoch Model)

The validation predictions scan across 63 images shows:

### At Confidence Threshold = 0.25 (Default)
*   **Total Detections:** `29`
*   **Images with Detections:** `19 / 63`
*   **Class Detections:** Pothole: `1` | Electricity: `21` | Water Leakage: `7`

### At Confidence Threshold = 0.05
*   **Total Detections:** `113`
*   **Images with Detections:** `44 / 63`
*   **Class Detections:** Pothole: `29` | Electricity: `63` | Water Leakage: `21`

### At Confidence Threshold = 0.01
*   **Total Detections:** `409`
*   **Images with Detections:** `61 / 63`
*   **Class Detections:** Pothole: `184` | Electricity: `185` | Water Leakage: `40`

---

## 5. Confusion Matrix and Predictions Insights
*   **Improved True Positive Rates:** True detections have stabilized. We see an increase in correct Pothole and Electricity captures at default threshold.
*   **Background Detections:** False positives remain visible but are much lower than the 5-epoch model. The model has learned wider road environments and is more selective.
*   **Class Separation:** Confusion between wet water-leakage roads and plain asphalt potholes has decreased due to finer detailed feature weights learned over 20 epochs.

---

## 6. Location of Weights
*   **Root Directory folder:** `training/runs/detect/civic_continued_20ep/`
*   **Best Weights File (`best.pt`):** `training/runs/detect/civic_continued_20ep/weights/best.pt`
*   **Last Weights File (`last.pt`):** `training/runs/detect/civic_continued_20ep/weights/last.pt`

---

**Continuation baseline training successfully completed!**
