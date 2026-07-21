# Sprint 5.9.14 — External Pothole Dataset Deduplication and Train/Test Split

This report details quality validation, SHA-256 binary checks, perceptual near-duplicates matching, and split boundaries.

---

## 1. External Dataset Quality Checks
*   **Total External Images Scanned:** 67
*   **Total Valid Image-Label Pairs:** 67
*   **Corrupted Images Count:** 0
*   **Missing Label Files:** 0
*   **Orphan Label Files:** 0
*   **Invalid Annotations Format Bounds:** 0

---

## 2. Exact SHA-256 Duplicates Matches
*   **Exact duplicates matched:** 0

| External File | Project Workspace Matching File |
| :--- | :--- |
_No exact duplicate matches found with project datasets._


---

## 3. Perceptual dHash Near-Duplicates Matches (Hamming distance <= 2)
*   **Near-duplicates matched:** 0

| External File | Project Workspace Matching File | Hamming Distance |
| :--- | :--- | :---: |
_No visually similar near-duplicate matches found._


---

## 4. Dataset Partition Allocations (Seed = 42)
*   **Training Candidates Count:** 47
*   **Reserved External Test Images:** 20

---

## 5. Reserved External Test Images Log
*   `img-107_jpg.rf.2e40485785f6e5e2efec404301b235c2.jpg`
*   `img-146_jpg.rf.61be25b3053a51f622a244980545df2b.jpg`
*   `img-161_jpg.rf.211541e7178a4a93ec0680f26b905427.jpg`
*   `img-179_jpg.rf.8632eb0d9b75fefe144829e67b75015a.jpg`
*   `img-195_jpg.rf.f77a8f4d432a9a89235168ff8e09a650.jpg`
*   `img-217_jpg.rf.20e267cdb167c43140e67ec9f5328040.jpg`
*   `img-269_jpg.rf.f51d9eb8d02a34ac01d4a486cbfbdd4f.jpg`
*   `img-276_jpg.rf.acc167b63d79ab3b99fd64b4109f86d4.jpg`
*   `img-364_jpg.rf.e385283baa4507e9b6a79c9e92c4b453.jpg`
*   `img-390_jpg.rf.3eeb4356ab769c112edf7f482110f8ee.jpg`
*   `img-394_jpg.rf.2182e193f33ed5bcce45df7df27032f7.jpg`
*   `img-398_jpg.rf.0c484369fdb23fdec1b9250477fc5d1d.jpg`
*   `img-410_jpg.rf.5f10f2bbde7900b5348aeaed6116b901.jpg`
*   `img-42_jpg.rf.532fb8eb05b1efc570c5e4165e614201.jpg`
*   `img-44_jpg.rf.c0be863d6030f5d0cb241331c14ee532.jpg`
*   `img-472_jpg.rf.d71e2cae627685f2ad46e4182bbfb68a.jpg`
*   `img-576_jpg.rf.f6cd32a51b0c518b58ff750ecab687d1.jpg`
*   `img-634_jpg.rf.42d6e4ebdda859ab935130b75ae5808f.jpg`
*   `img-68_jpg.rf.c8886ded10d01454f789376e4234ae74.jpg`
*   `img-98_jpg.rf.667209472947ff4d519f65c6e206a7c3.jpg`


---

## 6. Final Recommendation Summary
*   **Verdict:** Both the train candidate and reserved test sets are verified.
*   **Next Steps:**
    1.  **Train candidates (47 images):** verified safe for model training because they do not overlap with any validation sets and are kept isolated under `train_candidates/`.
    2.  **Reserved external test set (20 images):** completely isolated under `external_test/` and will never be exposed during model training.
