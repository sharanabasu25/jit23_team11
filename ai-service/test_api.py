import os
import sys
import subprocess
import time
import requests
from PIL import Image
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("test_api_v6")

def run_tests():
    # 1. Start FastAPI server locally in the background
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_py_path = os.path.join(base_dir, "app.py")
    
    logger.info("Starting FastAPI server in the background...")
    # Run uvicorn server in a separate process
    # We specify a target python interpreter to run the server in the virtualenv context
    python_exe = sys.executable
    server_process = subprocess.Popen(
        [python_exe, app_py_path],
        cwd=base_dir
    )
    
    # Wait for the server to start up
    base_url = "http://127.0.0.1:8000"
    server_started = False
    for i in range(15):
        time.sleep(1)
        try:
            r = requests.get(f"{base_url}/", timeout=1)
            if r.status_code == 200:
                logger.info("FastAPI server started successfully and health check passed.")
                server_started = True
                break
        except Exception:
            pass
            
    if not server_started:
        logger.error("FastAPI server failed to start on http://127.0.0.1:8000 within 15 seconds.")
        sys.exit(1)
        
    test_failures = []
    
    # Import routing function directly to perform offline unit tests on boundary values
    try:
        from services.detector import determine_routing
    except Exception as e:
        logger.error(f"Failed to import determine_routing from services.detector: {e}")
        server_process.terminate()
        sys.exit(1)
        
    try:
        # --- UNIT TESTS: Confidence Boundary Values & Department Mapping logic ---
        logger.info("\n--- Running Unit Tests: Confidence Boundary Values & Class to Department mapping ---")
        
        # Test Case 7 & 10: 0.2499 -> SUPPRESS (not routed)
        res_boundary_1 = determine_routing("Pothole", 0.2499)
        assert res_boundary_1["routing_action"] == "SUPPRESS", f"Expected SUPPRESS, got {res_boundary_1['routing_action']}"
        assert res_boundary_1["class_name"] == "Unknown", f"Expected Unknown class when suppressed, got {res_boundary_1['class_name']}"
        assert res_boundary_1["department"] == "None", f"Expected None department when suppressed, got {res_boundary_1['department']}"
        assert res_boundary_1["confidence"] == 0.0, f"Expected 0.0 confidence when suppressed, got {res_boundary_1['confidence']}"
        logger.info("PASS: 0.2499 confidence -> SUPPRESS (no routing)")
        
        # Test Case 7 & 11: 0.25 -> HUMAN_REVIEW (medium confidence review)
        res_boundary_2 = determine_routing("Pothole", 0.25)
        assert res_boundary_2["routing_action"] == "HUMAN_REVIEW", f"Expected HUMAN_REVIEW, got {res_boundary_2['routing_action']}"
        assert res_boundary_2["class_name"] == "pothole", f"Expected pothole class, got {res_boundary_2['class_name']}"
        assert res_boundary_2["department"] == "Public Works Department", f"Expected Public Works Department, got {res_boundary_2['department']}"
        logger.info("PASS: 0.25 confidence -> HUMAN_REVIEW")
        
        # Test Case 7 & 11: 0.7499 -> HUMAN_REVIEW
        res_boundary_3 = determine_routing("Electricity", 0.7499)
        assert res_boundary_3["routing_action"] == "HUMAN_REVIEW", f"Expected HUMAN_REVIEW, got {res_boundary_3['routing_action']}"
        assert res_boundary_3["class_name"] == "electricity", f"Expected electricity class, got {res_boundary_3['class_name']}"
        logger.info("PASS: 0.7499 confidence -> HUMAN_REVIEW")
        
        # Test Case 7 & 12: 0.75 -> AUTO_ROUTE
        res_boundary_4 = determine_routing("Water Leakage", 0.75)
        assert res_boundary_4["routing_action"] == "AUTO_ROUTE", f"Expected AUTO_ROUTE, got {res_boundary_4['routing_action']}"
        assert res_boundary_4["class_name"] == "water_leakage", f"Expected water_leakage class, got {res_boundary_4['class_name']}"
        logger.info("PASS: 0.75 confidence -> AUTO_ROUTE")
        
        # Test Case 8: Correct department mappings
        res_dept_pothole = determine_routing("Pothole", 0.80)
        assert res_dept_pothole["department"] == "Public Works Department", f"Expected Public Works Department, got {res_dept_pothole['department']}"
        
        res_dept_elec = determine_routing("Electricity", 0.85)
        assert res_dept_elec["department"] == "Electricity Department", f"Expected Electricity Department, got {res_dept_elec['department']}"
        
        res_dept_water = determine_routing("Water Leakage", 0.90)
        assert res_dept_water["department"] == "Water Supply Board", f"Expected Water Supply Board, got {res_dept_water['department']}"
        logger.info("PASS: Class boundaries and department mappings verified successfully.")

        # Test Case 9: No cross-class routing (e.g. pothole doesn't route to Electricity Department)
        assert res_dept_pothole["department"] != "Electricity Department"
        assert res_dept_elec["department"] != "Public Works Department"
        logger.info("PASS: Confirmed NO cross-class routing.")

        # --- END-TO-END INTEGRATION TESTS VIA REGULAR API CALLS ---
        logger.info("\n--- Running End-to-End API Integration Tests ---")
        
        images_val_dir = os.path.join(base_dir, "dataset_v6_error_driven", "images", "val")
        
        # 1. Valid Pothole Detection
        logger.info("\nScenario 1: Testing Valid Pothole (pothole_006.jpg)")
        pth_image = os.path.join(images_val_dir, "pothole_006.jpg")
        if not os.path.exists(pth_image):
            raise FileNotFoundError(f"Missing test image: {pth_image}")
            
        with open(pth_image, "rb") as f:
            files = {"image": ("pothole_006.jpg", f, "image/jpeg")}
            r = requests.post(f"{base_url}/detect", files=files)
            assert r.status_code == 200, f"Expected 200, got {r.status_code}"
            res = r.json()
            logger.info(f"API Response: {res}")
            assert res["class_name"] == "pothole", f"Expected class 'pothole', got {res['class_name']}"
            assert res["department"] == "Public Works Department", f"Expected PWD, got {res['department']}"
            assert res["routing_action"] in ["AUTO_ROUTE", "HUMAN_REVIEW"]
            assert res["model_version"] == "V6"
            logger.info("PASS: Pothole detected, routed, and returned valid V6 API response.")

        # 2. Valid Electricity Detection
        logger.info("\nScenario 2: Testing Valid Electricity (electricity_003.jpg)")
        elec_image = os.path.join(images_val_dir, "electricity_003.jpg")
        if not os.path.exists(elec_image):
            raise FileNotFoundError(f"Missing test image: {elec_image}")
            
        with open(elec_image, "rb") as f:
            files = {"image": ("electricity_003.jpg", f, "image/jpeg")}
            r = requests.post(f"{base_url}/detect", files=files)
            assert r.status_code == 200, f"Expected 200, got {r.status_code}"
            res = r.json()
            logger.info(f"API Response: {res}")
            assert res["class_name"] == "electricity", f"Expected class 'electricity', got {res['class_name']}"
            assert res["department"] == "Electricity Department", f"Expected Electricity Department, got {res['department']}"
            assert res["routing_action"] in ["AUTO_ROUTE", "HUMAN_REVIEW"]
            assert res["model_version"] == "V6"
            logger.info("PASS: Electricity detected, routed, and returned valid V6 API response.")

        # 3. Valid Water Leakage Detection
        logger.info("\nScenario 3: Testing Valid Water Leakage (water_leakage_014.jpg)")
        water_image = os.path.join(images_val_dir, "water_leakage_014.jpg")
        if not os.path.exists(water_image):
            raise FileNotFoundError(f"Missing test image: {water_image}")
            
        with open(water_image, "rb") as f:
            files = {"image": ("water_leakage_014.jpg", f, "image/jpeg")}
            r = requests.post(f"{base_url}/detect", files=files)
            assert r.status_code == 200, f"Expected 200, got {r.status_code}"
            res = r.json()
            logger.info(f"API Response: {res}")
            assert res["class_name"] == "water_leakage", f"Expected class 'water_leakage', got {res['class_name']}"
            assert res["department"] == "Water Supply Board", f"Expected Water Supply Board, got {res['department']}"
            assert res["routing_action"] in ["AUTO_ROUTE", "HUMAN_REVIEW"]
            assert res["model_version"] == "V6"
            logger.info("PASS: Water Leakage detected, routed, and returned valid V6 API response.")

        # 4. Multiple Detections
        logger.info("\nScenario 4: Testing Multiple Detections")
        multi_image = os.path.join(images_val_dir, "water_leakage_036.jpg")
        if os.path.exists(multi_image):
            with open(multi_image, "rb") as f:
                files = {"image": ("water_leakage_036.jpg", f, "image/jpeg")}
                r = requests.post(f"{base_url}/detect", files=files)
                assert r.status_code == 200
                res = r.json()
                logger.info(f"API Response (Multiple): {res}")
                assert res["class_name"] in ["pothole", "electricity", "water_leakage"]
            logger.info("PASS: Successfully processed image with multiple potential objects.")

        # 5. Image with no valid detection
        logger.info("\nScenario 5: Testing Negative Image (negative_014.jpg)")
        neg_image = os.path.join(images_val_dir, "negative_014.jpg")
        if not os.path.exists(neg_image):
            raise FileNotFoundError(f"Missing test image: {neg_image}")
            
        with open(neg_image, "rb") as f:
            files = {"image": ("negative_014.jpg", f, "image/jpeg")}
            r = requests.post(f"{base_url}/detect", files=files)
            assert r.status_code == 200
            res = r.json()
            logger.info(f"API Response (Negative): {res}")
            assert res["class_name"] == "Unknown", f"Expected Unknown, got {res['class_name']}"
            assert res["routing_action"] == "SUPPRESS", f"Expected SUPPRESS, got {res['routing_action']}"
            assert res["department"] == "None", f"Expected None department, got {res['department']}"
            assert res["confidence"] == 0.0
            logger.info("PASS: Correctly suppressed image containing no detectable category.")

        # 6. Invalid image input (.txt file)
        logger.info("\nScenario 6: Testing Invalid Image Extension (.txt)")
        invalid_file_path = os.path.join(base_dir, "temp_test_text.txt")
        with open(invalid_file_path, "w") as f:
            f.write("Some dummy text data")
            
        try:
            with open(invalid_file_path, "rb") as f:
                files = {"image": ("temp_test_text.txt", f, "text/plain")}
                r = requests.post(f"{base_url}/detect", files=files)
                logger.info(f"API Response (Invalid Ext) Status: {r.status_code}, Body: {r.json()}")
                assert r.status_code == 400
                assert "Only JPG, JPEG, and PNG are allowed" in r.json()["detail"]
            logger.info("PASS: Upload request representing an invalid file extension was correctly rejected with HTTP 400.")
        finally:
            if os.path.exists(invalid_file_path):
                os.remove(invalid_file_path)

        # 7. Testing Corrupted Image content
        logger.info("\nScenario 7: Testing Corrupted Image Data")
        corrupted_file_path = os.path.join(base_dir, "temp_corrupted.png")
        with open(corrupted_file_path, "wb") as f:
            f.write(b"GARBAGE BYTES WHICH ARE NOT AN IMAGE")
            
        try:
            with open(corrupted_file_path, "rb") as f:
                files = {"image": ("temp_corrupted.png", f, "image/png")}
                r = requests.post(f"{base_url}/detect", files=files)
                assert r.status_code == 200
                res = r.json()
                logger.info(f"API Response (Corrupted): {res}")
                assert res["class_name"] == "Unknown"
                assert res["routing_action"] == "SUPPRESS"
            logger.info("PASS: Corrupted image content successfully handled and suppressed.")
        finally:
            if os.path.exists(corrupted_file_path):
                os.remove(corrupted_file_path)

        logger.info("\n" + "=" * 60)
        logger.info("                ALL API TEST CASES COMPLETED")
        logger.info("============================================================")

    except Exception as e:
        logger.error(f"Test Execution Failed: {e}", exc_info=True)
        test_failures.append(e)
    finally:
        # Shut down the background FastAPI server
        logger.info("Terminating FastAPI server...")
        server_process.terminate()
        server_process.wait()
        logger.info("FastAPI server terminated.")
        
    if test_failures:
        print("\nVerdict: FAIL")
        sys.exit(1)
    else:
        print("\nVerdict: PASS")
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
