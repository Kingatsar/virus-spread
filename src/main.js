import { wmtsLayer } from "./models/wmts";
import { elevationLayer } from "./models/elevation";
import { buildingLayer, addMeshToScene } from "./models/building";

// View
const viewerDiv = document.getElementById('viewerDiv');
const THREE = itowns.THREE;
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


let view = new itowns.GlobeView(viewerDiv, placement, {
    atmosphere: {
        Kr: 0.05,
        Km: 0.15,
        ESun: 100.0,
        g: 100,
        innerRadius: 6370000,
        outerRadius: 6370001,
        wavelength: [0.7],
        scaleDepth: 0.38,
    }
});

const atmosphere = view.getLayerById('atmosphere');
atmosphere.setRealisticOn(true);
// WMTS Layer
const wmts_layer = wmtsLayer('https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    'EPSG:3857',
    'ORTHOIMAGERY.ORTHOPHOTOS',
    'PM',
    'image/jpeg');

view.addLayer(wmts_layer);

// Elevation
const elevation_layer = elevationLayer('https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    'EPSG:4326',
    'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES',
    'WGS84G',
    'image/x-bil;bits=32');

view.addLayer(elevation_layer);

const layerCoord = buildingLayer('https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    'BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
    'EPSG:4326',
    14,
    extent,
    view);
//  GeometryLayer
const geometry_layer = layerCoord.layer
const ListMesh = layerCoord.coords // List Mesh

let copiedListMesh

// console.log("test");
// console.log(ListMesh);
view.addLayer(geometry_layer);

// Durée de l'animation (en secondes)
var duration = 100;
var elapsed = 0;

var initPos = {}
var i = 0;
function updateAgent(ListMesh) {
    // meshNewPos(meshPosition, destinationPosition)

    let newMeshPos;
    let randomKey;

    let keys = Object.keys(ListMesh);
    let keysLength = keys.length;

    // console.log("dfsqfsqdfsqfsdqfd");

    Object.entries(ListMesh).forEach(function ([key, val]) {

        if (val.mesh && val.destination && val.mesh.position) {
            val.elapsed = updatePos(val.mesh, val.mesh.position, val.destination, val.elapsed)
            // console.log(val.mesh.position.distanceTo(val.destination))
            if (val.mesh.position.distanceTo(val.destination) < 50) {
                if (val.elapsed > 1) {
                    val.mesh.material.color.set("rgb(255, 0, 0)")

                }
                randomKey = keys[Math.floor(Math.random() * keysLength)];
                val.destination = copiedListMesh[randomKey].posBuilding
            }
        }
    })
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
        ListMesh[key].elapsed = 0;

        const points = [];
        points.push(ListMesh[key].posBuilding);
        points.push(ListMesh[randomKey].posBuilding);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

        const line = new THREE.Line(geometry, material);

        view.scene.add(line);

    })
    // console.log('"""""""""""""""""""""""""""""')
    // console.log(ListMesh);
    // updateAgent(ListMesh)

    copiedListMesh = JSON.parse(JSON.stringify(ListMesh));

    // console.log(copiedListMesh)

    animate()

});

function updatePos(mesh, meshPosition, destinationPosition, elapsed) {
    elapsed++;
    // console.log(elapsed)
    // Interpolation linéaire entre les deux points
    var t = elapsed / (duration * 10000);
    mesh.position.lerpVectors(meshPosition, destinationPosition, t);
    mesh.updateMatrixWorld()
    return elapsed;
}

function distance(x, y, x1, y1) {
    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;
    return Math.sqrt((Math.pow(this.x1 - this.x, 2)) + (Math.pow(this.y1 - this.y, 2)))
}


