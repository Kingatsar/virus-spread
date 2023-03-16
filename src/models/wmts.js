
export function wmtsLayer(serverURL, crs, name, tileMatrixSet, format) {
    const colorSource = new itowns.WMTSSource({
        url: serverURL,
        crs: crs,
        name: name,
        tileMatrixSet: tileMatrixSet,
        format: format,
    });

    const colorLayer = new itowns.ColorLayer('Ortho', {
        source: colorSource,
    });

    return colorLayer;
}