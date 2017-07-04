var plist = require('plist');

var json = [
    {
        'CFBundleTypeExtensions': [
            'mbtiles'
        ],
        'CFBundleTypeName': 'MBTiles Map Tiles',
        'CFBundleTypeRole': 'Editor',
        'LSHandlerRank': 'Owner',
        'LSItemContentTypes': ['com.mapbox.mbtiles'],
        'CFBundleTypeIconFiles': ''
    }
];

console.log(plist.build(json));
