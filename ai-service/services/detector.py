import os
import logging
from ultralytics import YOLO

logger = logging.getLogger("ai-service.detector")

# Define the models directory and default path relative to this file
MODELS_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
)
DEFAULT_MODEL_PATH = os.path.normpath(os.path.join(MODELS_DIR, "yolov8n.pt"))

class YOLODetectorService:
    _instance = None
    _model = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(YOLODetectorService, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    def get_model(cls, model_path: str = DEFAULT_MODEL_PATH) -> YOLO:
        """
        Loads the YOLO model only once (singleton) and returns the instance.
        """
        if cls._model is None:
            try:
                logger.info(f"Loading YOLOv8 model from path: {model_path}")
                # Ensure the containing directory exists
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                
                # Instantiate YOLO. If the model file is not local, 
                # Ultralytics will automatically download it.
                cls._model = YOLO(model_path)
                logger.info("YOLOv8 model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load YOLO model: {e}", exc_info=True)
                cls._model = None
                raise RuntimeError(f"YOLO model loading failed: {e}")
        return cls._model

    @classmethod
    def detect(cls, image_source, conf: float = 0.25, **kwargs):
        """
        Run detection using the loaded model instance.
        
        Args:
            image_source: Path to an image file, PIL image, numpy array, etc.
            conf: Confidence threshold for predictions.
            **kwargs: Extra parameters to pass to YOLO.
            
        Returns:
            list: List of ultralytics.engine.results.Results objects.
        """
        model = cls.get_model()
        try:
            logger.info(f"Running object detection with conf={conf}")
            results = model(image_source, conf=conf, **kwargs)
            return results
        except Exception as e:
            logger.error(f"Detection failed: {e}", exc_info=True)
            raise RuntimeError(f"Object detection execution failed: {e}")

    @classmethod
    def detect_image(cls, image_path: str) -> dict:
        """
        Wrapper to run YOLOv8 object detection on a single image.
        Applies a confidence threshold of 0.50 and returns the highest confidence detection.
        """
        return detect_image(image_path)

def detect_image(image_path: str) -> dict:
    """
    Runs YOLOv8 object detection on a single image.
    Applies a confidence threshold of 0.50 and returns the highest confidence detection.
    
    Expected result format:
    {
        "issue": "detected_class",
        "confidence": 0.94
    }
    
    If nothing is detected (or conf < 0.50):
    {
        "issue": "Unknown",
        "confidence": 0.0
    }
    """
    try:
        # Validate path exists
        if not image_path or not os.path.exists(image_path):
            logger.warning(f"Image path does not exist or was empty: {image_path}")
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }

        # Lazy load the singleton YOLO model
        model = YOLODetectorService.get_model()
        
        logger.info(f"Running YOLO inference on {image_path} with confidence threshold 0.50")
        
        # Run inference using the threshold parameter
        results = model(image_path, conf=0.50)
        
        best_conf = 0.0
        best_class = "Unknown"
        
        # Process the single image's results
        if results and len(results) > 0:
            boxes = results[0].boxes
            for box in boxes:
                # Extract confidence value
                conf = float(box.conf[0])
                if conf > best_conf:
                    best_conf = conf
                    class_id = int(box.cls[0])
                    best_class = results[0].names[class_id]
        
        # Verify best confidence meets expected threshold
        if best_conf >= 0.50:
            return {
                "issue": best_class,
                "confidence": round(best_conf, 2)
            }
        else:
            return {
                "issue": "Unknown",
                "confidence": 0.0
            }
    except Exception as e:
        logger.error(f"Error executing detect_image on {image_path}: {e}", exc_info=True)
        # Proper error handling returning default unknown result as robust fallback
        return {
            "issue": "Unknown",
            "confidence": 0.0
        }
