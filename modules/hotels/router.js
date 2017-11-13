"use strict";
var api = require('../../lib/api');
var DepartmentService = require('./service');

function init(app) {
  var service = new DepartmentService.Service(app);

  // ruta para agregar un hotel
  app.post('/hotels', function (req, res, next) {
    service.create(req.body, function (err, hotel) {
        api.response(err, req, res, hotel, next);
    });
  });

  // ruta para consultar un hotel
  app.get('/hotels/:hotel_id', function (req, res, next) {
    service.getOne(req.params.hotel_id, function (err, hotel) {
        api.response(err, req, res, hotel, next);
    });
  });

  // ruta para actualizar la información de un hotel
  app.put('/hotels/:hotel_id', function (req, res, next) {
    service.updateHotel(req.params.hotel_id, req.body, function (err, hotel) {
        api.response(err, req, res, hotel, next);
    });
  });

  // ruta para cosultar las habitaciones de un hotel
  app.get('/hotels/:hotel_id/rooms', function (req, res, next) {
    service.getAllRooms(req.params.hotel_id, req.query, function (err, rooms) {
        api.response(err, req, res, rooms, next);
    });
  });

  // ruta para agregar una habitación a un hotel
  app.post('/hotels/:hotel_id/rooms', function (req, res, next) {
    service.addRoom(req.params.hotel_id, req.body, function (err, room) {
        api.response(err, req, res, room, next);
    });
  });

  // ruta para actualizar la información de la habitación de un hotel
  app.put('/hotels/:hotel_id/rooms/:room_id', function (req, res, next) {
    service.updateRoom(req.params.hotel_id, req.params.room_id, req.body, function (err, room) {
        api.response(err, req, res, room, next);
    });
  });

  // ruta para eliminar una habitación
  app.delete('/hotels/:hotel_id/rooms/:room_id', function (req, res, next) {
    service.deleteRoom(req.params.hotel_id, req.params.room_id, function (err, response) {
        api.response(err, req, res, response, next);
    });
  });

  // ruta para consultar los hoteles con habitaciones disponibles segun el filtro query
  app.get('/hotels', function (req, res, next) {
    service.getAvailableRoomsByHotel(req.query, function (err, hotels) {
        api.response(err, req, res, hotels, next);
    });
  });
}
exports.init = init;