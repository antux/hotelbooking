"use strict";
var api = require('../../lib/api');
var UserService = require('./service');

function init(app) {
    const service = new UserService.Service(app);
    
    // ruta para crear una reserva
    app.post('/bookings', function (req, res, next) {
      service.create(req.body, function (err, booking) {
          api.response(err, req, res, booking, next);
      });
    });

    // ruta para consultar una reserva
    app.get('/bookings/:booking_id', function (req, res, next) {
      service.getOne(req.params.booking_id, function (err, bookings) {
          api.response(err, req, res, bookings, next);
      });
    });
}
exports.init = init;