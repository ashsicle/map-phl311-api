import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import mapboxgl from 'mapbox-gl';

// list of unique agencies responsible
const agencies = {
    "Streets Department": [243, 220, 204],
    "License & Inspections": [182, 205, 190],
    "Philly311 Contact Center": [237, 204, 139],
    "Community Life Improvement Program": [228, 129, 80],
    "Police Department": [129, 177, 205],
    "Parks & Recreation": [130, 157, 136],
    "Water Department (PWD)": [195, 217, 226],
    "Fire Department": [208, 149, 145],
    "Office of Homeless Services": [231, 178, 152],
    "Philadelphia Parking Authority- PPA": [170, 184, 187]
};

// define Mapbox map object
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // CARTO basemap
  center: [-75.16, 40], // starting position [lng, lat] Philadelphia
  zoom: 10.5, // starting zoom
  minZoom: 10  // minimum zoom
//   bearing: 0,
//   pitch: 30 // pitch angle for 3D map tilt
});

// let currentZoom = 10.5;

// function getCurrentZoom() {
//     currentZoom = map.getZoom();
//     return currentZoom;
// }

// map.on('zoomend', () => {
//     console.log('A zoomend event occurred.');
//     getCurrentZoom();
//     console.log(currentZoom);
//     });

// map.addControl(deckOverlay);
map.addControl(new mapboxgl.NavigationControl());

// Request data from CARTO SQL API v2
const request = require("request");

// OpenDataPhilly 311 API URL
const phl311ApiUrl = "https://phl.carto.com/api/v2/sql?";

// define SQL request query
const sqlQuery = "q=SELECT * FROM public_cases_fc WHERE requested_datetime >= current_date - 1";
const sqlGeoJsonQuery = "format=GeoJSON&q=SELECT * FROM public_cases_fc WHERE requested_datetime >= current_date - 7";

let data = {};

const options = {
    method: "GET",
    // url: "https://phl.carto.com/api/v2/sql?q=SELECT * FROM public_cases_fc",
    url: phl311ApiUrl + sqlGeoJsonQuery,
    // headers: {'content-type': 'application/json'},
    // body: {
    //     'status': "closed"
    // }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    
    data = JSON.parse(body).features.filter(d => d.geometry !== null);
    console.log(data);

    // get list of unique agencies responsible
    // const uniqueAgencies = Array.from(new Set(data.map(d => d.properties.agency_responsible)));
    // console.log(uniqueAgencies);

    const phl311points = new DeckOverlay({
        layers: [
            new GeoJsonLayer({
                id: 'phl311', // layer id
                data: data, // data

                // Styles
                filled: true, // filled in point
                stroked: false, // no outline stroke
                // getPointRadius: 80,
                pointRadiusScale: 30, // point radius scale
                pointRadiusMinPixels: 2, // minimum point radius (px)
                getPosition: d => d.geometry.coordinates,
                // getFillColor: [30, 180, 230, 90], // rgba color values
                getFillColor: d => d.properties.agency_responsible !== null ? agencies[d.properties.agency_responsible] : [192, 192, 192], // color values by agency responsible
                opacity: 0.9,

                // Interactive props
                pickable: true,
                autoHighlight: true,
                // onHover: d => setHoverInfo(d),
                onClick: info =>
                    // eslint-disable-next-line
                    info.object && alert(`Agency Responsible: ${info.object.properties.agency_responsible}, Address: ${info.object.properties.address}, Status:  ${info.object.properties.status}, Subject:  ${info.object.properties.subject}, Service Request ID:  ${info.object.properties.service_request_id}`),
                // updateTriggers: {
                //     // This tells deck.gl to recaluculate radius when `currentZoom` changes
                //     getPointRadius: currentZoom
                // }
            })
        ]
        // getTooltip: ({info}) => info.object && {
        //     html: `Agency Responsible: ${info.object.properties.agency_responsible}, Address: ${info.object.properties.address}, status, subject, service_request_id`,
        //     style: {
        //         backgroundColor: '#f00'
        //     }
        // }
    });
    // Add deck.gl feature layer to the map here
    map.addControl(phl311points);
});
