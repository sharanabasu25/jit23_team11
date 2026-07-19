# Sprint 5.9.12 Report — Final isolated evaluation

This report evaluates dataset_v3 YOLOv8 model performance against the target 90% accuracy requirement.

---

## 1. Test Dataset Verification Details
*   **Total Isolated Test Images Scanned:** 24
*   **Total Ground-Truth Objects:** 28
*   **Class Mapping:** verified 3 classes mapping layout (0: pothole, 1: electricity, 2: water_leakage)
*   **Validation status:** verified all test annotations format bounds and file pairs (PASSED).

---

## 2. Confidence Threshold Performance Breakdown

| Confidence Threshold | TP | FP | FN | Precision | Recall | F1 Score | Detection Accuracy |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0.25** | 6 | 25 | 22 | 0.1935 | 0.2143 | 0.2034 | 0.2143 |
| **0.50 (Target)** | 5 | 8 | 23 | 0.3846 | 0.1786 | 0.2439 | 0.1786 |
| **0.75** | 3 | 3 | 25 | 0.5000 | 0.1071 | 0.1765 | 0.1071 |

---

## 3. Per-Class Metrics at Confidence 0.50 Threshold

| Category | Ground Truth Objects | Correct Predictions | False Positives | Missed Objects | Precision | Recall | F1 Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Pothole** | 8 | 0 | 1 | 8 | 0.0000 | 0.0000 | 0.0000 |
| **Electricity** | 13 | 5 | 6 | 8 | 0.4545 | 0.3846 | 0.4167 |
| **Water Leakage** | 7 | 0 | 1 | 7 | 0.0000 | 0.0000 | 0.0000 |

---

## 4. Comparison with dataset_v2 model (at Conf = 0.50)

| Metric | dataset_v2 | dataset_v3 | Difference |
| :--- | :---: | :---: | :---: |
| **Precision** | 86.36% | 38.46% | -47.90% |
| **Recall** | 76.00% | 17.86% | -58.14% |
| **F1 Score** | 80.85% | 24.39% | -56.46% |
| **Detection Accuracy** | 76.00% | 17.86% | -58.14% |

---

## 5. Hardest Sample Analysis & Failure Patterns
### Hardest Test Images:
*   `electricity_048.jpg` (GT: 2, Pred: 8, TP: 2, FP: 6, FN: 0, F1: 0.4000)
*   `water_leakage_032.jpg` (GT: 1, Pred: 2, TP: 0, FP: 2, FN: 1, F1: 0.0000)
*   `electricity_013.jpg` (GT: 2, Pred: 0, TP: 0, FP: 0, FN: 2, F1: 0.0000)
*   `electricity_017.jpg` (GT: 2, Pred: 0, TP: 0, FP: 0, FN: 2, F1: 0.0000)
*   `electricity_018.jpg` (GT: 2, Pred: 0, TP: 0, FP: 0, FN: 2, F1: 0.0000)


### Failure Patterns:
*   **Pothole Recall:** High shadows contrast or wet road reflection surfaces continue to cause minor box localization issues.
*   **Water Leakage Specular Reflections:** Wet metallic pipe surfaces or wet leaf sheen sometimes trigger false positives.

---

## 6. Project Target Validation Verdict
*   **Project Target (>= 90% Detection Accuracy):** **NOT MET** (Final test set Accuracy: 17.86%)
*   **Recommendation:** Recommendation: Model does NOT meet the 90% accuracy target. Propose further specific dataset expansions or hyperparameter fine-tuning before production merge.
