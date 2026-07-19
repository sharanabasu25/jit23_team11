# Sprint 5.9.19 — Controlled External Pothole Model Comparison

This report details the comparison evaluation between **Model A (dataset_v3)** and **Model B (dataset_v4)** over the exact same 20 isolated external pothole test images located in `external_pothole_split/external_test/`.

---

## 1. Summary Metrics at All Confidence Thresholds (IoU = 0.50)

### Model A (dataset_v3 best.pt)
*   **Threshold 0.25:** TP: 1 | FP: 5 | FN: 46 | Precision: 0.1667 | Recall: 0.0213 | F1: 0.0377 | Accuracy: 0.0192
*   **Threshold 0.50:** TP: 0 | FP: 1 | FN: 47 | Precision: 0.0000 | Recall: 0.0000 | F1: 0.0000 | Accuracy: 0.0000
*   **Threshold 0.75:** TP: 0 | FP: 0 | FN: 47 | Precision: 0.0000 | Recall: 0.0000 | F1: 0.0000 | Accuracy: 0.0000

### Model B (dataset_v4 best.pt)
*   **Threshold 0.25:** TP: 16 | FP: 5 | FN: 31 | Precision: 0.7619 | Recall: 0.3404 | F1: 0.4706 | Accuracy: 0.3077
*   **Threshold 0.50:** TP: 14 | FP: 1 | FN: 33 | Precision: 0.9333 | Recall: 0.2979 | F1: 0.4516 | Accuracy: 0.2917
*   **Threshold 0.75:** TP: 4 | FP: 0 | FN: 43 | Precision: 1.0000 | Recall: 0.0851 | F1: 0.1569 | Accuracy: 0.0851

---

## 2. Best Threshold Selection
*   **Best Confidence Threshold for Model A (dataset_v3):** `0.25` (F1 Score = 0.0377)
*   **Best Confidence Threshold for Model B (dataset_v4):** `0.25` (F1 Score = 0.4706)

---

## 3. Direct Metrics Comparison Table (Best Thresholds = 0.25)

| Metric | dataset_v3 (Model A) | dataset_v4 (Model B) | Better Model |
| :--- | :---: | :---: | :--- |
| **Precision** | 0.1667 | 0.7619 | **dataset_v4** |
| **Recall** | 0.0213 | 0.3404 | **dataset_v4** |
| **F1 Score** | 0.0377 | 0.4706 | **dataset_v4** |
| **Detection Accuracy** | 0.0192 | 0.3077 | **dataset_v4** |

---

## 4. Per-Image Detection Breakdown (Conf = 0.25)

| Image Filename | Ground Truth Potholes | Model A Detections (TP / FP) | Model B Detections (TP / FP) | Winner |
| :--- | :---: | :---: | :---: | :--- |
| img-107_jpg.rf.2e40485785f6e5e2efec404301b235c2.jpg | 1 | 0 / 0 | 0 / 0 | Tie |
| img-146_jpg.rf.61be25b3053a51f622a244980545df2b.jpg | 1 | 0 / 0 | 0 / 0 | Tie |
| img-161_jpg.rf.211541e7178a4a93ec0680f26b905427.jpg | 1 | 0 / 0 | 0 / 1 | Model A (v3) |
| img-179_jpg.rf.8632eb0d9b75fefe144829e67b75015a.jpg | 5 | 0 / 0 | 3 / 0 | Model B (v4) |
| img-195_jpg.rf.f77a8f4d432a9a89235168ff8e09a650.jpg | 2 | 0 / 0 | 2 / 0 | Model B (v4) |
| img-217_jpg.rf.20e267cdb167c43140e67ec9f5328040.jpg | 2 | 0 / 0 | 1 / 1 | Model B (v4) |
| img-269_jpg.rf.f51d9eb8d02a34ac01d4a486cbfbdd4f.jpg | 2 | 0 / 3 | 1 / 1 | Model B (v4) |
| img-276_jpg.rf.acc167b63d79ab3b99fd64b4109f86d4.jpg | 1 | 0 / 0 | 1 / 0 | Model B (v4) |
| img-364_jpg.rf.e385283baa4507e9b6a79c9e92c4b453.jpg | 1 | 0 / 0 | 1 / 0 | Model B (v4) |
| img-390_jpg.rf.3eeb4356ab769c112edf7f482110f8ee.jpg | 1 | 0 / 0 | 0 / 0 | Tie |
| img-394_jpg.rf.2182e193f33ed5bcce45df7df27032f7.jpg | 2 | 0 / 0 | 0 / 0 | Tie |
| img-398_jpg.rf.0c484369fdb23fdec1b9250477fc5d1d.jpg | 1 | 0 / 1 | 0 / 0 | Model B (v4) |
| img-410_jpg.rf.5f10f2bbde7900b5348aeaed6116b901.jpg | 1 | 0 / 0 | 0 / 1 | Model A (v3) |
| img-42_jpg.rf.532fb8eb05b1efc570c5e4165e614201.jpg | 2 | 0 / 1 | 1 / 0 | Model B (v4) |
| img-44_jpg.rf.c0be863d6030f5d0cb241331c14ee532.jpg | 2 | 0 / 0 | 1 / 0 | Model B (v4) |
| img-472_jpg.rf.d71e2cae627685f2ad46e4182bbfb68a.jpg | 1 | 1 / 0 | 1 / 0 | Tie |
| img-576_jpg.rf.f6cd32a51b0c518b58ff750ecab687d1.jpg | 2 | 0 / 0 | 1 / 0 | Model B (v4) |
| img-634_jpg.rf.42d6e4ebdda859ab935130b75ae5808f.jpg | 13 | 0 / 0 | 0 / 0 | Tie |
| img-68_jpg.rf.c8886ded10d01454f789376e4234ae74.jpg | 2 | 0 / 0 | 2 / 0 | Model B (v4) |
| img-98_jpg.rf.667209472947ff4d519f65c6e206a7c3.jpg | 4 | 0 / 0 | 1 / 1 | Model B (v4) |

---

## 5. Direct Model Comparison Detailed Analytics
*   **Total Test Images:** 20
*   **Total Ground-Truth Pothole Objects:** 47
*   **Images where Model B (v4) performed better:** 12
*   **Images where Model A (v3) performed better:** 2
*   **Images where both performed equally (Tie):** 6
*   **Potholes Detected:**
    *   **Model A (dataset_v3):** 1
    *   **Model B (dataset_v4):** 16
*   **Potholes Missed:**
    *   **Model A (dataset_v3):** 46
    *   **Model B (dataset_v4):** 31

---

## 6. Failure Analysis

*   **Which images were missed by both models?**
    *   Total count: 8
    *   `img-107_jpg.rf.2e40485785f6e5e2efec404301b235c2.jpg`
    *   `img-146_jpg.rf.61be25b3053a51f622a244980545df2b.jpg`
    *   `img-161_jpg.rf.211541e7178a4a93ec0680f26b905427.jpg`
    *   `img-390_jpg.rf.3eeb4356ab769c112edf7f482110f8ee.jpg`
    *   `img-394_jpg.rf.2182e193f33ed5bcce45df7df27032f7.jpg`
    *   `img-398_jpg.rf.0c484369fdb23fdec1b9250477fc5d1d.jpg`
    *   `img-410_jpg.rf.5f10f2bbde7900b5348aeaed6116b901.jpg`
    *   `img-634_jpg.rf.42d6e4ebdda859ab935130b75ae5808f.jpg`

*   **Which images were detected only by dataset_v3?**
    *   Total count: 0

*   **Which images were detected only by dataset_v4?**
    *   Total count: 11
    *   `img-179_jpg.rf.8632eb0d9b75fefe144829e67b75015a.jpg`
    *   `img-195_jpg.rf.f77a8f4d432a9a89235168ff8e09a650.jpg`
    *   `img-217_jpg.rf.20e267cdb167c43140e67ec9f5328040.jpg`
    *   `img-269_jpg.rf.f51d9eb8d02a34ac01d4a486cbfbdd4f.jpg`
    *   `img-276_jpg.rf.acc167b63d79ab3b99fd64b4109f86d4.jpg`
    *   `img-364_jpg.rf.e385283baa4507e9b6a79c9e92c4b453.jpg`
    *   `img-42_jpg.rf.532fb8eb05b1efc570c5e4165e614201.jpg`
    *   `img-44_jpg.rf.c0be863d6030f5d0cb241331c14ee532.jpg`
    *   `img-576_jpg.rf.f6cd32a51b0c518b58ff750ecab687d1.jpg`
    *   `img-68_jpg.rf.c8886ded10d01454f789376e4234ae74.jpg`
    *   `img-98_jpg.rf.667209472947ff4d519f65c6e206a7c3.jpg`

*   **Which model produced more false positives?**
    *   Both models produced the exact same number of false positives: **5** (at confidence threshold 0.25).
*   **Which model generalizes better to the external pothole dataset?**
    *   **Model B (dataset_v4)** generalizes significantly better. Model A (dataset_v3) had almost zero out-of-domain capability, detecting only 1 of 47 potholes (Recall = 2.1%). Model B detected 16 of 47 potholes (Recall = 34.0%) with high precision (Recall increases 16x). This is a direct benefit of incorporating candidates from the external domain splitting.

---

## 7. Final Actionable Verdict
*   **Final Verdict: `DATASET_V4 MODEL IS BETTER — CONTINUE WITH V4`**
*   **Recommendation:** Proceed with the `dataset_v4` model pipeline for further optimization. The integration of 47 candidate external pothole images into `dataset_v4` was highly successful, enabling the model to generalize to unseen domains.
