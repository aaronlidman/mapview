var chroma = require('chroma-js');

var darkColors = [
    '#000000',  // black
    '#111111',  // dark gray
    '#001326',  // dark blue
    '#002609'   // dark green
];

var lightColors = [
    '#FF0000',  // red
    '#FF8C19',  // orange
    '#FFF266',  // yellow
    '#00FF00',  // lime green
    '#00FF00',  // bright green
    '#66CCFF',  // sky blue
    '#00FFFF',  // light blue
    '#66FFCC',  // teal
    '#CC66FF',  // purple
    '#FC49A3',  // pink
    '#cccccc',  // gray
    '#cccccc'   // gray
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = function (filepath, metadata) {
    var vectorLayers = JSON.parse(metadata.json).vector_layers;
    var source = filepath;
    var styleLayers = [];

    vectorLayers.forEach(function (layer) {
        // each layer gets it's own color
        var lightColor = lightColors[random(0, (lightColors.length - 1))];
        var backgroundColor = chroma(lightColor).darken(5).saturate(1.5).hex();

        // todo: confirm multiple layers with multiple background doesn't break
        styleLayers.push({
            id: 'background',
            type: 'background',
            'source-layer': layer.id,
            paint: {
                'background-color': backgroundColor
            }
        });

        styleLayers.push({
            id: layer.id + '-polygons',
            type: 'fill',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'Polygon'],
            paint: {
                'fill-opacity': 0.1,
                'fill-color': lightColor
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
                'line-color': lightColor,
                'line-width': 0.75,
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
                'line-color': lightColor,
                'line-width': 0.75,
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
                'circle-color': chroma(lightColor).saturate().brighten(2).hex(),
                'circle-radius': 2,
                'circle-opacity': 0.85
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
        tiles: ['http://localhost:20009/' + source + '/{z}/{x}/{y}.pbf'],
        maxzoom: metadata.maxzoom
    };

    if (metadata.center) style.center = metadata.center.slice(0, 2);
    if (metadata.minzoom || metadata.center[2]) style.zoom = metadata.minzoom || metadata.center[2];

    return style;
};