# Gajraula Weather & AQI Logger

Automated weather and air-quality data logging for **Gajraula, Amroha district, Uttar Pradesh, India** (28.8347° N, 78.2439° E).

A GitHub Actions workflow runs on a schedule, pulls current conditions from the free [Open-Meteo](https://open-meteo.com) API, and appends a row to `data/weather_aqi_log.csv` — no server, database, or API key required.

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

## Setup

1. Create a new GitHub repository and push this folder to it.
2. Go to the repo's **Settings → Actions → General → Workflow permissions** and set it to **"Read and write permissions"**
3. Go to the **Actions** tab, select "Log Gajraula Weather & AQI Data", and click **Run workflow**

## Project structure

```
.
├── .github/workflows/log-data.yml   # scheduled job
├── scripts/fetch-data.js            # fetch + append logic
├── data/weather_aqi_log.csv         # the growing dataset
└── README.md

