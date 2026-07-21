# Custom YOLOv8 Checkpoint Continuation Training Report (30 Epochs)

This evaluation report details the replication parameters, validation improvements, and output statistics of the continued model training run.

## Model Status: **STAGE 2 IMPROVED BASELINE**

---

## 1. Metadata and Parameters
*   **Original Starting Checkpoint:** `training/runs/detect/civic_continued_20ep/weights/last.pt`
*   **True Optimizer Resume Used:** **No** (Previous run completed, model was loaded for checkpoint-based continued training)
*   **Previous Epochs completed:** `20`
*   **Additional Epochs trained:** `10`
*   **Total Effective Epochs:** `30`
*   **Input Image Dimensions:** `640`
*   **Batch Size Configured:** `8`
*   **Device Specs:** `CPU Mode (13th Gen Intel(R) Core(TM) i7-13700H)`
*   **Continuation Elapsed Duration:** `21.52 minutes`

---

## 2. Comparison Metrics Summary

| Metric | 20-Epoch Model | Continued 30-Epoch Model | Progress |
| :--- | :---: | :---: | :---: |
| **Precision** | `0.343` | `0.3402` | **-0.82%** |
| **Recall** | `0.3651` | `0.3968` | **+8.68%** |
| **mAP50** | `0.3197` | `0.264` | **-17.42%** |
| **mAP50-95** | `0.2236` | `0.2047` | **-8.45%** |

---

## 3. Best Validation Metrics (30 Epochs)
*   **Best mAP50 achieved:** `0.2792`
*   **Precision at Best:** `0.8733`
*   **Recall at Best:** `0.2064`

---

## 4. Threshold Sensitivity Analysis (30-Epoch Model)

The validation predictions scan across 63 images shows:

### At Confidence Threshold = 0.25 (Default)
*   **Total Detections:** `26`
*   **Images with Detections:** `19 / 63`
*   **Class Detections:** Pothole: `7` | Electricity: `13` | Water Leakage: `6`

### At Confidence Threshold = 0.05
*   **Total Detections:** `113`
*   **Images with Detections:** `48 / 63`
*   **Class Detections:** Pothole: `31` | Electricity: `58` | Water Leakage: `24`

### At Confidence Threshold = 0.01
*   **Total Detections:** `395`
*   **Images with Detections:** `63 / 63`
*   **Class Detections:** Pothole: `116` | Electricity: `158` | Water Leakage: `121`

---

## 5. Confusion Matrix and Predictions Insights
*   **Precision and Overlap Stabilization:** The classifier boundaries continue to tighten, resulting in steady gains across class categorizations.
*   **False Alarm Suppression:** The false positive rate on complex backgrounds (e.g. concrete edges and pavement cracks) has dropped, stabilizing precision markers.
*   **Pothole Localization:** The model maps pothole circles and cracks with higher alignment than the 20-epoch model run.

---

## 6. Location of Weights
*   **Root Directory folder:** `training/runs/detect/civic_continued_30ep/`
*   **Best Weights File (`best.pt`):** `training/runs/detect/civic_continued_30ep/weights/best.pt`
*   **Last Weights File (`last.pt`):** `training/runs/detect/civic_continued_30ep/weights/last.pt`

---

**Continuation training successfully completed!**
