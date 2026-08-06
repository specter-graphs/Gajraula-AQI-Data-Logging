# Gajraula Weather & AQI Logger

Automated weather and air-quality data logging for **Gajraula, Amroha district, Uttar Pradesh, India** (28.8347° N, 78.2439° E).

A GitHub Actions workflow runs **every hour**, pulls current conditions from the free [Open-Meteo](https://open-meteo.com) API, and appends a row to `docs/data/weather_aqi_log.csv`. A dashboard at `docs/index.html`, served free via GitHub Pages, charts the history — no server, database, or API key required anywhere in the stack.

## Data collected

| Column | Description |
|---|---|
| `timestamp_utc` / `timestamp_ist` | When the reading was taken |
| `temperature_c`, `apparent_temperature_c`, `humidity_percent` | Temperature & humidity |
| `precipitation_mm`, `rain_mm` | Rainfall |
| `wind_speed_kmh`, `wind_direction_deg` | Wind |
| `weather_code` | [WMO weather code](https://open-meteo.com/en/docs#weathervariables) |
| `us_aqi`, `european_aqi` | Air Quality Index (US and EU scales) |
| `pm2_5`, `pm10`, `co`, `no2`, `so2`, `ozone` | Pollutant concentrations (µg/m³, CO in µg/m³) |

**A note on data quality:** Gajraula doesn't have a dedicated government (CPCB) ground monitoring station. This data comes from Open-Meteo's CAMS-based atmospheric model, interpolated for these coordinates — a reasonable estimate, but not a physical sensor reading. If exact ground-truth AQI matters for your research, cross-reference against the nearest CPCB stations (e.g. Moradabad) via [cpcb.nic.in](https://cpcb.nic.in) or [aqicn.org](https://aqicn.org).

## Setup

1. Create a new GitHub repository and push this folder to it.
2. Go to the repo's **Settings → Actions → General → Workflow permissions** and set it to **"Read and write permissions"** (needed so the workflow can commit the CSV back).
3. Go to the **Actions** tab, select "Log Gajraula Weather & AQI Data", and click **Run workflow** to test it manually. Confirm a new row shows up in `docs/data/weather_aqi_log.csv`.
4. Go to **Settings → Pages**, and under "Build and deployment" choose **Source: Deploy from a branch**, **Branch: main**, **Folder: /docs**, then **Save**. Your dashboard goes live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. After that, logging runs automatically every hour (edit the cron schedule in `.github/workflows/log-data.yml` to change frequency — [crontab.guru](https://crontab.guru) helps with cron syntax; see the note on Actions minutes below before going much faster than hourly on a private repo).

## Running locally

Requires Node.js 18+ (for built-in `fetch`):

```bash
node scripts/fetch-data.js
```

This appends one row to `docs/data/weather_aqi_log.csv`.

## Project structure

```
.
├── .github/workflows/log-data.yml   # scheduled job (hourly)
├── scripts/fetch-data.js            # fetch + append logic
├── docs/
│   ├── index.html                   # dashboard (GitHub Pages)
│   └── data/weather_aqi_log.csv     # the growing dataset
└── README.md
```

## A note on GitHub Actions minutes

On a **private** repo, the Free plan includes 2,000 Actions minutes/month. Hourly logging (24 runs/day) uses roughly 720 minutes/month — well within budget, with room to spare. If you ever want much more frequent logging (faster than every ~20 minutes) without watching the minute count, making the repo **public** removes the limit entirely, since public repos get unlimited standard-runner minutes.

## Ideas for extending this

- Add a second workflow that generates daily/weekly summary stats (min/max/avg temp, AQI trend).
- Log to SQLite instead of CSV if the dataset grows large.
- Add more locations (Amroha, Moradabad, Hasanpur) for regional comparison.
- Add a CSV download button or date-range filter to the dashboard.

Let me know if you'd like help with any of these next.
