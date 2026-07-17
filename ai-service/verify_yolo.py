import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("verify-yolo")

try:
    from services.detector import YOLODetectorService
except ImportError as e:
    logger.error(f"Failed to import YOLODetectorService: {e}")
    sys.exit(1)

def test_singleton_and_loading():
    logger.info("--- Starting YOLODetectorService Verification ---")
    
    # 1. Loading first time
    logger.info("1. Retrieving YOLODetectorService model class (First Load)...")
    try:
        model1 = YOLODetectorService.get_model()
        logger.info(f"First model object address: {hex(id(model1))}")
    except Exception as e:
        logger.error(f"Failed to retrieve/initialize first model instance: {e}", exc_info=True)
        return False

    # 2. Loading second time
    logger.info("2. Retrieving YOLODetectorService model class again (Second Load)...")
    try:
        model2 = YOLODetectorService.get_model()
        logger.info(f"Second model object address: {hex(id(model2))}")
    except Exception as e:
        logger.error(f"Failed to retrieve second model instance: {e}", exc_info=True)
        return False

    # 3. Verify single instance
    if model1 is model2:
        logger.info("SUCCESS: Both loads returned the exact same object reference. Singleton verified!")
    else:
        logger.error("FAILURE: Model references are different. Singleton verification failed.")
        return False

    # 4. Verify functionality
    try:
        logger.info("3. Verifying model properties...")
        logger.info(f"YOLO class name configuration exists: {hasattr(model1, 'names')}")
        logger.info(f"Number of detectable classes: {len(model1.names)}")
        logger.info(f"First 5 classes: {[model1.names[i] for i in sorted(model1.names.keys())[:5]]}")
    except Exception as e:
        logger.error(f"Failed to inspect model properties: {e}")
        return False

    return True

if __name__ == "__main__":
    success = test_singleton_and_loading()
    if success:
        logger.info("--- Verification Successful ---")
        sys.exit(0)
    else:
        logger.error("--- Verification Failed ---")
        sys.exit(1)
