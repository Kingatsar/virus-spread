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

const layerCoord = buildingLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    'BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
    'EPSG:4326',
    14);
//  GeometryLayer
const geometry_layer = layerCoord.layer
const geometry_coord = layerCoord.coords
console.log(geometry_coord)


view.addLayer(geometry_layer);

function addMeshToScene() {
    // creation of the new mesh (a cylinder)
    const THREE = itowns.THREE;
    const geometry = new THREE.CylinderGeometry(0, 10, 60, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffc0cb });
    const mesh = new THREE.Mesh(geometry, material);

    // get the position on the globe, from the camera
    const cameraTargetPosition = view.controls.getLookAtCoordinate();

    // position of the mesh
    const meshCoord = cameraTargetPosition;
    meshCoord.altitude += 30;

    // position and orientation of the mesh
    mesh.position.copy(meshCoord.as(view.referenceCrs));
    // mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(Math.PI / 2);

    // update coordinate of the mesh
    mesh.updateMatrixWorld();

    // add the mesh to the scene
    view.scene.add(mesh);

    // make the object usable from outside of the function
    view.mesh = mesh;
    view.notifyChange();
}

// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');
    addMeshToScene();
});


console.log("listCoords")
