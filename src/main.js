import { wmtsLayer } from "./models/wmts";
import { elevationLayer } from "./models/elevation";
import { buildingLayer, addMeshToScene } from "./models/building";

// View
const viewerDiv = document.getElementById('viewerDiv');

const extent = {
    west: 4.77244,
    east: 4.87408,
    south: 45.71694,
    north: 45.80481,
}

const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 4.83518, 45.76130),
    range: 3000,
    tilt: 60,
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
    14,
    extent,
    view);
//  GeometryLayer
const geometry_layer = layerCoord.layer
const ListMesh = layerCoord.coords // List Mesh


console.log("test");
console.log(ListMesh);
view.addLayer(geometry_layer);








function updateAgent(ListMesh) {
    Object.entries(ListMesh).forEach(function ([key, val]) {

        if (val.mesh) {
            const cameraTargetPosition = view.controls.getLookAtCoordinate();

            // position of the mesh
            const meshCoord = cameraTargetPosition;

            val.mesh.position.x += 0.1;
            val.mesh.position.y += 0.1;

            val.position.x += 0.1;
            val.position.y += 0.1;

            // update coordinate of the mesh
            val.mesh.updateMatrixWorld();


            { {/*  view.camera.camera3D.position.x += 0.01;  */ } }
        }



    }

    )
}


function animate() {
    requestAnimationFrame(animate);

    console.log(Object.entries(ListMesh).length
    )

    updateAgent(ListMesh)
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

// animate();


// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    let mesh;

    // add mesh
    Object.entries(ListMesh).forEach(function ([key, val]) {
        mesh = addMeshToScene(val.position.x, val.position.y, val.position.z, view);
        ListMesh[key].mesh = mesh;
        console.log("test2")
    })

    animate()

});



