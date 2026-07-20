import os
import sys
import logging
from PIL import Image

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("test-detector")

try:
    from services.detector import detect_image
except ImportError as e:
    logger.error(f"Cannot import detect_image: {e}")
    sys.exit(1)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find a test image in the site packages
    grace_hopper_path = os.path.join(
        base_dir, "venv", "Lib", "site-packages", "matplotlib", "mpl-data", "sample_data", "grace_hopper.jpg"
    )
    if not os.path.exists(grace_hopper_path):
        # Fallback to ultralytics assets
        grace_hopper_path = os.path.join(
            base_dir, "venv", "Lib", "site-packages", "ultralytics", "assets", "bus.jpg"
        )
        
    logger.info(f"Target test image: {grace_hopper_path}")
    logger.info(f"Target test image exists: {os.path.exists(grace_hopper_path)}")

    # 1. Run detection on reference image (should contain objects like person, tie, bus, etc.)
    logger.info("--- Testing Detection with Real Image ---")
    res_pos = detect_image(grace_hopper_path)
    logger.info(f"Result parsed: {res_pos}")

    # 2. Run detection on a completely blank image to test "no detection"
    logger.info("--- Testing Detection with Blank Image (No Objects) ---")
    blank_image_path = os.path.join(base_dir, "test_blank.png")
    try:
        # Create a tiny blank white image
        img = Image.new("RGB", (128, 128), color="white")
        img.save(blank_image_path)
        
        res_neg = detect_image(blank_image_path)
        logger.info(f"Result parsed (Blank image): {res_neg}")
        
        # Verify conditions
        assert res_neg["issue"] == "Unknown", f"Expected 'Unknown' issue, got {res_neg['issue']}"
        assert res_neg["confidence"] == 0.0, f"Expected 0.0 confidence, got {res_neg['confidence']}"
        logger.info("SUCCESS: Blank image correctly returned 'Unknown' and 0.0 confidence.")
    finally:
        # Clean up
        if os.path.exists(blank_image_path):
            os.remove(blank_image_path)
            logger.info("Cleaned up blank test image.")
            

if __name__ == "__main__":
    main()
 