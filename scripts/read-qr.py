"""Decode the payment QR and print its EMVCo TLV fields.

A QR that a scanner cannot read and a QR that encodes the wrong thing are very
different problems, so this prints the payload in full rather than just a
pass/fail. Tag 52 (merchant category code) is the one that matters here: 8999
with a com.p2pqrpay account means a personal person-to-person code, not a
registered merchant terminal.
"""

import sys
from pathlib import Path

import cv2

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "public" / "qr.png"

FIELDS = {
    "00": "Format Indicator",
    "01": "Initiation Method",
    "26": "Merchant Account Info",
    "52": "Merchant Category Code",
    "53": "Transaction Currency",
    "54": "Transaction Amount",
    "58": "Country Code",
    "59": "Merchant Name",
    "60": "Postal Code",
    "62": "Additional Data",
}

MCC = {
    "8999": "Miscellaneous services - a personal code, not a merchant terminal",
    "5812": "Eating places and restaurants",
    "5541": "Convenience stores",
    "5999": "Miscellaneous retail",
}


def parse(payload):
    """Walk the EMVCo tag-length-value chain. Tags are 2 digits, lengths 2 digits."""
    out, i = [], 0
    while i + 4 <= len(payload):
        tag = payload[i : i + 2]
        try:
            length = int(payload[i + 2 : i + 4])
        except ValueError:
            break
        out.append((tag, payload[i + 4 : i + 4 + length]))
        i += 4 + length
    return out


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else TARGET
    image = cv2.imread(str(path))
    if image is None:
        raise SystemExit(f"cannot read {path}")
    data, points, _ = cv2.QRCodeDetector().detectAndDecode(image)

    if not data:
        print(f"{path.name}: NO QR DETECTED")
        return

    print(f"{path.name}")
    print(f"  raw: {data}\n")
    for tag, value in parse(data):
        note = ""
        if tag == "52":
            note = f"  <- {MCC.get(value, 'unknown category')}"
        print(f"  {tag} {FIELDS.get(tag, 'Unknown'):<24} {value}{note}")


if __name__ == "__main__":
    main()