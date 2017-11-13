"use strict";
var api = require('../../lib/api');
var UserService = require('./service');

function init(app) {
    var service = new UserService.Service(app);

    // ruta para registrar un usuario
    app.post('/oauth/register', function (req, res, next) {
      service.register(req.body, function (err, user) {
          api.response(err, req, res, user, next);
      });
    });

    // ruta para identificar a un usuario
    app.post('/oauth/login', function (req, res, next) {
        service.login(req.body, function (err, user) {
            api.response(err, req, res, user, next);
        });
    });
}
exports.init = init;