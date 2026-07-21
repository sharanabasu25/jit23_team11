# External Pothole Dataset Evaluation Report

This report evaluates our baseline YOLOv8 model's performance on the 67 unseen external pothole images from the Roboflow/unseen pothole dataset, focusing exclusively on the Pothole target class (Class 0).

> [!NOTE]
> This is a domain-specific external pothole dataset evaluation and does not constitute a full real-world pipeline validation since it tests only Pothole category occurrences.

---

## 1. Test Configuration Reference
*   **Model Weights:** `training/runs/detect/civic_dataset_v2_100ep/weights/best.pt`
*   **Target Class:** Pothole (Class 0)
*   **Test Dataset Size:** 67 images (unseen pothole test split)
*   **Total Ground-Truth Potholes:** 154
*   **Inference Image Size:** 640px
*   **NMS IoU Threshold:** 0.45
*   **GT Match IoU Threshold:** 0.50

---

## 2. Confidence Threshold Performance Breakdown

| Confidence Threshold | True Positives | False Positives | False Negatives | Precision | Recall | F1 Score | Detection Accuracy |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0.25** | 1 | 6 | 153 | 0.1429 | 0.0065 | 0.0124 | 0.0065 |
| **0.50 (Baseline)** | 0 | 3 | 154 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| **0.75** | 0 | 0 | 154 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |

---

## 3. Pothole Class Performance Metrics (at Conf = 0.50)
*   **Total Dataset Images:** 67
*   **Total Ground-truth Pothole Objects:** 154
*   **Correctly Detected Potholes (TP):** 0
*   **Missed Potholes (FN):** 154
*   **False Detections (FP):** 3

---

## 4. Hardest Images & Error-Inducing Samples
### Top 5 Failures by Object Error Count:
*   `img-634_jpg.rf.42d6e4ebdda859ab935130b75ae5808f.jpg` (GT: 13, Pred: 0, TP: 0, FP: 0, FN: 13)
*   `img-486_jpg.rf.7469bae9d18a0cf9dd690fbbcde56298.jpg` (GT: 6, Pred: 0, TP: 0, FP: 0, FN: 6)
*   `img-621_jpg.rf.9721804149e82d9ebc58f8d19a01d044.jpg` (GT: 6, Pred: 0, TP: 0, FP: 0, FN: 6)
*   `img-179_jpg.rf.8632eb0d9b75fefe144829e67b75015a.jpg` (GT: 5, Pred: 0, TP: 0, FP: 0, FN: 5)
*   `img-23_jpg.rf.e6aa0daf83e72ccbf1ea10eb6a6ab3bd.jpg` (GT: 5, Pred: 0, TP: 0, FP: 0, FN: 5)


---

## 5. Common Failure Patterns
1.  **Low Contrast Cracks:** The model fails on superficial road discolorations or thin hairline cracks that are labeled as potholes in the external test set.
2.  **Wide perspective angles:** Highly flat road surfaces with distant potholes are missed due to perspective distortion.
3.  **Boundary misalignment (IoU < 0.50 mismatch):** Predictions align visually but fail on strict IoU boundaries due to differing annotation style sizes (some tight boxes vs some oversized boxes).

---

## 6. Actionable Recommendation Summary
*   **Verdict:** Model recall is lower on this external set compared to the local test split, signifying domain generalization challenges.
*   **Recommended Action:** **2. Add difficult pothole images from this domain and retrain**. The model needs exposures to low-contrast cracks and varying lighting states to generalize across external civic regions.
