var chroma = require('chroma-js');

var baseColors = [
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

function createVectorStyle(vectorLayers, filter, source, backgroundColor, foregroundColor) {
    filter = filter || 'none';
    var styleLayers = [];
    var polygonLayers = [];
    var pointLayers = [];
    var lineLayers = [];

    vectorLayers.forEach(function (layer) {
        // todo: multiple layer support, would need to remove all but one of the backgrounds here
        styleLayers.push({
            id: 'background',
            type: 'background',
            'source-layer': layer.id,
            paint: {
                'background-color': backgroundColor
            }
        });

        polygonLayers.push({
            id: layer.id + '-polygons',
            type: 'fill',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'Polygon'],
            paint: {
                'fill-opacity': 0.1,
                'fill-color': foregroundColor
            }
        });

        polygonLayers.push({
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
                'line-color': foregroundColor,
                'line-width': 0.75,
                'line-opacity': 0.75
            }
        });

        lineLayers.push({
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
                'line-color': foregroundColor,
                'line-width': 0.75,
                'line-opacity': 0.75
            }
        });

        pointLayers.push({
            id: layer.id + '-points',
            type: 'circle',
            source: source,
            'source-layer': layer.id,
            filter: ['==', '$type', 'Point'],
            paint: {
                'circle-color': chroma(foregroundColor).saturate().brighten(2).hex(),
                'circle-radius': 2,
                'circle-opacity': 0.85
            }
        });
    });

    if (filter === 'points') styleLayers = styleLayers.concat(pointLayers);
    if (filter === 'lines') styleLayers = styleLayers.concat(lineLayers);
    if (filter === 'polygons') styleLayers = styleLayers.concat(polygonLayers);
    if (filter === 'none') styleLayers = styleLayers.concat(pointLayers, lineLayers, polygonLayers);

    return styleLayers;
}

function createRasterStyle(source, minzoom, maxzoom) {
    return [{
        'id': 'raster-tiles',
        'type': 'raster',
        'source': source,
        'minzoom': minzoom || 0,
        'maxzoom': maxzoom || 30
    }];
}

module.exports = function (filepath, metadata, filter, baseColor) {
    var source = filepath;
    var styleLayers;

    var foregroundColor = (baseColor && baseColor[0] === '#') ? baseColor : baseColors[random(0, (baseColors.length - 1))];
    var backgroundColor = chroma(foregroundColor).darken(5).saturate(1.5).hex();

    if (metadata.format === 'jpg' || metadata.format === 'png') {
        metadata.type = 'raster';
        styleLayers = createRasterStyle(source, metadata.minzoom, metadata.maxzoom);
    } else {
        metadata.type = 'vector';
        var layers = JSON.parse(metadata.json).vector_layers;
        styleLayers = createVectorStyle(layers, filter, source, backgroundColor, foregroundColor);
    }

    var style = {
        version: 8,
        name: 'Mapview',
        sources: {},
        layers: styleLayers
    };

    style.sources[source] = {
        type: metadata.type,
        tiles: ['http://localhost:20009/' + source + '/{z}/{x}/{y}.pbf'],
        maxzoom: metadata.maxzoom
    };

    if (metadata.type === 'raster') style.sources[source].tileSize = 256;
    if (metadata.center) style.center = metadata.center.slice(0, 2);
    if (metadata.minzoom || metadata.center[2]) style.zoom = metadata.minzoom || metadata.center[2];

    return {
        style: style,
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor
    };
};
