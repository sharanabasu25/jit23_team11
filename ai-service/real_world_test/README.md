# Real-World Evaluation Pipeline - Smart Public Grievance Management System

This module provides a reusable, end-to-end evaluation pipeline to compare and validate the custom trained YOLOv8 grievance detection models on real-world unseen images separate from the training and validation datasets.

## Pipeline Directory Structure

```text
real_world_test/
├── images/                  # Place unseen evaluation images here (.jpg, .jpeg, .png, .webp)
├── predictions_20ep/        # Automatically populated with annotated images from Model A (20-epoch)
├── predictions_30ep/        # Automatically populated with annotated images from Model B (30-epoch)
├── reports/                 # Machine-readable output predictions and human-readable final reports
│   ├── predictions.json     # Full inference detection records in JSON
│   ├── predictions.csv      # Flat tabular representations in CSV format
│   └── MODEL_COMPARISON_REPORT.md  # Side-by-side quantitative and qualitative comparison
├── ground_truth.csv         # (Optional) Image-level ground truth classes for automatic accuracy calculation
├── validate_test_images.py  # Image validation, corruption check, and dataset-leak/separation scanner
└── evaluate_models.py       # Inference driver, metric evaluator, and comparison report compiler
```

---

## Getting Started & Execution

Before executing, make sure you are in the `ai-service` virtual environment.

### Setup Step 1: Add Test Images
Place your independent test images into the `real_world_test/images/` directory.

### Setup Step 2 (Optional): Define Ground Truth Labels
To compute accuracy, correct/incorrect predictions, and class breakdowns, create `real_world_test/ground_truth.csv` mapping image names to classes.

Format of `ground_truth.csv`:
```csv
filename,actual_class
pothole_001.jpg,Pothole
electricity_001.jpg,Electricity
water_leakage_001.jpg,Water Leakage
```

Supported classes match the official YOLO names:
- **Pothole**
- **Electricity**
- **Water Leakage**

### Step 3: Run the Image Validator
Ensure files are non-corrupted and confirm separation from training and validation splits:
```powershell
python real_world_test/validate_test_images.py
```

### Step 4: Run the Model Evaluator
Load both models, perform multi-threshold inference, save visual predictions, and output report statistics:
```powershell
python real_world_test/evaluate_models.py
```

Check `real_world_test/reports/MODEL_COMPARISON_REPORT.md` for recommendations based on test outcomes!
