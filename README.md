<div align="center">
   <img width="150" heigth="150" src="https://webpack.js.org/assets/icon-square-big.svg" />
</div>

## Data: City of Philadelphia 311
[City of Philadelphia CARTO API Explorer](https://cityofphiladelphia.github.io/carto-api-explorer/#public_cases_fc)
```https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc```

## Use deck.gl with Mapbox

Uses [Webpack](https://github.com/webpack/webpack) to bundle files and serves it
with [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server).

## Usage

To install dependencies:

```bash
npm install
```

Commands:
* `npm start` is the development target, to serve the app and hot reload.
* `npm run build` is the production target, to create the final bundle and write to disk.

### Basemap

The basemap in this example is provided by [CARTO free basemap service](https://carto.com/basemaps). To use an alternative base map solution, visit [this guide](https://deck.gl/docs/get-started/using-with-map#using-other-basemap-services)
