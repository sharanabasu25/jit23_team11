# AI Service - Smart Public Grievance Management System

This is the backend AI Service module for the Smart Public Grievance Management System. It is built using Python 3.12, FastAPI, and Uvicorn. 

Currently, in Sprint 1, the basic boilerplate, health endpoints, version management, configurations, and directory structure have been initialized.

---

## Folder Structure

```text
ai-service/
│
├── .env                  # Port selection, environments, metadata settings (local-only)
├── .env.example          # Template for environment variables
├── app.py                # Main application entry point, mounts routes & configures middleware
├── requirements.txt      # List of dependencies
├── README.md             # Setup and developer execution guide
│
├── models/               # ML models, weights, or serializations (Sprint 2+)
├── services/             # Application business logic (Sprint 2+)
├── uploads/              # Local storage for grievance attachments/media
└── utils/                # Utility utilities (e.g. config parser, helpers)
```

---

## Requirements

- Python 3.12+
- Virtual environment tool (e.g., `venv` or `conda`)

---

## Installation & Setup

1. **Navigate to the AI Service directory**:
   ```bash
   cd ai-service
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install all required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure Environment Variables**:
   By default, a `.env` file has been generated for you. If you need to make changes, copy `.env.example` file to `.env` and adjust the variables to your preference:
   ```bash
   cp .env.example .env
   ```

---

## Running the Application

You can start the FastAPI application in development mode (with auto-reload enabled):

```bash
python app.py
```

Or you can use Uvicorn command directly:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

---

## API Endpoints & Swagger Docs

Once the application starts, you can access the service endpoints at:

* **Base Health Check Endpoint**:
  * Action: `GET http://localhost:8000/`
  * Response: `{"status": "running"}`

* **Service Version Endpoint**:
  * Action: `GET http://localhost:8000/version`
  * Response: `{"version": "1.0"}`

* **Grievance Image Upload / Detection Endpoint**:
  * Action: `POST http://localhost:8000/detect`
  * Body: `multipart/form-data` with parameter name `image` (valid extensions: `.jpg`, `.jpeg`, `.png`)
  * Action Description: Uploads and sanitizes the grievance attachment media, saves it, and executes object scanning via `YOLODetectorService`.
  * **Adjusting Threshold**: You can configure the confidence threshold inside your `.env`:
    `YOLO_CONFIDENCE_THRESHOLD=0.50` (Will use `0.50` default if not specified)

  * **Example Success Response (Object Detected)**:
    ```json
    {
      "filename": "711b891e49bc4a0eb4cfef18edb9c510_bus.jpg",
      "filepath": "uploads/711b891e49bc4a0eb4cfef18edb9c510_bus.jpg",
      "issue": "bus",
      "confidence": 0.87,
      "message": "Image uploaded and analyzed successfully"
    }
    ```

  * **Example Response (No Detections or Below Threshold)**:
    ```json
    {
      "filename": "bd29f03d17b74b25ade26080d195aa33_blank.png",
      "filepath": "uploads/bd29f03d17b74b25ade26080d195aa33_blank.png",
      "issue": "Unknown",
      "confidence": 0.0,
      "message": "No detectable object found"
    }
    ```

* **Automatic Swagger API Documentation**:
  * `GET http://localhost:8000/docs`

* **ReDoc Documentation**:
  * `GET http://localhost:8000/redoc`

---

## YOLO Model Characteristics & Limitations

The current setup utilizes a pre-trained **YOLOv8 Nano (`yolov8n.pt`)** model. Developers should keep the following design parameters in mind:
1. **Class Scope Limitations**: The model detects standard COCO dataset classes (e.g. `person`, `car`, `fire hydrant`, `bench`). It does not natively detect specific civic grievances such as "potholes", "uncollected waste", or "blocked drains" without custom mapping.
2. **Context-Blindness**: Objects are identified purely by visual features. The service logic cannot determine the administrative department or priority without additional domain-specific rules.
3. **Resolution & Occlusion**: Input image size defaults to `640x640` pixels during inference. Night time captures, heavy overlaps, or highly truncated objects might drop below the confidence threshold.
4. **Threshold Impact**: The default threshold is configured at `0.50` (50%). Tuning the threshold down will increase recall (detecting more objects) but can lead to label noise, while raising it will prioritize precision.
