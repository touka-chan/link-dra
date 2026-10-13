"""Stress-test the payment QR under conditions a phone camera actually creates.

A QR that decodes cleanly in a desktop library can still fail in the wild. The
buyer scans it off a screen, so the image gets scaled down, the lens adds a
little blur, and the camera re-compresses it. Each condition below is applied to
the shipped file and decoded again; the pass rate is the real confidence signal.

Run:  python scripts\\qr-robustness.py
"""

from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "public" / "qr.png"

# Widths the QR is actually rendered at by the pay modal.
WIDTHS = [360, 300, 240, 200]
# Below roughly this the modules drop to one or two pixels and no amount of
# error correction saves them, so those cases are reported but not scored.
UNSCORABLE_BELOW = 200


def decode(img):
    data, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    return data


def main():
    original = cv2.imread(str(TARGET), cv2.IMREAD_GRAYSCALE)
    if original is None:
        raise SystemExit(f"cannot read {TARGET}")

    reference = decode(original)
    if not reference:
        raise SystemExit("shipped QR does not decode at full size; fix that first")
    print(f"baseline payload ok, {len(reference)} chars, "
          f"{original.shape[1]}x{original.shape[0]}\n")

    scored = []

    def case(label, img, counts=True):
        ok = decode(img) == reference
        if counts:
            scored.append(ok)
        print(f"  {'PASS' if ok else 'FAIL'}  {label}")

    for w in WIDTHS:
        h = int(original.shape[0] * w / original.shape[1])
        small = cv2.resize(original, (w, h), interpolation=cv2.INTER_AREA)
        counts = w >= UNSCORABLE_BELOW
        case(f"rendered at {w}px", small, counts)
        # A phone lens defocuses. OpenCV needs an odd kernel, so 3 is the smallest
        # usable defocus; larger ones wipe out modules only a pixel or two across.
        case(f"{w}px + lens blur", cv2.GaussianBlur(small, (3, 3), 0), counts)

    # What actually happens when someone photographs the pay modal.
    tilted = cv2.getRotationMatrix2D((620, 621), 6, 1.0)
    skewed = cv2.warpAffine(original, tilted, (original.shape[1], original.shape[0]),
                            borderValue=255)
    case("photographed at an angle", skewed)

    bright = cv2.convertScaleAbs(original, alpha=0.82, beta=45)  # screen glare
    case("screen glare (washed out)", bright)

    import io

    buf = io.BytesIO()
    cv2.imwrite(".tmp.jpg", original, [cv2.IMWRITE_JPEG_QUALITY, 55])
    case("jpeg compression q55", cv2.imread(".tmp.jpg", cv2.IMREAD_GRAYSCALE))
    Path(".tmp.jpg").unlink(missing_ok=True)

    passed = sum(scored)
    print(f"\n{passed}/{len(scored)} scored conditions passed")


if __name__ == "__main__":
    main()