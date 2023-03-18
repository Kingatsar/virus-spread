
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
        onMeshCreated: function virusspread(mesh, layer) {
            // console.log("mesh")
            // console.log(mesh)
            // console.log("layer")
            // console.log(layer)
            mesh.children.forEach(c => {

                let geoms = c.children[0].children[0].children[0].feature.geometries

                // console.log(c.children[0].children[0].children[0])



                let count = 0;
                geoms.map(goem => {
                    count++;

                    if ((count % 20) == 0) {

                        let id = goem.properties.id;
                        // console.log(id)
                        ListMesh[id] = {
                            id: id,
                            batMesh: goem,
                            position: {
                                x: (goem.properties.bbox[0] + goem.properties.bbox[2]) / 2,
                                y: (goem.properties.bbox[1] + goem.properties.bbox[3]) / 2,
                                z: goem.properties.z_min
                            },
                            virusProbability: Math.random(),
                        };
                        { {/*  console.log(mesh)  */ } }

                    }


                })



            })


        },
    });

    function setColor(properties) {
        let color = "rgb(255, 255, 255)"
        // ne marche pas 
        if (Object.keys(ListMesh).includes(properties.id)) {
            console.log(properties.id)

        }
        return new itowns.THREE.Color(color);
    }

    // console.log(listCoords)

    return { layer: geomLayer, coords: ListMesh, src: geometrySource };
}

// Coloring the data


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


export function addMeshToScene(x, y, z, view) {
    // creation of the new mesh (a cylinder)
    const THREE = itowns.THREE;
    const geometry = new THREE.SphereGeometry(10, 32, 16)
    const material = new THREE.MeshBasicMaterial({ color: "rgb(0, 255, 0)" });
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

    // update coordinate of the mesh
    mesh.updateMatrixWorld(); // *****

    // add the mesh to the scene
    view.scene.add(mesh);

    // make the object usable from outside of the function
    view.mesh = mesh;
    view.notifyChange();

    return mesh
}
