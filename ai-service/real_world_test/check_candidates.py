import os

V5_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_v5_pothole_targeted"
IMPROVEMENT_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_improvement\source"
EXTERNAL_TEST_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\external_pothole_split\external_test\images"

def get_filenames(dir_path):
    filenames = set()
    if os.path.exists(dir_path):
        for root, _, files in os.walk(dir_path):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    filenames.add(f)
    return filenames

def main():
    # Load all files currently in V5 splits
    v5_train = get_filenames(os.path.join(V5_DIR, "images", "train"))
    v5_val = get_filenames(os.path.join(V5_DIR, "images", "val"))
    v5_test = get_filenames(os.path.join(V5_DIR, "images", "test"))
    
    # Load external test files
    external_test = get_filenames(EXTERNAL_TEST_DIR)
    
    print(f"Current V5 counts:")
    print(f"  Train: {len(v5_train)}")
    print(f"  Val: {len(v5_val)}")
    print(f"  Test: {len(v5_test)}")
    print(f"External Test: {len(external_test)}")
    
    # Check candidates in additional_positives
    add_pos_dir = os.path.join(IMPROVEMENT_DIR, "additional_positives")
    for category in ["pothole", "electricity", "water_leakage"]:
        cat_dir = os.path.join(add_pos_dir, category)
        cat_files = get_filenames(cat_dir)
        
        # Check overlaps
        train_overlap = cat_files.intersection(v5_train)
        val_overlap = cat_files.intersection(v5_val)
        test_overlap = cat_files.intersection(v5_test)
        ext_overlap = cat_files.intersection(external_test)
        
        available = cat_files - v5_train - v5_val - v5_test - external_test
        
        print(f"\nCategory: {category}")
        print(f"  Total Candidates in Improvement Folder: {len(cat_files)}")
        print(f"  Overlap with V5 train: {len(train_overlap)}")
        print(f"  Overlap with V5 val: {len(val_overlap)}")
        print(f"  Overlap with V5 test: {len(test_overlap)}")
        print(f"  Overlap with External Test: {len(ext_overlap)}")
        print(f"  Available for new training additions: {len(available)}")
        print(f"  Available list: {sorted(list(available))}")

    # Check candidates in dataset_expansion reviewed water_leakage
    expansion_wl_dir = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service\dataset_expansion\reviewed\water_leakage"
    cat_files = get_filenames(expansion_wl_dir)
    train_overlap = cat_files.intersection(v5_train)
    val_overlap = cat_files.intersection(v5_val)
    test_overlap = cat_files.intersection(v5_test)
    ext_overlap = cat_files.intersection(external_test)
    available_expansion = cat_files - v5_train - v5_val - v5_test - external_test
    print(f"\ndataset_expansion/reviewed/water_leakage:")
    print(f"  Total Candidates in expansion Folder: {len(cat_files)}")
    print(f"  Overlap with V5 train: {len(train_overlap)}")
    print(f"  Overlap with V5 val: {len(val_overlap)}")
    print(f"  Overlap with V5 test: {len(test_overlap)}")
    print(f"  Overlap with External Test: {len(ext_overlap)}")
    print(f"  Available for new training additions: {len(available_expansion)}")
    print(f"  Available list: {sorted(list(available_expansion))}")
        
    # Check candidates in hard_negatives
    hn_dir = os.path.join(IMPROVEMENT_DIR, "hard_negatives")
    for category in ["pothole", "electricity", "water_leakage"]:
        cat_dir = os.path.join(hn_dir, category)
        cat_files = get_filenames(cat_dir)
        
        train_overlap = cat_files.intersection(v5_train)
        val_overlap = cat_files.intersection(v5_val)
        test_overlap = cat_files.intersection(v5_test)
        ext_overlap = cat_files.intersection(external_test)
        
        available = cat_files - v5_train - v5_val - v5_test - external_test
        
        print(f"\nHard Negatives Category: {category}")
        print(f"  Total Candidates in Hard Negatives Folder: {len(cat_files)}")
        print(f"  Overlap with V5 train: {len(train_overlap)}")
        print(f"  Overlap with V5 val: {len(val_overlap)}")
        print(f"  Overlap with V5 test: {len(test_overlap)}")
        print(f"  Overlap with External Test: {len(ext_overlap)}")
        print(f"  Available for new training additions: {len(available)}")
        print(f"  Available list: {sorted(list(available))}")

if __name__ == "__main__":
    main()
