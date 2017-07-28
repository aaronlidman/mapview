# manually removing modules to keep final package size small
# yeah, there really needs to be a better way of doing this
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/test
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/global-mercator/docs
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/tachyons/src
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/tachyons/css/tachyons.css
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/uws/build
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/font-awesome/less
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/font-awesome/scss

# platform specific
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/sqlite3-offline-windows
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/sqlite3-offline-linux
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/uws/uws_linux*
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/uws/uws_win*

# few generic ones
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/*/*.md
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/*/*.txt
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/*/test
rm -rf Mapview-darwin-x64/Mapview.app/Contents/Resources/app/node_modules/*/*/test # org scoped modules
