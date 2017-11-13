"use strict";
var api = require('../../lib/api');
var DepartmentService = require('./service');

function init(app) {
  var service = new DepartmentService.Service(app);
  // ruta para agregar un departamento (estado)
  app.post('/departments', function (req, res, next) {
    service.create(req.body, function (err, departament) {
        api.response(err, req, res, departament, next);
    });
  });

  // ruta para consultar los estados y sus ciudades
  app.get('/departments', function (req, res, next) {
    service.getAll(function (err, departments) {
        api.response(err, req, res, departments, next);
    });
  });

  // ruta para consultar un departamento (estado)
  app.get('/departments/:department_id', function (req, res, next) {
    service.getOne(req.params.department_id, function (err, department) {
        api.response(err, req, res, department, next);
    });
  });

  // ruta para actualizar un estado
  app.put('/departments/:department_id', function (req, res, next) {
    service.update(req.params.user_id, req.body, function (err, department) {
        api.response(err, req, res, department, next);
    });
  });
}
exports.init = init;