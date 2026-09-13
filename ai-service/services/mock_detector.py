import random
import numpy as np
import cv2

CATEGORIES = [
    "Pothole",
    "Damaged Road",
    "Garbage Overflow",
    "Broken Streetlight",
    "Water Leakage",
    "Open Drain",
    "Fallen Tree",
    "Damaged Public Property",
    "Other",
]

SEVERITIES = ["Low", "Medium", "High", "Critical"]

DESCRIPTIONS = {
    "Pothole": "Large pothole detected on road surface",
    "Damaged Road": "Significant road surface damage detected",
    "Garbage Overflow": "Overflowing garbage accumulation detected",
    "Broken Streetlight": "Non-functional or damaged streetlight detected",
    "Water Leakage": "Visible water leakage detected on the surface",
    "Open Drain": "Uncovered or open drain detected, potential hazard",
    "Fallen Tree": "Fallen tree obstruction detected",
    "Damaged Public Property": "Damage to public property/infrastructure detected",
    "Other": "Civic issue detected, manual review recommended",
}


def _image_features(image_bytes: bytes):
    """Lightweight OpenCV based heuristic - stands in for a future YOLO model."""
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return 0.0, 0.0
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = float(np.count_nonzero(edges)) / edges.size
    brightness = float(np.mean(gray)) / 255.0
    return edge_density, brightness


def predict(image_bytes: bytes) -> dict:
    edge_density, brightness = _image_features(image_bytes)

    # Deterministic-ish pseudo classification seeded by image features so
    # results are stable per image but vary across different uploads.
    seed = int((edge_density * 1000 + brightness * 500)) or random.randint(1, 999)
    rng = random.Random(seed)

    category = rng.choice(CATEGORIES)
    severity_weights = [0.35, 0.35, 0.20, 0.10]
    severity = rng.choices(SEVERITIES, weights=severity_weights, k=1)[0]
    confidence = round(0.72 + rng.random() * 0.27, 2)

    return {
        "category": category,
        "confidence": confidence,
        "severity": severity,
        "description": DESCRIPTIONS.get(category, "Civic issue detected"),
    }
