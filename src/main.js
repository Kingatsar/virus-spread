import { wmtsLayer } from "./models/wmts";
import { elevationLayer } from "./models/elevation";
import { buildingLayer } from "./models/building";


// View
const viewerDiv = document.getElementById('viewerDiv');
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 4.818, 45.7354),
    range: 1000,
    tilt: 20,
};
let view = new itowns.GlobeView(viewerDiv, placement);

// WMTS Layer
const wmts_layer = wmtsLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    'EPSG:3857',
    'ORTHOIMAGERY.ORTHOPHOTOS',
    'PM',
    'image/jpeg');
view.addLayer(wmts_layer);

// Elevation
const elevation_layer = elevationLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    'EPSG:4326',
    'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES',
    'WGS84G',
    'image/x-bil;bits=32');
view.addLayer(elevation_layer);

// Geometry Layer 
const geometry_layer = buildingLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    'BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
    'EPSG:4326',
    14);
view.addLayer(geometry_layer);



