# Custom YOLOv8 Training Configuration Document

This document defines the configuration parameters aimed for custom YOLOv8 model training.

## Dataset Specifications
*   **Dataset Root Path:** `c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset`
*   **Dataset Configuration File:** `dataset/data.yaml`
*   **Number of Classes:** 3
*   **Classes Mapping:**
    *   0: Pothole
    *   1: Electricity
    *   2: Water Leakage

## Proposed Training Hyperparameters
*   **Base Pretrained Model:** `models/yolov8n.pt` (YOLOv8 Nano, recommended for edge/runtime systems)
*   **Input Image Resolution:** `640` (images will be auto-scaled to 640x640 during training)
*   **Proposed Epochs:** `50` (good starting baseline for convergence monitoring)
*   **Proposed Batch Size:** `16` (adjust based on hardware VRAM availability)
*   **Optimization Engine:** `AdamW` or `SGD` (YOLOv8 defaults of auto-optimizer selection)

## Target Platform Allocation
*   **Hardware Accelerator:** `CPU (13th Gen Intel(R) Core(TM) i7-13700H)`
*   **Expected Outputs Location:** Outputs will be saved in `runs/detect/train/` inside project directory.
