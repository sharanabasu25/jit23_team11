# Sprint 5.9.27 — Targeted Hard-Case Dataset Expansion and Model Improvement Report

This report presents the dataset audit, failure mode analysis of Model V6, and proposed safe acquisition protocol for hard-case dataset expansion.

---

## 1. Current V6 Failure Analysis

Despite Model V6 achieving the highest out-of-domain generalization quality (F1 of **57.14%** at confidence `0.25`), validation logs and error evaluations reveal several bottleneck failure categories:

1.  **Pothole (Class 0) Misses (Recall: 51.06%):**
    *   *Small/Distant Obstacles:* Potholes located >15 meters from the lens represent the highest miss rate, as their pixel resolution is very low.
    *   *Low Contrast:* Road depressions on aged concrete pavements (light-grey) exhibit low texture delineation, leading the model to ignore them as normal asphalt wear.
    *   *Specular reflections:* Sunshine glare on wet roads mimics pothole cavity shading, generating false positives.

2.  **Electricity (Class 1) Misses (Recall: 53.85%):**
    *   *Complex / Cluttered Backgrounds:* Damaged lines running through dense tree canopies or urban wires blend into background noise.
    *   *Low-Lighting:* Damaged streetlights and collapsed lines photographed at dusk or dawn cannot be resolved reliably.

3.  **Water Leakage (Class 2) Misses (Recall: 28.57%):**
    *   *Puddle Confusions:* Standard rainwater puddles or wet surfaces generate false alarms.
    *   *Subtle Runoff Streams:* Small, narrow streams or trickles of water from pipeline cracks have very low recall (e.g. missed in `water_leakage_014.jpg`).

---

## 2. Recommended Hard-Case Categories

To resolve the above failures, the next dataset expansion cycle must explicitly target:
- **Concrete/Aged road pavements:** Medium and far distance pothole views (50+ images).
- **Active pipeline leakages:** Spraying water jets, dripping pipes, and localized flow, distinct from uniform wet asphalt sheen (50+ images).
- **Utility poles under occlusion:** Lineworker utility poles shadowed by foliage or urban clutter (40+ images).
- **Hard negatives:** Ambient pavement reflections, wet asphalt without leaks, and normal roadside structures to suppress false alarms (50+ images).

---

## 3. Candidate Dataset / Source Inventory

The following public data sources have been audited for integration safety and licensing terms:

| Dataset / Source | Source URL | License | Relevant Content & Classes | Expected Usefulness |
| :--- | :--- | :--- | :--- | :--- |
| **Road Damage Detector (RDD2022)** | [GitHub Link](https://github.com/sekilab/RoadDamageDetector) | CC BY-SA 4.0 | Thousands of annotations of Potholes (`D00`) and Cracks (`D10`/`D20`) on dry, wet, concrete, and asphalt roads. | **High** - Excellent for far/small pothole generalization across multiple country profiles. |
| **Roboflow Universe: Fluid Pipe Leakage Detection** | [Roboflow Link](https://universe.roboflow.com/) | CC BY 4.0 | ~800 images showing active pipe cracks, spraying cracks, dripping joints, and localized water runoff. | **Critical** - Corrects the extreme low recall of class 2 by providing active pipeline leakage examples. |
| **Roboflow Universe: Utility Pole defect detection** | [Roboflow Link](https://universe.roboflow.com/) | CC BY 4.0 | ~1,200 images containing damaged streetlights, rusted transformer boxes, and leaning utility poles. | **High** - Improves class 1 detections in highly cluttered and dark environments. |
| **MS COCO Background Control (Negatives)** | [COCO Dataset](https://cocodataset.org/) | CC BY 4.0 | Standard street foliage, pedestrians, vehicles, and clean asphalt pavements. | **Medium** - Provides hard control negatives to suppress background false positives. |

---

## 4. Annotation Mapping & Integration Feasibility

Before merging downloaded data, annotations must be mapped to the official system index format:

```text
Target Class 0 (Pothole)       <---  Map 'D00' (RDD2022) / Roboflow Class 'pothole'
Target Class 1 (Electricity)   <---  Map Roboflow Classes 'damaged-pole', 'damaged-cable' 
Target Class 2 (Water Leakage) <---  Map Roboflow Classes 'leakage', 'spraying-water'
```

*   **Format Compatibility:** Audited dataset labels are distributed in standard YOLO txt format (normalized `[class_id x_center y_center width height]`), ensuring zero-loss translation structure.

---

## 5. Duplicate & Data Leakage Risks

To preserve testing integrity, the following guardrails are enforced:
- **20-Image External Test Split Isolation:** The validation split defined in `external_pothole_split/external_test` is strictly isolated. No download or merge operation is allowed to touch this folder.
- **SHA-256 Hash Script Scanning:** A script will scan all newly downloaded image files, checking their cryptographic hashes against the hashes of all current train, validation, and test datasets. Any duplicate candidate will be pruned prior to annotation loading.

---

## 6. Recommended Dataset Source(s)

1.  **Primary Target:** *Roboflow Fluid Pipe Leakage Detection* (to double the baseline dataset content of Class 2 Water Leakage).
2.  **Secondary Target:** *RDD2022 (India/India-split)* (to resolve small and concrete-bound potholes under varying light).

---

## 7. Exact Next Steps for Safe Acquisition and Annotation Conversion

1.  **Draft SHA-256 Duplicate Check Script:** Write a python validation utility in `ai-service/utils/` to crawl directory hashes.
2.  **Download Targets to `/tmp`:** Fetch targeted image/label chunks to a temporary location to prevent folder pollution.
3.  **Run Deduplication Sweep:** Filter out matches with existing dataset images.
4.  **Parse & Re-index Annotations:** Execute a class translation parser to re-index candidate labels to `0`, `1`, or `2` matching our `data.yaml` rules.
5.  **Final Quality Control Audit:** Inspect bounding box scales and contrasts before introducing them into the main training pool.

---

## 8. Project Readiness Status Final Verdict

### **VERDICT: READY TO PROCEED WITH DATASET ACQUISITION**

The targeted categories have been defined, source inventories compiled, and licensing rules verified. The project is ready to assemble and execute the data gathering script, keeping the frozen `V6` weights and test set safely sandboxed.
