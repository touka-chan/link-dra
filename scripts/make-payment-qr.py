"""Regenerate the payment QR natively from the payload it already encodes.

The shipped image was an upscaled screenshot crop, which left the module grid
too soft to survive a phone camera: it only decoded at full size and failed under
any blur or downscale. Thresholding cannot repair that, because blurred module
boundaries shift where each module starts and ends.

Re-encoding the payload we read back out of the broken image produces the same
destination account, but drawn as true modules at high error correction. This is
the fix, not a cosmetic tweak.

The InstaPay wordmark is deliberately left out. Overlaying a logo on top would
cover real modules, which is very likely how the original screenshot came to be
blurred in the first place. Readability beats branding on a payment code.

Run:  python scripts\\make-payment-qr.py
"""

from pathlib import Path

import cv2
import qrcode
from qrcode.constants import ERROR_CORRECT_H

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "public" / "qr.png"
BACKUP = ROOT / "server" / "data" / "qr-original.png"

# EMVCo payload read out of the previous image. Field 27 carries the QRIS
# p2pqrpay scheme and the GCash account id, so payments land where they did before.
PAYLOAD = (
    "00020101021127830012com.p2pqrpay0111GXCHPHM2XXX02089996440303152170200"
    "000006560417DWQM4TK3JDO4LU3X15204601653036085802PH5909BE***M C.6008Il"
    "omavis610412346304F796"
)

BORDER = 4  # modules of quiet zone, the spec minimum
BOX = 18  # pixels per module; large enough that a photo of the screen survives


def main():
    before = None
    if TARGET.exists():
        before, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(str(TARGET)))
        if before and not BACKUP.exists():
            BACKUP.parent.mkdir(parents=True, exist_ok=True)
            BACKUP.write_bytes(TARGET.read_bytes())

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=BOX,
        border=BORDER,
    )
    qr.add_data(PAYLOAD)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    img.save(TARGET, "PNG", optimize=True)
    print(f"written: public/qr.png  {img.width}x{img.height}  "
          f"version {qr.version}  EC=H  ({TARGET.stat().st_size / 1024:.1f} KB)")

    after, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(str(TARGET)))
    if after != PAYLOAD:
        raise SystemExit("regenerated QR does not round-trip to the payload")
    print("verified: decodes back to the identical payload")

    if before and before != PAYLOAD:
        print(f"WARNING: previous image decoded to a different payload\n  {before}")


if __name__ == "__main__":
    main()