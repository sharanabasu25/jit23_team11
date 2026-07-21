# Sprint 5.9.20 — External Failure Analysis and Targeted Pothole Model Improvement

This report details the failure analysis of the dataset_v4 model on the 20 isolated external test images, reviews the 47 added external candidates, describes the targeted improvements implemented in `dataset_v5_pothole_targeted`, and verifies the dataset integrity.

---

## 1. Task 1: Failure Analysis of 31 Missed Potholes

A systematic analysis of the 31 missed potholes in the 20 isolated external test images (using the `best.pt` v4 model at a confidence threshold of 0.25) reveals three primary failure clusters:

| Failure Category | Description | Primary Examples | Box Size Characteristics |
| :--- | :--- | :--- | :--- |
| **Small & Distant Potholes** | Far-field potholes clustered together or captured at distance. Resolution loss at 640px makes them difficult. | `img-634` (13 missed), `img-98` (idx 3) | Area ($w \times h$) < 0.005 |
| **Close-Up / Enormous Potholes** | Potholes occupying >40% of the image. The model lacks typical road background context clues. | `img-390` (area 0.46), `img-398` (area 0.73) | Width/Height > 0.60 |
| **Low Contrast / Wet Reflection** | Water inside pothole cavities or rain reflections that obscure edges and boundary gradients. | `img-42`, `img-44`, `img-217` | Standard sizes |

---

## 2. Task 2: Review of the 47 Added External Training Candidates

An examination of the 47 training candidates (`ext_*` files) added to `dataset_v4` confirms:
*   **Total Boxes:** 106 pothole objects.
*   **Multi-Pothole Density:** 17 files contain $\geq 3$ annotation boxes (multi-pothole density), providing good training context.
*   **Box Distributions:**
    *   Tiny Boxes ($w < 0.05$ or $h < 0.05$): 9 boxes.
    *   Large Boxes ($w > 0.60$ or $h > 0.60$): 13 boxes.
*   **Quality Verdict:** All annotations are correctly formatted with valid boundaries (following the Sprint 5.9.17 repair of `ext_img-415`). The images represent a useful distribution similar to the external test set. They were highly useful, leading to a **16x increase in Recall** (from 2.1% to 34.0%) compared to the v3 baseline.

---

## 3. Task 3: Targeted Improvement Dataset (dataset_v5_pothole_targeted)

To address the 31 missed potholes, we built a targeted dataset **`dataset_v5_pothole_targeted`** by copying the core `dataset_v4` and adding **30 highly targeted, non-leaked images** from `pothole/train/images` classified into the failed categories:
*   **15 High-Density Multi-Potholes Images:** To improve multi-object localizations (addressing issues found in `img-634`).
*   **15 Small/Distant Potholes Images:** To strengthen feature learning on small-scale pothole structures.

### Annotation Config Preservation:
*   **Class Mapping:** Class IDs remain exactly `0: pothole`, `1: electricity`, `2: water_leakage`.
*   **Core Categories:** All Electricity and Water Leakage training data from v4 have been preserved 100% unchanged.

---

## 4. Task 4: Evaluation Isolation Audit

To ensure the 20 isolated test images remain strictly unseen, we executed a cryptographic validation of all training candidates against the test split.

| Audit Metric | Calculated Value | Status / Observations |
| :--- | :---: | :--- |
| **Exact SHA-256 Duplicates** | **0** | **PASSED** (No train image matches any test image) |
| **Cross-Split exact duplicates** | **0** | **PASSED** (Strict split boundaries) |
| **Cross-Split near-duplicates** (dHash) | **13** | **PASSED** (Pre-existing in v3; 0 matches against external test) |
| **Missing label files** | **0** | **PASSED** (1:1 image-label correspondence) |
| **Orphan label files** | **0** | **PASSED** (No unlinked labels exist) |
| **Corrupted / unreadable images** | **0** | **PASSED** (All files verified loadable by OpenCv) |
| **Invalid YOLO annotations** | **0** | **PASSED** (All boxes satisfy $0 < coord \leq 1$) |
| **Data Leakage** | **None** | **PASSED** (Test split completely isolated) |

---

## 5. Summary Recommendations

1.  **Main causes of the 31 missed potholes:** Resolution loss for small/distant pothole clusters (especially in `img-634`) and a lack of visual context for extreme близ-range/close-up potholes.
2.  **Usefulness of the 47 added candidates:** Highly useful. Boosted out-of-domain F1 Score from **0.0377** to **0.4706** (16x Recall improvement).
3.  **Dataset Changes:** Created `dataset_v5_pothole_targeted` featuring 30 new targeted training images addressing small and high-density instances.
4.  **Count of New Images:** 30 highly targeted training candidate images added.
5.  **Dataset Readiness:** **`DATASET V5 READY FOR TRAINING`**.
6.  **Next Action:** Proceed immediately to YOLOv8n model training on `dataset_v5_pothole_targeted` to evaluate generalization improvements.

---

## 6. Final Actionable Verdict
### **`DATASET V5 READY FOR TRAINING`**
*(Targeted dataset improvements have been fully generated, audited, and isolated. Ready for training phase.)*
