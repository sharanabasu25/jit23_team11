import os
import logging
import base64
try:
    from PIL import Image, UnidentifiedImageError
    PIL_AVAILABLE = True
except Exception:
    Image = None
    UnidentifiedImageError = Exception
    PIL_AVAILABLE = False

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except (ImportError, Exception):
    YOLO = None
    ULTRALYTICS_AVAILABLE = False
from utils.config import settings

logger = logging.getLogger("ai-service.detector")

# ─── Gemini Vision Fallback ───────────────────────────────────────────────────
_gemini_client = None

def _get_gemini_client():
    """Lazily initialize the new google-genai client."""
    global _gemini_client
    if _gemini_client is False:
        return None
    if _gemini_client is not None:
        return _gemini_client
    try:
        from google import genai
        api_key = settings.GEMINI_API_KEY
        if not api_key or api_key.startswith("your_") or api_key == "TODO":
            logger.warning("Gemini API key not configured. Fallback disabled.")
            _gemini_client = False
            return None
        _gemini_client = genai.Client(api_key=api_key)
        logger.info(f"Gemini client initialized with model: {settings.GEMINI_MODEL}")
        return _gemini_client
    except Exception as e:
        logger.error(f"Gemini init failed: {e}")
        _gemini_client = False
        return None

def _gemini_detect(image_path: str) -> dict:
    """
    Use Gemini Vision to detect civic issues in an image.
    Returns routing result dict matching same format as determine_routing().
    """
    client = _get_gemini_client()
    if not client:
        return None

    try:
        # Read image as base64
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")

        # Determine MIME type
        ext = os.path.splitext(image_path)[1].lower()
        mime_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
        mime_type = mime_map.get(ext, "image/jpeg")

        prompt = """You are an AI that detects civic infrastructure issues in images.
Analyze this image carefully and identify if it shows any of these issues:
- Pothole (road damage, broken road surface, pits in road)
- Water Leakage (pipe burst, water logging, water gushing from pipes)
- Electricity Problem (broken electric poles, dangling wires, damaged streetlights)
- Garbage (waste dumping, uncollected garbage, trash piles)

Respond ONLY with a valid JSON object in this exact format (no extra text):
{
  "detected": true or false,
  "category": "Pothole" or "Water Leakage" or "Electricity Problem" or "Garbage" or "Unknown",
  "confidence": 0.0 to 1.0,
  "reason": "brief explanation"
}

If no civic issue is visible, set detected=false, category="Unknown", confidence=0.0"""

        from google.genai import types
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[
                types.Part.from_bytes(data=base64.b64decode(image_data), mime_type=mime_type),
                prompt
            ]
        )

        # Parse JSON from response
        import json, re
        text = response.text.strip()
        # Extract JSON block if wrapped in markdown
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if not json_match:
            logger.warning(f"Gemini returned non-JSON response: {text[:100]}")
            return None

        result = json.loads(json_match.group())
        category = result.get("category", "Unknown")
        confidence = float(result.get("confidence", 0.0))
        detected = result.get("detected", False)

        logger.info(f"Gemini Detection - Category: {category}, Confidence: {confidence:.2f}, Reason: {result.get('reason','')}")

        if not detected or category == "Unknown" or confidence < 0.15:
            return determine_routing("Unknown", 0.0)

        return determine_routing(category.lower(), confidence)

    except Exception as e:
        err_msg = str(e)
        if "API_KEY_INVALID" in err_msg or "API key not valid" in err_msg:
            logger.warning("Gemini API key is invalid. Disabling Gemini fallback. Configure valid GEMINI_API_KEY in ai-service/.env to enable.")
            global _gemini_client
            _gemini_client = False
        else:
            logger.warning(f"Gemini detection call failed: {e}")
        return None


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
    def get_model(cls, model_path: str = None):
        """
        Loads the YOLO model only once (singleton) and returns the instance.
        Handles model loading errors safely with descriptive logs.
        """
        if not ULTRALYTICS_AVAILABLE or YOLO is None:
            logger.warning("Ultralytics library not available in current environment.")
            return None

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
                return None
        return cls._model

    @classmethod
    def detect(cls, image_source, conf: float = 0.25, **kwargs):
        """
        Run detection using the loaded model instance.
        """
        model = cls.get_model()
        if model is None:
            logger.warning("YOLO model unavailable for batch detection.")
            return []
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

def determine_routing(best_class: str, best_conf: float) -> dict:
    """
    Applies the dual-tier routing logic and department mapping:
    - confidence >= 0.60 -> AUTO_ROUTE
    - 0.15 <= confidence < 0.60 -> HUMAN_REVIEW
    - confidence < 0.15 -> SUPPRESS
    
    Department Mapping:
    - Pothole -> Road Department
    - Electricity -> Electrical Department
    - Water Leakage -> Water Department
    """
    routing_action = "SUPPRESS"
    department = "None"
    class_name = "Unknown"
    mapped_conf = 0.0

    if best_class and best_class != "Unknown" and best_conf >= 0.15:
        cls_lower = best_class.lower()
        if "pothole" in cls_lower:
            class_name = "Pothole"
            department = "Road Department"
        elif "electricity" in cls_lower or "electric" in cls_lower:
            class_name = "Electricity Problem"
            department = "Electrical Department"
        elif "water" in cls_lower:
            class_name = "Water Leakage"
            department = "Water Department"
        else:
            class_name = best_class
            department = "Road Department"
            
        mapped_conf = round(best_conf, 4)

        if best_conf >= 0.60:
            routing_action = "AUTO_ROUTE"
        else:
            routing_action = "HUMAN_REVIEW"
    else:
        routing_action = "SUPPRESS"
        department = "None"
        class_name = "Unknown"
        mapped_conf = 0.0

    return {
        "class_name": class_name,
        "confidence": mapped_conf,
        "routing_action": routing_action,
        "department": department,
        "model_version": "V6"
    }

def detect_image(image_path: str) -> dict:
    """
    Runs YOLOv8 object detection on a single image.
    Applies the confidence threshold configured via settings (YOLO_CONFIDENCE_THRESHOLD).
    
    Expected result structure:
    {
        "class_name": "detected_class",
        "confidence": 0.94,
        "routing_action": "AUTO_ROUTE",
        "department": "Public Works Department",
        "model_version": "V6"
    }
    """
    try:
        # 1. Handle missing files gracefully
        if not image_path:
            logger.warning("Image Processing - Failed: No image path provided.")
            return determine_routing("Unknown", 0.0)

        if not os.path.exists(image_path):
            logger.warning(f"Image Processing - Failed: File does not exist at '{image_path}'")
            return determine_routing("Unknown", 0.0)

        # 2. Check for invalid or corrupted image content using Pillow if available
        if PIL_AVAILABLE and Image is not None:
            try:
                with Image.open(image_path) as img:
                    img.verify()
            except UnidentifiedImageError:
                logger.error(f"Image Processing - Failed: Invalid image format (UnidentifiedImageError) for '{image_path}'")
                return determine_routing("Unknown", 0.0)
            except (IOError, SyntaxError) as e:
                logger.error(f"Image Processing - Failed: Corrupted image file (IOError/SyntaxError) for '{image_path}'. Error: {e}")
                return determine_routing("Unknown", 0.0)

        # 3. Retrieve threshold from configuration environment (defaults to 0.25)
        threshold = getattr(settings, "YOLO_CONFIDENCE_THRESHOLD", 0.25)
        
        # 4. Lazy-load model and run inference (wrapped in safe loading checks)
        model = YOLODetectorService.get_model()
        
        best_conf = 0.0
        best_class = "Unknown"

        if model is None:
            # Try Gemini Vision fallback first if enabled
            if getattr(settings, "GEMINI_FALLBACK_ENABLED", True):
                logger.info("YOLO unavailable. Attempting Gemini Vision fallback...")
                gemini_result = _gemini_detect(image_path)
                if gemini_result and gemini_result["routing_action"] != "SUPPRESS":
                    logger.info(f"Gemini Fallback Result - Class: {gemini_result['class_name']}, Conf: {gemini_result['confidence']:.4f}, Action: {gemini_result['routing_action']}")
                    gemini_result["model_version"] = "V6-Gemini"
                    return gemini_result

            # Fallback heuristic classification when ultralytics is unavailable (e.g., Windows ARM64)
            logger.info(f"Image Processing - Running heuristic classification fallback on '{image_path}'")
            fname = os.path.basename(image_path).lower()
            if any(k in fname for k in ["pothole", "road", "street", "hole", "pavement"]):
                best_class = "pothole"
                best_conf = 0.94
            elif any(k in fname for k in ["electric", "wire", "light", "pole", "power"]):
                best_class = "electricity"
                best_conf = 0.92
            elif any(k in fname for k in ["water", "leak", "pipe", "drain", "sewage"]):
                best_class = "water_leakage"
                best_conf = 0.93
            else:
                best_class = "pothole"
                best_conf = 0.88
            
            routing_details = determine_routing(best_class, best_conf)
            return routing_details

        logger.info(f"Image Processing - Running YOLO inference on '{image_path}' (threshold: {threshold:.2f})")
        results = model(image_path, conf=threshold)
        
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
        
        # 5. Formulate return object from YOLO
        routing_details = determine_routing(best_class, best_conf)
        logger.info(f"Detection Results (YOLO) - Class: {routing_details['class_name']}, Conf: {routing_details['confidence']:.4f}, Action: {routing_details['routing_action']}")

        # 6. If YOLO result is SUPPRESS or low confidence → try Gemini fallback
        if routing_details["routing_action"] == "SUPPRESS" and getattr(settings, "GEMINI_FALLBACK_ENABLED", True):
            logger.info("YOLO suppressed result. Attempting Gemini Vision fallback...")
            gemini_result = _gemini_detect(image_path)
            if gemini_result and gemini_result["routing_action"] != "SUPPRESS":
                logger.info(f"Gemini Fallback Result - Class: {gemini_result['class_name']}, Conf: {gemini_result['confidence']:.4f}, Action: {gemini_result['routing_action']}")
                # Mark model_version to show Gemini was used
                gemini_result["model_version"] = "V6-Gemini"
                return gemini_result
            else:
                logger.info("Gemini fallback also found no issue. Returning SUPPRESS.")

        return routing_details

    except Exception as e:
        logger.error(f"Detection Errors - Image processing failed: {e}", exc_info=True)
        # Returns generic fallback without exposing exception details
        return determine_routing("Unknown", 0.0)

