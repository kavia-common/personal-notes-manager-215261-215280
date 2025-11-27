# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

1) Copy `.env.example` to `.env` and set:
```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_HEALTHCHECK_PATH=/api/health
```
2) Start the backend (Flask) on port 3001.
3) In this directory, run:
- `npm install`
- `npm start`

Open [http://localhost:3000](http://localhost:3000) in your browser.

If the backend is unavailable or blocked by CORS, a banner will appear with a retry button.

### CORS

Ensure your backend allows CORS from the frontend origin (e.g., http://localhost:3000). If using Flask, configure CORS with proper origins and allow the `/api/*` endpoints.

### Scripts

- `npm start` - development mode
- `npm test` - test runner
- `npm run build` - production build
- `npm run eject` - eject configuration

## Customization

### Colors

The main theme colors are defined as CSS variables in `src/App.css`.

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
