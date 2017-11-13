"use strict";
var fs = require('fs');
var path = require('path');
function init(app) {
    app.models = {};
    fs
        .readdirSync(__dirname)
        .filter(function (file) {
        return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
    })
        .forEach(function (file) {
        require(path.join(__dirname, file)).init(app);
    });
}
exports.init = init;
