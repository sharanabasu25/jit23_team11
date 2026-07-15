import os
import uuid
import shutil
import logging
from fastapi import UploadFile, HTTPException, status

logger = logging.getLogger("ai-service.upload-service")

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
# Uploads dir relative to project structure (ai-service/uploads)
UPLOAD_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
)

def validate_and_save_image(image: UploadFile) -> dict:
    """
    Validates that the upload file is not empty and has a valid image extension.
    Saves the file to the uploads directory with a unique, safe filename.
    """
    # 1. Validate file exists
    if not image or not image.filename:
        logger.warning("Upload attempt with no file or empty filename.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided."
        )
    
    # 2. Extract and validate extension
    filename = image.filename
    _, ext = os.path.splitext(filename)
    ext = ext.lower().lstrip(".")
    
    if ext not in ALLOWED_EXTENSIONS:
        logger.warning(f"File upload rejected. Invalid extension: {ext} for file: {filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Only JPG, JPEG, and PNG are allowed."
        )
    
    # Ensure the upload directory exists
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Failed to create uploads directory: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error setting up storage."
        )
    
    # 3. Generate unique filename to avoid name collisions in production
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.normpath(os.path.join(UPLOAD_DIR, unique_filename))
    
    # 4. Save file to disk
    logger.info(f"Saving uploaded image {filename} as {unique_filename}")
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        logger.error(f"Error saving file {filename}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save image locally: {str(e)}"
        )
    finally:
        image.file.close()

    # Returns the path relative to the app's execution context
    relative_filepath = os.path.normpath(os.path.join("uploads", unique_filename))

    return {
        "filename": unique_filename,
        "filepath": relative_filepath,
        "message": "Image uploaded successfully"
    }
