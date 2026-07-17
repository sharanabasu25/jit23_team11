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
