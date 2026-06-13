# Brainyard

Brainyard is a vineyard intelligence dashboard prototype for a hackathon demo.
It connects mock sensor data, vineyard plots, field activities, alerts, historical
trends, and research workflows in one frontend application.

Tagline: “From vineyard data to evidence-based decisions.”

## Technology Used

- React
- TypeScript
- Vite
- Recharts
- Lucide React
- Standard CSS

The app runs locally with mock data. It does not require a backend, database,
authentication, API keys, or external services.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

## Production Build

```bash
npm run build
```

## Folder Structure

```text
src/
  components/       Reusable UI pieces such as cards, forms, charts, navigation, and sync status
  data/             Mock vineyard, plot, sensor, measurement, alert, event, and study data
  services/         Mock service layer that simulates future backend and Flywheel calls
  types/            TypeScript interfaces for the Brainyard domain model
  utils/            Formatting helpers and chart data preparation
  views/            Main application screens
  App.tsx           Application state, navigation, event creation, study creation, and sync flow
  main.tsx          React entry point
  styles.css        Global responsive styling and design tokens
```

## Mock Data

Mock data lives in `src/data/mockData.ts`. This file contains:

- vineyard details for Tenuta Verde;
- Plot A, Plot B, and Plot C;
- sensor metadata and current readings;
- historical soil moisture measurements;
- irrigation event markers;
- alerts and observations;
- recent activity;
- a sample research study and evidence package.

The frontend reads this data through `src/services/vineyardService.ts`.
That keeps the app architecture close to a future production setup where the
mock service can be replaced with real backend API calls.

## Future Backend Integration

Backend integration should be added in `src/services/vineyardService.ts`.
The current service returns mock data with simulated delays. Later, each method
can call real endpoints for vineyards, plots, sensors, measurements, field
events, alerts, and studies.

## Future Flywheel Integration

Flywheel synchronization is simulated in `src/services/flywheelService.ts`.
The current implementation only changes frontend states:

- Not synchronized
- Preparing evidence
- Uploading artifacts
- Synchronized with Flywheel

No Flywheel token, API key, secret, or real upload is stored in this frontend.
Real synchronization should be handled through a secure backend service, not
directly from browser code.
