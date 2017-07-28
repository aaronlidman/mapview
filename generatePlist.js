var plist = require('plist');

var json = {
    'CFBundleDocumentTypes': [
        {
            'CFBundleTypeExtensions': [
                'mbtiles'
            ],
            'CFBundleTypeName': 'MBTiles Map Tiles',
            'CFBundleTypeRole': 'Editor',
            'LSHandlerRank': 'Default',
            'LSItemContentTypes': [
                'com.mapbox.mbtiles'
            ]
        }
    ],
    'NSHumanReadableCopyright': 'Copyright © Aaron Lidman'
};

console.log(plist.build(json));
