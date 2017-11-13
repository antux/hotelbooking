"use strict";
const api = require('../../lib/api');
const UserService = require('./service');

function init(app) {
  const service = new UserService.Service(app);

  // ruta para consultar la información de un usuario
  app.get('/users/:user_id', function (req, res, next) {
    service.getOne(req.params.user_id, function (err, user) {
        api.response(err, req, res, user, next);
    });
  });

  // ruta para actualizar la información de un usuario
  app.put('/users/:user_id', function (req, res, next) {
    service.update(req.params.user_id, req.body, function (err, user) {
        api.response(err, req, res, user, next);
    });
  });
}
exports.init = init;