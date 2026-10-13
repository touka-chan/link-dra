"""Exercise the profile link fields the buyer fills in after delivery.

These are the normalisation rules the order form relies on, and the failure mode
is silent: a malformed URL still saves, it just breaks the landing page later.
The expectations are written as cases so a change to a base URL has to be
deliberate.

Run:  python scripts\\test-profile-links.py
"""

import sys
from pathlib import Path

# Mirrors PROFILE_LINK_FIELDS in src/brand.js. Kept as data rather than pulled
# out of the JS so this runs without a node toolchain.
FIELDS = {
    "facebook": ("https://www.facebook.com/", None),
    "instagram": ("https://www.instagram.com/", None),
    "tiktok": ("https://www.tiktok.com/@", None),
    "linkedin": ("https://www.linkedin.com/in/", None),
    "x": ("https://x.com/", None),
    "youtube": ("https://www.youtube.com/@", None),
    "email": (None, "email"),
    "website": ("https://", None),
    "number": (None, "tel"),
    "gbp": ("https://", None),
}

HAS_SCHEME = ("http", "https", "mailto", "tel")


def normalise(field_id, raw):
    base, kind = FIELDS[field_id]
    value = (raw or "").strip()
    if not value:
        return ""
    if value.split(":", 1)[0].lower() in HAS_SCHEME:
        return value
    if not base:
        return value
    handle = value.lstrip("@").lstrip("/").rstrip("/")
    base_path = base.split("://", 1)[-1].split("/", 1)[-1] if "/" in base.split("://", 1)[-1] else ""
    base_path = base_path.strip("/")
    if base_path and handle.lower().startswith(base_path.lower() + "/"):
        handle = handle[len(base_path) + 1 :]
    return base + handle if handle else ""


# (field, input, expected)
CASES = [
    ("facebook", "linkodra.ph", "https://www.facebook.com/linkodra.ph"),
    ("facebook", "https://www.facebook.com/linkodra.ph", "https://www.facebook.com/linkodra.ph"),
    ("instagram", "@linkodra.ph", "https://www.instagram.com/linkodra.ph"),
    ("tiktok", "linkodra", "https://www.tiktok.com/@linkodra"),
    ("linkedin", "/in/john", "https://www.linkedin.com/in/john"),
    ("x", "linkodra", "https://x.com/linkodra"),
    ("youtube", "@linkodra", "https://www.youtube.com/@linkodra"),
    ("website", "linkodra.com", "https://linkodra.com"),
    ("gbp", "https://g.page/abc123", "https://g.page/abc123"),
    ("number", "+63 917 000 0000", "+63 917 000 0000"),
    ("email", "me@linkodra.com", "me@linkodra.com"),
    ("facebook", "", ""),
    ("facebook", "   ", ""),
]


def main():
    failures = []
    for field, raw, expected in CASES:
        got = normalise(field, raw)
        ok = got == expected
        if not ok:
            failures.append(f"{field}: {raw!r} -> {got!r} (expected {expected!r})")
        print(f"  {'PASS' if ok else 'FAIL'}  {field:<10} {raw!r:<45} -> {got}")

    print(f"\n{len(CASES) - len(failures)}/{len(CASES)} passed")
    if failures:
        print("\n".join(failures))
        sys.exit(1)


if __name__ == "__main__":
    main()