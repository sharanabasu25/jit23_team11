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

* **Automatic Swagger API Documentation**:
  * `GET http://localhost:8000/docs`

* **ReDoc Documentation**:
  * `GET http://localhost:8000/redoc`
