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
// console.log(ListMesh);
view.addLayer(geometry_layer);


function updateAgent(ListMesh) {
    // meshNewPos(meshPosition, destinationPosition)

    let newMeshPos;
    let randomKey;

    let keys = Object.keys(ListMesh);
    let keysLength = keys.length;
    // console.log("dfsqfsqdfsqfsdqfd");

    Object.entries(ListMesh).forEach(function ([key, val]) {

        if (val.mesh) {


            // console.log(val.mesh)

            newMeshPos = meshNewPos(val.mesh.position, val.destination);
            if (newMeshPos) {
                // console.log("dfsqfsqdfsqfsdqfd");
                if (((Math.abs(newMeshPos.x - val.destination.x)) < 1) && ((Math.abs(newMeshPos.y - val.destination.y)) < 1)) {
                    // reached destination
                    if (val.virusPropabillity > 0.7) {
                        // Contaminated
                        console.log('CHANGE COLOR')
                        randomKey = keys[Math.floor(Math.random() * keysLength)];
                        ListMesh[key].destination = ListMesh[randomKey].posBuilding;
                        ListMesh[key].mesh.material.color.setHex(0x00ff00);
                    } else {
                        // change probability
                        ListMesh[key].virusPropabillity = Math.random();
                    }

                } else {
                    // console.log(val.mesh.position)
                    val.mesh.position.x = newMeshPos.x;
                    val.mesh.position.y = newMeshPos.y;

                }
            }


            // update coordinate of the mesh
            val.mesh.updateMatrixWorld();


        }



    }

    )
    // console.log(ListMesh);
}


function animate() {
    requestAnimationFrame(animate);



    updateAgent(ListMesh)
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}




// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    let mesh;
    let randomKey;

    let keys = Object.keys(ListMesh);
    let keysLength = keys.length;

    // add mesh + pos batiment fix
    Object.entries(ListMesh).forEach(function ([key, val]) {
        randomKey = keys[Math.floor(Math.random() * keysLength)];
        mesh = addMeshToScene(val.position.x, val.position.y, val.position.z, view);
        ListMesh[key].mesh = mesh;

        ListMesh[key].posBuilding = mesh.position;

        // console.log(mesh)
    })

    // add destination
    Object.entries(ListMesh).forEach(function ([key, val]) {
        randomKey = keys[Math.floor(Math.random() * keysLength)];
        ListMesh[key].destination = ListMesh[randomKey].posBuilding;

    })
    console.log('"""""""""""""""""""""""""""""')
    console.log(ListMesh);
    // updateAgent(ListMesh)
    animate()

});

function meshNewPos(meshPosition, destinationPosition) {

    // console.log(meshPosition)

    let mx = meshPosition.x;
    let my = meshPosition.y;

    let dx = destinationPosition.x;
    let dy = destinationPosition.y;

    let diff_x = Math.abs(mx - dx);
    let diff_y = Math.abs(my - dy);

    if ((mx < dx) && (diff_x > 1)) {
        mx += 1;
    } else if ((my < dy) && (diff_y > 1)) {
        my += 1;
    } else if ((mx > dx) && (diff_x > 1)) {
        mx -= 1;
    } else if ((my > dy) && (diff_y > 1)) {
        my -= 1;
    } else if ((diff_x < 1)) {
        mx = dx;
    } else if ((diff_y < 1)) {
        my = dy;
    }

    return { x: mx, y: my };
}