module.exports = function (filepath, metadata) {
    var vectorLayers = JSON.parse(metadata.json).vector_layers;
    var source = encodeURIComponent(filepath);
    var styleLayers = [];

    vectorLayers.forEach(function (layer) {
        styleLayers.push({
            id: layer.id + '-polygons',
            type: 'fill',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'Polygon'],
            layout: {},
            paint: {
                'fill-opacity': 0.1,
                'fill-color': '#00FF00'
            }
        });

        styleLayers.push({
            id: layer.id + '-polygon-outlines',
            type: 'line',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'Polygon'],
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#00FF00',
                'line-width': 1,
                'line-opacity': 0.75
            }
        });

        styleLayers.push({
            id: layer.id + '-lines',
            type: 'line',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'LineString'],
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#00FF00',
                'line-width': 1,
                'line-opacity': 0.75
            }
        });

        styleLayers.push({
            id: layer.id + '-points',
            type: 'circle',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'Point'],
            paint: {
                'circle-color': '#00FF00',
                'circle-radius': 2.5,
                'circle-opacity': 0.75
            }
        });
    });

    var style = {
        version: 8,
        name: 'Mapview',
        sources: {},
        layers: styleLayers
    };

    style.sources[source] = {
        type: 'vector',
        tiles: ['http://localhost:20009/' + source + '/{z}/{x}/{y}.pbf']
    };

    if (metadata.center) style.center = metadata.center.slice(0, 2);
    if (metadata.minzoom || metadata.center[2]) style.zoom = metadata.minzoom || metadata.center[2];

    return style;
};
