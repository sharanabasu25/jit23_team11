import logging
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import configurations
from utils.config import settings
import os
# Import services
from services.upload_service import validate_and_save_image
from services.detector import detect_image

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ai-service")

# Initialize FastAPI application with Swagger metadata
app = FastAPI(
    title=settings.APP_NAME,
    description="AI backend service for Smart Public Grievance Management System. "
                "Handles image scanning, automatic category classification, and prioritization.",
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware to allow cross-origin requests from potential client apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production environments to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define Schema Classes for response documentation
class HealthStatus(BaseModel):
    status: str = Field(..., description="The operational status of the service", examples=["running"])


class ServiceVersion(BaseModel):
    version: str = Field(..., description="The semantic version of the service API", examples=["1.0"])


class DetectResponse(BaseModel):
    filename: str = Field(..., description="The unique name under which the file was saved")
    filepath: str = Field(..., description="The relative path to the saved file")
    issue: str = Field(..., description="The type of issue detected in the image (backwards compatible)")
    class_name: str = Field(..., description="The type of issue detected in the image")
    confidence: float = Field(..., description="Confidence score associated with the detected class/issue")
    routing_action: str = Field(..., description="The automatic or manual review action to take (AUTO_ROUTE, HUMAN_REVIEW, SUPPRESS)")
    department: str = Field(..., description="The agency to route the grievance to")
    model_version: str = Field(..., description="Semantic or major version of model used")
    message: str = Field(..., description="Status message of the upload and analysis confirmation")


# Root Endpoint (Health check)
@app.get(
    "/",
    response_model=HealthStatus,
    summary="Health Check Endpoint",
    description="Verifies if the AI service application is running and accessible."
)
async def health_check():
    """
    Returns the current operational status of the service.
    """
    logger.info("Health check endpoint requested.")
    return {"status": "running"}


# Version Endpoint
@app.get(
    "/version",
    response_model=ServiceVersion,
    summary="Version Endpoint",
    description="Returns the current semantic version of the AI service."
)
async def get_version():
    """
    Returns the loaded version configuration of the service.
    """
    logger.info("Version endpoint requested.")
    return {"version": settings.API_VERSION}


# Image upload endpoint
@app.post(
    "/detect",
    response_model=DetectResponse,
    summary="Detect / Image Upload Endpoint",
    description="Accepts an image via multipart/form-data, validates it, saves it to the uploads directory, and runs object detection."
)
async def detect(image: UploadFile = File(...)):
    """
    Accepts an image inside a multipart form request, validates/saves the file locally, 
    and runs YOLOv8 model detection to extract the highest-confidence category.
    """
    logger.info("Detect endpoint requested for file upload and image analysis.")
    
    # 1. Upload and save the image
    upload_result = validate_and_save_image(image)
    
    # Get absolute path for inference
    saved_path = os.path.abspath(upload_result["filepath"])
    
    # 2. Run YOLO detection safely
    try:
        detection = detect_image(saved_path)
    except Exception as e:
        logger.error(f"Error during YOLO detection on {saved_path}: {e}", exc_info=True)
        from services.detector import determine_routing
        detection = determine_routing("Unknown", 0.0)
    
    # 3. Determine the message based on detection results
    if detection["routing_action"] != "SUPPRESS":
        message = "Image uploaded and analyzed successfully"
    else:
        message = "No detectable object found"
        
    return {
        "filename": upload_result["filename"],
        "filepath": upload_result["filepath"],
        "issue": detection["class_name"],
        "class_name": detection["class_name"],
        "confidence": detection["confidence"],
        "routing_action": detection["routing_action"],
        "department": detection["department"],
        "model_version": detection["model_version"],
        "message": message
    }


# Entrypoint to run the server directly using Uvicorn
if __name__ == "__main__":
    logger.info(f"Starting {settings.APP_NAME} in environment: {settings.ENV}")
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == "development"
    )
