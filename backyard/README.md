# Backyard Camera Gallery

A live photo journal of interesting moments in the backyard — motion, wildlife, weather, and light.

## About

This site automatically displays alerts from the backyard camera whenever something visually interesting is detected:

- **Motion & Scene Changes** – Birds at the feeder, wildlife, weather shifts, or shadows moving
- **Lighting Changes** – Sun breaking through clouds, time-of-day transitions, glare
- **Sky Colors** – Sunsets, unusual colors, vibrant atmospheric moments

The camera checks every 5 minutes, and interesting moments (3–4 per day on average) are saved here with full-resolution images and detailed descriptions.

## Features

- **Gallery View** – Browse recent captures as a grid or list
- **Calendar View** – See which dates had activity
- **Statistics** – Charts showing alert types, hourly activity, and trends
- **Full Details** – Click any image to see high-resolution version, timestamp, and observation notes
- **Dark Mode** – Easy on the eyes, especially at night
- **Auto-Updates** – New images appear within minutes of detection

## Technical Details

- **Retention** – Images kept for 1 year; older ones automatically removed
- **Processing** – Lightweight computer vision using fingerprinting and color analysis
- **Hosting** – Static site on GitHub Pages; no backend needed
- **Privacy** – Public gallery; feel free to share

## Manual Testing

To test the gallery locally:

1. Add a test image to `images/`
2. Edit `data/manifest.json` to add an entry
3. Reload the page

Example manifest entry:

```json
{
  "timestamp": "2026-08-08T22:30:00Z",
  "type": "sky",
  "reason": "interesting sky colors: saturation 0.45, warm 15%, blue 28%",
  "description": "I noticed unusually rich color in the upper part of the frame...",
  "full": "./images/camera-20260808-223000-full.jpg",
  "thumb": "./images/camera-20260808-223000-thumb.jpg",
  "metrics": {
    "score": 12.5,
    "changed_fraction": 0.15,
    "brightness_delta": 18.3
  }
}
```

## Data Format

**Manifest** (`data/manifest.json`):
- `version` – Schema version (currently `1.0`)
- `lastUpdated` – ISO 8601 timestamp of last manifest update
- `images` – Array of image entries (newest first)

**Image Entry**:
- `timestamp` – ISO 8601 capture time (UTC)
- `type` – One of: `sky`, `motion`, `brightness`
- `reason` – Short classifier reason
- `description` – Human-readable observation (~1-2 sentences)
- `full` – Path to full-resolution JPEG
- `thumb` – Path to thumbnail JPEG
- `metrics` – Object with `score`, `changed_fraction`, `brightness_delta`

---

Built with care. Updated automatically.
