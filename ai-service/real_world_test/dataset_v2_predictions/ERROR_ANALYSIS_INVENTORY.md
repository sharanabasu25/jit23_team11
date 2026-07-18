# Error Analysis Inventory

This inventory documents all missed detections (False Negatives) and false alarms (False Positives) on the isolated test set at the best confidence threshold of **0.50**.

| Image | Ground Truth Class | Prediction | Confidence | Error Type | Action |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **electricity_035.jpg** | Electricity | N/A (Missed) | 0.42 | `LOW_CONFIDENCE` | Collect more images of utility wires/poles against cluttered backgrounds. |
| **electricity_035.jpg** | Background (None) | Electricity | 0.52 | `FALSE_POSITIVE` | Add hard-negative background images containing vertical tree trunks or wires. |
| **pothole_008.jpg** | Pothole | N/A (Missed) | 0.00 | `MISSED_OBJECT` | Add pothole images on dark/wet asphalt textures under low-contrast conditions. |
| **pothole_016.jpg** | Pothole | N/A (Missed) | 0.00 | `MISSED_OBJECT` | Obtain training images showing potholes with shadow lines or tree branch overlays. |
| **pothole_018.jpg** | Pothole | N/A (Missed) | 0.05 | `LOW_CONFIDENCE` | Collect small-scale pothole examples with longer distance camera angles. |
| **pothole_041.jpg** | Pothole | N/A (Missed) | 0.00 | `MISSED_OBJECT` | Add small, shallow potholes that merge visually with surrounding road textures. |
| **water_leakage_014.jpg** | Water Leakage | N/A (Missed) | 0.00 | `MISSED_OBJECT` | Include training images of small wet fluid patches on highly reflective concrete pavements. |
| **water_leakage_014.jpg** | Background (None) | Water Leakage | 0.86 | `FALSE_POSITIVE` | Add negative pavement images containing strong shadows that mimic dark water outlines. |
| **water_leakage_046.jpg** | Background (None) | Water Leakage | 0.53 | `FALSE_POSITIVE` | Include negative images of wet pavements without leakage to reduce false positive detections. |

---

### Error Definition Glossary
*   **MISSED_OBJECT:** Ground truth object is completely ignored by the model (no prediction matches it above conf 0.01).
*   **LOW_CONFIDENCE:** An object-level prediction exists but has confidence below the operating threshold of 0.50 (e.g., between 0.01 and 0.49).
*   **WRONG_CLASS:** Bounding box matches IoU >= 0.50, but labels the wrong class ID.
*   **BAD_BOUNDING_BOX:** Prediction exists for the correct class, but has IoU overlap < 0.50.
*   **FALSE_POSITIVE:** Model predicts a bounding box (conf >= 0.50) on background with no ground truth.
*   **DIFFICULT_VISUAL_CASE:** Highly overlapping objects, severe occlusion, or extreme glare.
