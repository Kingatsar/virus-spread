
export function buildingLayer(serverURL, nameType, crs, zoomMinLayer, extent) {
    const geometrySource = new itowns.WFSSource({
        url: serverURL,
        typeName: nameType,
        crs: crs,
        extent: extent
    });

    var listCoords = [];


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
        onMeshCreated: (obj, ctx) => listCoords.push({ x: ctx.geometryLayer.builder.tmp.coords[0].x, z: ctx.geometryLayer.builder.tmp.coords[0].z, y: ctx.geometryLayer.builder.tmp.coords[0].y }),

    });

    // console.log(listCoords)

    return { layer: geomLayer, coords: listCoords };
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