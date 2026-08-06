#!/usr/bin/env node
"use strict";

/**
 * Fetches current weather and air quality data for Gajraula, Amroha district,
 * Uttar Pradesh, India (28.8347 N, 78.2439 E) from the free Open-Meteo API
 * (no API key required) and appends a row to data/weather_aqi_log.csv.
 *
 * Data source: https://open-meteo.com (CAMS-based model estimates, since
 * Gajraula has no dedicated ground monitoring station).
 */

const fs = require("fs");
const path = require("path");

const LAT = 28.8347;
const LON = 78.2439;
const TZ = "Asia/Kolkata";

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m` +
  `&timezone=${encodeURIComponent(TZ)}`;

const AQI_URL =
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}` +
  `&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
  `&timezone=${encodeURIComponent(TZ)}`;

const CSV_PATH = path.join(__dirname, "..", "data", "weather_aqi_log.csv");

const FIELDS = [
  "timestamp_utc",
  "timestamp_ist",
  "temperature_c",
  "apparent_temperature_c",
  "humidity_percent",
  "precipitation_mm",
  "rain_mm",
  "wind_speed_kmh",
  "wind_direction_deg",
  "weather_code",
  "us_aqi",
  "european_aqi",
  "pm2_5",
  "pm10",
  "co",
  "no2",
  "so2",
  "ozone",
];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "gajraula-weather-aqi-logger" },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText} (${url})`);
  }
  return res.json();
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

async function main() {
  const [weatherRes, aqiRes] = await Promise.all([
    fetchJson(WEATHER_URL),
    fetchJson(AQI_URL),
  ]);
  const weather = weatherRes.current || {};
  const aqi = aqiRes.current || {};

  const row = {
    timestamp_utc: new Date().toISOString(),
    timestamp_ist: weather.time || "",
    temperature_c: weather.temperature_2m,
    apparent_temperature_c: weather.apparent_temperature,
    humidity_percent: weather.relative_humidity_2m,
    precipitation_mm: weather.precipitation,
    rain_mm: weather.rain,
    wind_speed_kmh: weather.wind_speed_10m,
    wind_direction_deg: weather.wind_direction_10m,
    weather_code: weather.weather_code,
    us_aqi: aqi.us_aqi,
    european_aqi: aqi.european_aqi,
    pm2_5: aqi.pm2_5,
    pm10: aqi.pm10,
    co: aqi.carbon_monoxide,
    no2: aqi.nitrogen_dioxide,
    so2: aqi.sulphur_dioxide,
    ozone: aqi.ozone,
  };

  const fileExists = fs.existsSync(CSV_PATH);
  fs.mkdirSync(path.dirname(CSV_PATH), { recursive: true });

  const line = FIELDS.map((f) => csvEscape(row[f])).join(",") + "\n";

  if (!fileExists) {
    fs.writeFileSync(CSV_PATH, FIELDS.join(",") + "\n" + line);
  } else {
    fs.appendFileSync(CSV_PATH, line);
  }

  console.log("Logged:", row);
}

main().catch((err) => {
  console.error("Error fetching/logging data:", err.message);
  process.exit(1);
});
