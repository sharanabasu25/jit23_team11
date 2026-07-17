import os
import sys
import requests
from PIL import Image

def run_tests():
    base_url = "http://127.0.0.1:8000"
    
    # 1. Confirm health check still works
    print("--- 1. Testing Health Endpoint ---")
    try:
        r = requests.get(f"{base_url}/")
        print("GET / Response:", r.status_code, r.json())
        assert r.status_code == 200
        assert r.json() == {"status": "running"}
    except Exception as e:
        print(f"Health check test failed: {e}")
        sys.exit(1)
        
    # 2. Confirm version endpoint still works
    print("\n--- 2. Testing Version Endpoint ---")
    try:
        r = requests.get(f"{base_url}/version")
        print("GET /version Response:", r.status_code, r.json())
        assert r.status_code == 200
        assert r.json() == {"version": "1.0"}
    except Exception as e:
        print(f"Version check test failed: {e}")
        sys.exit(1)
        
    # Locate assets
    base_dir = os.path.dirname(os.path.abspath(__file__))
    bus_path = os.path.join(base_dir, "venv", "Lib", "site-packages", "ultralytics", "assets", "bus.jpg")
    
    # 3. Test POST /detect with a valid image (matching the example)
    print("\n--- 3. Testing POST /detect with Valid Image (bus.jpg) ---")
    if not os.path.exists(bus_path):
        print(f"Error: {bus_path} does not exist!")
        sys.exit(1)
        
    try:
        with open(bus_path, "rb") as f:
            files = {"image": ("bus.jpg", f, "image/jpeg")}
            r = requests.post(f"{base_url}/detect", files=files)
            print("POST /detect (bus.jpg) Status:", r.status_code)
            res_json = r.json()
            print("POST /detect (bus.jpg) JSON Output:")
            for k, v in res_json.items():
                print(f"  {k}: {v}")
            
            assert r.status_code == 200
            assert "filename" in res_json
            assert "filepath" in res_json
            assert res_json["issue"] == "bus"
            assert res_json["confidence"] >= 0.50
            assert res_json["message"] == "Image uploaded and analyzed successfully"
            print("Valid image response verified successfully!")
    except Exception as e:
        print(f"Detection with valid image failed: {e}")
        sys.exit(1)
        
    # 4. Test POST /detect with a blank image (no detection expected)
    print("\n--- 4. Testing POST /detect with Blank Image ---")
    blank_name = "test_api_blank.png"
    img = Image.new("RGB", (192, 192), color="white")
    img.save(blank_name)
    
    try:
        with open(blank_name, "rb") as f:
            files = {"image": (blank_name, f, "image/png")}
            r = requests.post(f"{base_url}/detect", files=files)
            print("POST /detect (blank.png) Status:", r.status_code)
            res_json = r.json()
            print("POST /detect (blank.png) JSON Output:")
            for k, v in res_json.items():
                print(f"  {k}: {v}")
                
            assert r.status_code == 200
            assert res_json["issue"] == "Unknown"
            assert res_json["confidence"] == 0.0
            assert res_json["message"] == "No detectable object found"
            print("Blank image response verified successfully!")
    except Exception as e:
        print(f"Detection with blank image failed: {e}")
        sys.exit(1)
    finally:
        if os.path.exists(blank_name):
            os.remove(blank_name)
            
    # 5. Confirm validation rejects invalid formats
    print("\n--- 5. Testing POST /detect with Invalid Extension (.txt) ---")
    txt_name = "test_api_text.txt"
    with open(txt_name, "w") as f:
        f.write("Hello World")
        
    try:
        with open(txt_name, "rb") as f:
            files = {"image": (txt_name, f, "text/plain")}
            r = requests.post(f"{base_url}/detect", files=files)
            print("POST /detect (.txt) Status:", r.status_code)
            print("POST /detect (.txt) JSON Output:", r.json())
            assert r.status_code == 400
            assert "Only JPG, JPEG, and PNG are allowed" in r.json()["detail"]
            print("Invalid extension response verified successfully!")
    except Exception as e:
        print(f"Validation rejection verification failed: {e}")
        sys.exit(1)
    finally:
        if os.path.exists(txt_name):
            os.remove(txt_name)
            
    # 6. Test POST /detect with Corrupted Image (gibberish data saved as PNG)
    print("\n--- 6. Testing POST /detect with Corrupted Image ---")
    corr_name = "test_api_corrupted.png"
    with open(corr_name, "wb") as f:
        f.write(b"NOT A REAL IMAGE DATA - SYSTEM FAILS PILLOW VERIFY")
        
    try:
        with open(corr_name, "rb") as f:
            files = {"image": (corr_name, f, "image/png")}
            r = requests.post(f"{base_url}/detect", files=files)
            print("POST /detect (corrupted.png) Status:", r.status_code)
            res_json = r.json()
            print("POST /detect (corrupted.png) JSON Output:")
            for k, v in res_json.items():
                print(f"  {k}: {v}")
                
            assert r.status_code == 200
            assert res_json["issue"] == "Unknown"
            assert res_json["confidence"] == 0.0
            assert res_json["message"] == "No detectable object found"
            print("Corrupted image response verified successfully!")
    except Exception as e:
        print(f"Detection with corrupted image failed: {e}")
        sys.exit(1)
    finally:
        if os.path.exists(corr_name):
            os.remove(corr_name)

    print("\nALL TEST CASES PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
