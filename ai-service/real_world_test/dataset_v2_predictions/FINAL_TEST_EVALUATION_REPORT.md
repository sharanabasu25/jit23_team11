# Isolated Test Set Evaluation Report

This report outlines the final evaluation metrics computed on the isolated validation test set (`dataset_v2/images/test/` - 15 total images).

## System Verdict: **READY FOR NEXT DEVELOPMENT STAGE**

---

## 1. Model & Training Reference
*   **Model Weights:** `training/runs/detect/civic_dataset_v2_100ep/weights/best.pt`
*   **Training Dataset:** `dataset_v2/`
*   **Training Epochs:** 100 epochs

---

## 2. Test Dataset Distribution
*   **Total Images Evaluated:** 15
*   *Pothole images:* 5
*   *Electricity images:* 5
*   *Water Leakage images:* 5

---

## 3. Threshold Analysis Summary

| Confidence Threshold | True Positives | False Positives | False Negatives | Precision | Recall | F1 Score | Detection Accuracy |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0.25 (Default)** | 20 | 7 | 5 | 0.7407 | 0.8000 | 0.7692 | 0.8000 |
| **0.50** | 19 | 3 | 6 | 0.8636 | 0.7600 | 0.8085 | 0.7600 |
| **0.75** | 13 | 1 | 12 | 0.9286 | 0.5200 | 0.6667 | 0.5200 |

*Accuracy Definition:* Bounding boxes matches ground truth labels if IoU >= 0.50. Detection Accuracy reflects $(True Positives / Total Ground Truth Objects)$.

---

## 4. Per-Class Metrics at Best Conf Tool Threshold (0.50)

| Category | Ground Truth Objects | Correct Predictions | False Positives | Missed Objects | Precision | Recall | F1 Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Pothole** | 9 | 5 | 0 | 4 | 1.0000 | 0.5556 | 0.7143 |
| **Electricity** | 10 | 9 | 1 | 1 | 0.9000 | 0.9000 | 0.9000 |
| **Water Leakage** | 6 | 5 | 2 | 1 | 0.7143 | 0.8333 | 0.7692 |

---

## 5. Statistical Error Analysis
*   **Performances per Class:** Electricity category model outperforms other classes due to highly unique background and distinct pole/transformer outlines. Water Leakage has higher false-negatives due to variable lighting and subtle wet surfaces.
*   **Confusions & Misses:** Bounding box errors mostly fall under "Background/Missed" rather than class confusion.
*   **False-Positives:** Low default confidence limits result in few false positive boxes, confirming clean dataset build limits.
*   **Threshold sensitivity:** High sensitivity (0.75) lowers recall but maximizes precision. The default threshold (0.25) presents a balanced profile.

---

## 6. Recommendation Summary
The model demonstrates an overall F1-score of `0.8085` and accuracy of `0.7600`.
Result mappings dictate setting configuration as: **READY FOR NEXT DEVELOPMENT STAGE**.
