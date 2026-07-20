import os
import logging
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO
from utils.config import settings

logger = logging.getLogger("ai-service.detector")

# Define default path from configuration settings
DEFAULT_MODEL_PATH = settings.YOLO_MODEL_PATH
# Fallback to local default yolov8n.pt if settings model weight is missing
FALLBACK_MODEL_PATH = os.path.normpath(
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "yolov8n.pt")
)

class YOLODetectorService:
    _instance = None
    _model = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(YOLODetectorService, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    def get_model(cls, model_path: str = None) -> YOLO:
        """
        Loads the YOLO model only once (singleton) and returns the instance.
        Handles model loading errors safely with descriptive logs.
        """
        if model_path is None:
            # Check if configured path exists; if not, fallback
            if os.path.exists(DEFAULT_MODEL_PATH):
                model_path = DEFAULT_MODEL_PATH
            else:
                logger.warning(f"Configured model path {DEFAULT_MODEL_PATH} not found. Falling back to {FALLBACK_MODEL_PATH}")
                model_path = FALLBACK_MODEL_PATH

        if cls._model is None:
            try:
                logger.info(f"Model Loading - Attempting to load YOLOv8 model from path: {model_path}")
                # Ensure the containing directory exists
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                
                # Load the model
                cls._model = YOLO(model_path)
                logger.info("Model Loading - YOLOv8 model loaded successfully.")
            except Exception as e:
                logger.error(f"Model Loading - Failed loading YOLO model: {e}", exc_info=True)
                cls._model = None
                raise RuntimeError(f"YOLO model loading failed: {e}")
        return cls._model

    @classmethod
    def detect(cls, image_source, conf: float = 0.25, **kwargs):
        """
        Run detection using the loaded model instance.
        """
        model = cls.get_model()
        try:
            logger.info(f"Image Processing - Running object detection with conf={conf}")
            results = model(image_source, conf=conf, **kwargs)
            return results
        except Exception as e:
            logger.error(f"Image Processing - Detection failed: {e}", exc_info=True)
            raise RuntimeError(f"Object detection execution failed: {e}")

    @classmethod
    def detect_image(cls, image_path: str) -> dict:
        """
        Wrapper to run YOLOv8 object detection on a single image.
        Applies configured confidence threshold from settings and returns highest confidence detection.
        """
        return detect_image(image_path)

def detect_image(image_path: str) -> dict:
    """
    Runs YOLOv8 object detection on a single image.
    Applies the confidence threshold configured via settings (YOLO_CONFIDENCE_THRESHOLD).
    
    Expected result structure:
    {
        "issue": "detected_class",
        "confidence": 0.94
    }
    
    If nothing is detected (e.g. Below threshold, empty image) or execution fails:
    {
        "issue": "Unknown",
        "confidence": 0.0
    }
    """
    try:
        # 1. Handle missing files gracefully
        if not image_path:
            logger.warning("Image Processing - Failed: No image path provided.")
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }

        if not os.path.exists(image_path):
            logger.warning(f"Image Processing - Failed: File does not exist at '{image_path}'")
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }

        # 2. Check for invalid or corrupted image content using Pillow
        try:
            with Image.open(image_path) as img:
                img.verify()
        except UnidentifiedImageError:
            logger.error(f"Image Processing - Failed: Invalid image format (UnidentifiedImageError) for '{image_path}'")
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }
        except (IOError, SyntaxError) as e:
            logger.error(f"Image Processing - Failed: Corrupted image file (IOError/SyntaxError) for '{image_path}'. Error: {e}")
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }

        # 3. Retrieve threshold from configuration environment (defaults to 0.50)
        threshold = getattr(settings, "YOLO_CONFIDENCE_THRESHOLD", 0.50)
        logger.info(f"Image Processing - Running YOLO inference on '{image_path}' (threshold: {threshold:.2f})")
        
        # 4. Lazy-load model and run inference (wrapped in safe loading checks)
        model = YOLODetectorService.get_model()
        results = model(image_path, conf=threshold)
        
        best_conf = 0.0
        best_class = "Unknown"
        
        # Process detection results
        if results and len(results) > 0:
            boxes = results[0].boxes
            for box in boxes:
                # Extract confidence value
                conf = float(box.conf[0])
                if conf > best_conf:
                    best_conf = conf
                    class_id = int(box.cls[0])
                    best_class = results[0].names[class_id]
        
        # 5. Formulate return object
        if best_conf >= threshold:
            logger.info(f"Detection Results - Success: Found '{best_class}' with confidence {best_conf:.2f}")
            return {
                "issue": best_class,
                "confidence": round(best_conf, 2)
            }
        else:
            logger.info(f"Detection Results - No detection: No object found above confidence threshold of {threshold:.2f}")
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }

    except Exception as e:
        logger.error(f"Detection Errors - Image processing failed: {e}", exc_info=True)
        # Returns generic fallback without exposing exception details
        return {
            "issue": "Unknown",
            "confidence": 0.0
        }
