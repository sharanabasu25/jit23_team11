import glob
import os
from services.detector import detect_image

val_imgs = glob.glob('dataset/images/val/*.*')[:10]
success_count = 0

print("="*60)
print("       SPGMS 10-IMAGE DETECTOR ACCURACY BENCHMARK      ")
print("="*60)

for i, img in enumerate(val_imgs, 1):
    res = detect_image(img)
    is_detected = res['class_name'] != 'Unknown'
    if is_detected:
        success_count += 1
    fname = os.path.basename(img)
    cls = res['class_name']
    conf = res['confidence'] * 100
    dept = res['department']
    action = res['routing_action']
    status_icon = "✅" if is_detected else "❌"
    print(f"{status_icon} [{i:2d}/10] {fname:<35} -> {cls} ({conf:.1f}%) | {dept} [{action}]")

print("="*60)
print(f"🎯 Total Successfully Detected: {success_count}/10 ({(success_count/len(val_imgs))*100:.0f}%)")
print("="*60)
