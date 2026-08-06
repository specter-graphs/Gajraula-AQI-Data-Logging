# Gajraula Weather & AQI Logger

Automated weather and air-quality data logging for **Gajraula, Amroha district, Uttar Pradesh, India** (28.8347° N, 78.2439° E).

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
2. Go to the repo's **Settings → Actions → General → Workflow permissions** and set it to **"Read and write permissions"** (needed so the workflow can commit the CSV back).
3. Go to the **Actions** tab, select "Log Gajraula Weather & AQI Data", and click **Run workflow** to test it manually. Confirm a new row shows up in `docs/data/weather_aqi_log.csv`.
4. Go to **Settings → Pages**, and under "Build and deployment" choose **Source: Deploy from a branch**, **Branch: main**, **Folder: /docs**, then **Save**. Your dashboard goes live at `https://specter-graphs.github.io/Gajraula-AQI-Data-Logging/` within a minute or two.
5. After that, logging runs automatically every hour (edit the cron schedule in `.github/workflows/log-data.yml` to change frequency — [crontab.guru](https://crontab.guru) helps with cron syntax


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

