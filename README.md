# MetricLens

Self-serve ROI calculator for Braintrust experiments. A local-first web app that correlates technical improvements with business KPIs to bridge the "Value Translation Gap".

## Quick Start

```bash
git clone https://github.com/minhkhoango/metriclens.git
cd metriclens
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Usage

Upload two files (or use the sample data in `sample_data/` folder):
1. **Braintrust JSON Export**: Array of experiment objects with `created` timestamp and `scores.factuality` metric
2. **Business KPI CSV**: Two columns (`date` in YYYY-MM-DD format, `value`)

Enter your cost and time savings estimates. ROI metrics and correlation charts update in real-time.

**Note**: All processing happens locally in your browser. No data is uploaded or stored.

## Tech Stack

Svelte + TypeScript + Vite + Chart.js
