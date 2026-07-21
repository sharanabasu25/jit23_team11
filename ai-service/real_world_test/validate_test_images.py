import os
import sys
import hashlib
from PIL import Image, UnidentifiedImageError

def calculate_md5(file_path):
    """Calculate MD5 hash of a file to check for exact content duplicates."""
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception:
        return None

def main():
    print("=" * 60)
    print("         Smart Public Grievance Management System")
    print("             REAL-WORLD TEST IMAGE VALIDATOR")
    print("=" * 60)

    # 1. Determine paths relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(script_dir, "images")
    
    # Dataset paths for checking separation
    ai_service_dir = os.path.dirname(script_dir)
    train_images_dir = os.path.join(ai_service_dir, "dataset", "images", "train")
    val_images_dir = os.path.join(ai_service_dir, "dataset", "images", "val")
    
    # Check that images directory exists
    if not os.path.exists(images_dir):
        print(f"[ERROR] Main images directory does not exist at: '{images_dir}'")
        print("Please create the 'real_world_test/images/' directory first.")
        sys.exit(1)
    
    print(f"[INFO] Images directory found: '{images_dir}'")
    
    # 2. Detect supported image files
    supported_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    all_files = os.listdir(images_dir)
    image_files = [f for f in all_files if f.lower().endswith(supported_extensions)]
    
    # 3. Report total number of test images
    total_images = len(image_files)
    print(f"[INFO] Total candidate test images detected: {total_images}")
    
    # 4. Warn if no images are found
    if total_images == 0:
        print("[WARNING] No test images found in the 'real_world_test/images/' directory!")
        print("Please add supported images (.jpg, .jpeg, .png, .webp) to proceed with evaluation.")
        print("-" * 60)
        print("Validation summary: FAILED (Empty images folder)")
        print("=" * 60)
        sys.exit(0)
        
    # Gather database of dataset image names and hashes for contamination check
    dataset_filenames = set()
    dataset_hashes = {}
    
    for split_dir, label in [(train_images_dir, "Train"), (val_images_dir, "Val")]:
        if os.path.exists(split_dir):
            for f in os.listdir(split_dir):
                if f.lower().endswith(supported_extensions):
                    dataset_filenames.add(f.lower())
                    path = os.path.join(split_dir, f)
                    h = calculate_md5(path)
                    if h:
                        dataset_hashes[h] = (f, label)
                        
    # 5 & 6. Verify each test image for corruption and separation
    corrupted_count = 0
    overlap_name_count = 0
    overlap_hash_count = 0
    valid_images = []
    
    print("\nAnalyzing test images...")
    for idx, filename in enumerate(image_files, 1):
        file_path = os.path.join(images_dir, filename)
        print(f"  [{idx}/{total_images}] {filename}: ", end="")
        
        # Check corruption/readability
        is_corrupted = False
        try:
            with Image.open(file_path) as img:
                img.verify()
            # Reopen to make sure it can be loaded fully
            with Image.open(file_path) as img:
                img.load()
        except (UnidentifiedImageError, IOError, SyntaxError) as e:
            is_corrupted = True
            corrupted_count += 1
            print("CORRUPTED/UNREADABLE (Failed PIL verification)")
            continue
            
        # Check separation
        has_overlap = False
        # A. Filename check
        if filename.lower() in dataset_filenames:
            # File name is in dataset, check if content is actually the same
            overlap_name_count += 1
            
        # B. Content hash check
        img_hash = calculate_md5(file_path)
        if img_hash in dataset_hashes:
            dup_name, dup_split = dataset_hashes[img_hash]
            print(f"DATA LEAK DETECTED! Content matches '{dup_name}' in {dup_split} dataset.")
            overlap_hash_count += 1
            has_overlap = True
        else:
            if filename.lower() in dataset_filenames:
                print("WARNING: Filename exists in dataset, but content is unique (different hash).")
            else:
                print("OK (Clean & Unique)")
                
        if not has_overlap:
            valid_images.append(filename)

    # 7. Print custom validation summary
    print("\n" + "=" * 60)
    print("                    VALIDATION SUMMARY")
    print("=" * 60)
    print(f"Total files checked:           {total_images}")
    print(f"Successfully validated:        {total_images - corrupted_count - overlap_hash_count}")
    print(f"Corrupted or unreadable files: {corrupted_count}")
    print(f"Filename overlaps:             {overlap_name_count} (warning only if contents differ)")
    print(f"Dataset content leaks (hash):  {overlap_hash_count}")
    
    print("-" * 60)
    if corrupted_count > 0:
        print("[WARNING] Some images are corrupted. They will be skipped during evaluation.")
    if overlap_hash_count > 0:
        print("[WARNING] Data leakage detected! Certain test images exist in the training/validation data.")
    elif total_images > 0 and corrupted_count == 0:
        print("[SUCCESS] All test images are clean, readable, and separate from the training/validation dataset.")
    print("=" * 60)

if __name__ == "__main__":
    main()
