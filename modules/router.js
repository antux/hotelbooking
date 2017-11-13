"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var p = require('path');
var recursivelyLoadRouters = function (path, app) {
    var files = fs.readdirSync(path);
    var stats = null;
    files.forEach(function (file) {
        stats = fs.lstatSync(p.join(path, file));
        if (stats.isDirectory()) {
            recursivelyLoadRouters(p.join(path, file), app);
        }
        else {
            if (p.basename(file) == 'router.js' && path !== __dirname) {
                var router = require(p.join(path, file));
                router.init(app);
            }
        }
    });
};
function init(app) {
    app.use(bodyParser.json());  
    app.use(bodyParser.urlencoded({extended: true}));  
    app.use(cors());
    app.use('/public', express.static('public'));
    // require('../middlewares/authorization').init(app);
    recursivelyLoadRouters(__dirname, app);
}
exports.init = init;
