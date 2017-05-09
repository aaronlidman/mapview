'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Get usage instructions
 * @return {String} the instructions to run this thing
 */
module.exports.usage = function () {
    var u = [];
    u.push('usage: mapview [options] [files]');
    u.push('');
    u.push(' --port sets the port number to use (default: 20009)');
    u.push(' --version returns module version');
    u.push(' --help prints this message');
    u.push('');
    return u.join('\n');
};

/**
 * Get module version from the package.json file
 * @return {String} version number
 */
module.exports.version = function () {
    var data = fs.readFileSync(path.join(__dirname, '../package.json'));
    return JSON.parse(data).version;
};
