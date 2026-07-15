import logging
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import configurations
from utils.config import settings
# Import services
from services.upload_service import validate_and_save_image

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
    message: str = Field(..., description="Status message of the upload confirmation")


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
    description="Accepts an image via multipart/form-data, validates it, and saves it to the uploads directory."
)
async def detect(image: UploadFile = File(...)):
    """
    Accepts an image inside a multipart form request, validates that it has a valid extension (jpg, jpeg, png),
    and saves the file locally in the uploads folder.
    """
    logger.info("Detect endpoint requested for file upload.")
    return validate_and_save_image(image)


# Entrypoint to run the server directly using Uvicorn
if __name__ == "__main__":
    logger.info(f"Starting {settings.APP_NAME} in environment: {settings.ENV}")
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == "development"
    )
