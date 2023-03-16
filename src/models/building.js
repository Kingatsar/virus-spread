
export function buildingLayer(serverURL, nameType, crs, zoomMinLayer, extent, view) {
    const geometrySource = new itowns.WFSSource({
        url: serverURL,
        typeName: nameType,
        crs: crs,
        extent: extent
    });

    let ListMesh = {};


    const geomLayer = new itowns.FeatureGeometryLayer('Buildings', {
        source: geometrySource,
        zoom: { min: zoomMinLayer },
        style: new itowns.Style({
            fill: {
                color: setColor,
                base_altitude: setAltitude,
                extrusion_height: setExtrusion,
            },

        }),
        onMeshCreated: function virusspread(mesh) {
            mesh.children.forEach(c => {

                let geoms = c.children[0].children[0].children[0].feature.geometries



                let count = 0;
                geoms.map(goem => {
                    count++;

                    if ((count % 70) == 0) {

                        mesh = addMeshToScene((goem.properties.bbox[0] + goem.properties.bbox[2]) / 2, (goem.properties.bbox[1] + goem.properties.bbox[3]) / 2, view);
                        let id = goem.properties.id;
                        console.log(mesh);
                        ListMesh[id] = mesh;
                        { {/*  console.log(mesh)  */ } }

                    }


                })



            })


        },
    });

    // console.log(listCoords)

    return { layer: geomLayer, coords: ListMesh };
}

// Coloring the data
function setColor(properties) {
    return new itowns.THREE.Color(0xaaaaaa);
}

// Extruding the data 
function setExtrusion(properties) {
    return properties.hauteur;
}

// Placing the data on the ground
function setAltitude(properties) {
    return properties.z_min - properties.hauteur;
}


/* Properties example:
            geometry_name: "the_geom"
            hauteur: 9
            id: "bati_indifferencie.19138409"
            origin_bat: "Cadastre"
            prec_alti: 5
            prec_plani: 2.5
            z_max: 83.7
            z_min: 83.7
*/


function addMeshToScene(x, y, view) {
    // creation of the new mesh (a cylinder)
    const THREE = itowns.THREE;
    const geometry = new THREE.CylinderGeometry(0, 10, 60, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffc0cb });
    const mesh = new THREE.Mesh(geometry, material);

    // get the position on the globe, from the camera
    const cameraTargetPosition = view.controls.getLookAtCoordinate();
    // const cameraTargetPosition = new itowns.Coordinates('EPSG:4326', x, y, z *******
    // position of the mesh
    const meshCoord = cameraTargetPosition;
    meshCoord.altitude += 30;

    meshCoord.x = x;
    meshCoord.y = y;

    // position and orientation of the mesh
    mesh.position.copy(meshCoord.as(view.referenceCrs)); // *****
    // mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(Math.PI / 2);

    // update coordinate of the mesh
    mesh.updateMatrixWorld(); // *****

    // add the mesh to the scene
    view.scene.add(mesh);

    // make the object usable from outside of the function
    view.mesh = mesh;
    view.notifyChange();

    return mesh
}
