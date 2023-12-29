# selva-echart-grafana-panel

## Requirements

- Version 3.X requires Grafana 9 or Grafana 10.
- Version 2.X requires Grafana 8.5 or Grafana 9.
- Version 1.X requires Grafana 8.

## Getting Started

1. Install packages

```bash
npm install
```

2. Build the plugin

```bash
npm run build
```

3. Sign the plugins if required

```bash
export GRAFANA_ACCESS_POLICY_TOKEN=token==
npm run sign
```

4. Start the Docker container

```bash
npm run start
```

## Highlights

- Use `docker-compose` to start the development environment with provisioned data source and dashboard.
- Provides unit and E2E test configuration.
- Based on the latest version of Grafana and Grafana Tools.
- Includes GitHub Actions for CI, E2E and Release.
- Includes Static Data Source to emulate any data.
