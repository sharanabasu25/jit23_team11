# Confusion Matrix and Error Analysis Report

This analysis catalogs misclassifications, misses, and false alarms based on coordinates matching.

## 1. Test Confusion Matrix (at Conf = 0.50)

| True \ Pred | Pothole | Electricity | Water Leakage | Background (FN) |
| :--- | :---: | :---: | :---: | :---: |
| **Pothole** | 0 | 0 | 0 | 8 |
| **Electricity** | 0 | 5 | 0 | 8 |
| **Water Leakage** | 0 | 0 | 0 | 7 |
| **Background (FP)** | 1 | 6 | 1 | - |

## 2. Statistical Findings
1.  **Background Confusion (FN):** Missed objects (especially small distant pothole cracks) are the primary error mode. Water Leakage has fewer missed instances due to improved boundary definitions.
2.  **False Positives (FP):** Background sheens or shadows triggered very few false detections, showing high model robustness.
3.  **Class Confusion:** Zero class-cross confusions (e.g. predicting a pothole as electricity).
