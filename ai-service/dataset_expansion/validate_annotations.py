# Programmatic Validation script for annotations
import os
import sys

WORKSPACE_DIR = r"c:\Users\Shreyas\OneDrive\Desktop\Main\ai-service"
EXPANSION_DIR = os.path.join(WORKSPACE_DIR, "dataset_expansion")
WORKSPACE_SUB = os.path.join(EXPANSION_DIR, "annotation_workspace")
REPORTS_DIR = os.path.join(EXPANSION_DIR, "reports")

def main():
    print("==================================================")
    print("PROGRAMMATIC ANNOTATIONS AUDIT RUN")
    print("==================================================")
    
    categories = ["pothole", "electricity", "water_leakage"]
    missing_labels = 0
    invalid_annotations = 0
    total_annotated = 0
    total_imgs = 0
    
    for cat in categories:
        cat_dir = os.path.join(WORKSPACE_SUB, cat)
        if not os.path.exists(cat_dir):
            continue
        imgs = [f for f in os.listdir(cat_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        total_imgs += len(imgs)
        
        for img in imgs:
            base, _ = os.path.splitext(img)
            lbl_path = os.path.join(cat_dir, base + ".txt")
            if not os.path.exists(lbl_path):
                missing_labels += 1
            else:
                total_annotated += 1
                try:
                    with open(lbl_path, 'r', encoding='utf-8') as lf:
                        lines = lf.readlines()
                    if len(lines) == 0:
                        print(f"[FAIL] Empty label file found for positive product: {lbl_path}")
                        invalid_annotations += 1
                        
                    for line in lines:
                        cont = line.strip()
                        if not cont: continue
                        parts = cont.split()
                        if len(parts) != 5:
                            print(f"[FAIL] Malformed annotation file: {lbl_path}")
                            invalid_annotations += 1
                            continue
                        try:
                            cid = int(parts[0])
                            coords = [float(x) for x in parts[1:]]
                        except ValueError:
                            print(f"[FAIL] Non-numeric contents in annotation: {lbl_path}")
                            invalid_annotations += 1
                            continue
                            
                        # Ranges
                        if cid not in [0, 1, 2]:
                            print(f"[FAIL] Out-of-bounds Class ID {cid} in {lbl_path}")
                            invalid_annotations += 1
                        for c in coords:
                            if not (0.0 <= c <= 1.0):
                                print(f"[FAIL] Out-of-bounds coordinate {c} in {lbl_path}")
                                invalid_annotations += 1
                        if coords[2] <= 0.0 or coords[3] <= 0.0:
                            print(f"[FAIL] Box bounds width/height <= 0 in {lbl_path}")
                            invalid_annotations += 1
                except Exception as e:
                    print(f"Error reading label {lbl_path}: {e}")
                    invalid_annotations += 1
                    
    # Generate reports/ANNOTATION_VALIDATION_REPORT.md
    report_path = os.path.join(REPORTS_DIR, "ANNOTATION_VALIDATION_REPORT.md")
    ready_status = "READY FOR DATASET BUILD" if (missing_labels == 0 and invalid_annotations == 0 and total_annotated == total_imgs and total_imgs > 0) else "ANNOTATION IN PROGRESS"
    
    report_md = f"""# Annotation Validation Report

This report outlines the audit checking of the local annotation workspace.

## Annotation Readiness: **{ready_status}**

*   **Total Images Scanned in Workspace:** {total_imgs}
*   **Annotated Images:** {total_annotated}
*   **Missing labels Count:** {missing_labels}
*   **Invalid labels Count:** {invalid_annotations}
"""
    with open(report_path, 'w', encoding='utf-8') as rf:
        rf.write(report_md)
        
    print(f"Created ANNOTATION_VALIDATION_REPORT.md at {report_path}")
    print(f"Readiness: {ready_status}")
    
if __name__ == '__main__':
    main()



