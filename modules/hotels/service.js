"use strict";

const moment = require('moment');

const BookingService = require('../booking/service');

const Service = (function () {
  function Service(app) {
      this.app = app;
      this.BookingService = new BookingService.Service(app);
  }

  // metodo para crear un hotel
  Service.prototype.create = function (input, cb) {
    const app = this.app;
    const Hotel = new app.models.Hotel(input);

    const validation = Hotel.validateSync();
    if(!validation) cb({status:400, message:validation},null);

    Hotel.save()
    .then((hotel) => {
      cb(null, hotel);
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  // metodo para actualizar la información de un hotel
  Service.prototype.updateHotel = function (hotel_id, input, cb) {
    const app = this.app;
    
    delete input.rooms
  
    app.models.Hotel.update({_id:user_id},{$set:input})
    .exec()
    .then((response) => {
      if(response.n == 0) throw "¡El hotel no existe!"
      cb(null, {message:'Hotel actualizado satisfactoriamente'});
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  // metodo para consultar las habitaciones de un hotel
  Service.prototype.getAllRooms = function (hotel_id, query, cb) {
    const app = this.app;
    const bookings = this.BookingService.getBookings({hotel_id:hotel_id})
    bookings.then((result) => {
      console.log('habitaciones de un hotel: ', result);
      const hotels = result[1];
      if(hotels.length == 1){
        return app.models.Hotel.find({_id:hotel_id})
        .populate({
          path:'rooms',
          model:'Room',
          match:{_id:{$nin:hotels.rooms}}
        })
        .select('name rooms')
      }
      
    })
    .then((rooms) => {
      if(rooms.length == 0) throw 'El hotel no existe';
      let from_date;
      let to_date;
      if(!query.from_date || !query.to_date) {
        console.log('no hay fechas')
        from_date = moment.utc().startOf('day').toDate();
        to_date = moment.utc().startOf('day').toDate();
      }
      cb(null, Object.assign({}, {date:{from_date:from_date, to_date:to_date}}, rooms));
    })
    .catch((err) => {
      console.log(err);
      cb({status:400, message: err}, null);
    })
  }  

  // metodo para agregar una habitación a un hotel
  Service.prototype.addRoom = function (hotel_id, input, cb) {
    const app = this.app;

    app.models.Hotel.find({_id:hotel_id}).count()
    .then((count) => {
      if(count == 0) throw "¡El hotel no existe!";
      
      return app.models.Room.findOne({hotel_id:hotel_id, number:input.number})
    })
    .then((room) => {
      if(room) throw `¡La habitación ${input.number} ya esta registrada en este hotel!`;
      input.hotel_id = hotel_id;
      return new app.models.Room(input).save()
    })
    .then((room) => {
      app.models.Hotel.update({_id:hotel_id},{$addToSet:{rooms:room._id}})
      cb(null,room)
    })
    .catch((err) =>{
      console.log(err);
      cb({status:400, message:err},null);
    })
  }

  // metodo para actualizar la información de la habitación de un hotel
  Service.prototype.updateRoom = function (hotel_id, room_id, input, cb) {
    const app = this.app;
    
    delete input.rooms
  
    app.models.Room.update({_id:room_id, hotel_id:hotel_id},{$set:input})
    .then((response) => {
      if(response.n == 0) throw "¡El hotel no existe!"
      cb(null, {message:'Habitación actualizado satisfactoriamente'});
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  // metodo para eliminar una habitación de un hotel
  Service.prototype.deleteRoom = function(hotel_id, room_id, cb){
    const app = this.app;
    app.models.Room.delete({_id:room_id, hotel_id:hotel_id})
    .then((response) => {
      if(response.n == 0) throw 'El hotel o la habitación no existen';
      return app.model.Hotel.update({_id:hotel_id},{$pull:{rooms:room_id}});
    })
    .then((response) => {
      if(response.n == 0) throw 'El hotel o la habitación no existen';
    })
  }

  // metodo para consultar los hoteles con habitaciones disponibles
  Service.prototype.getAvailableRoomsByHotel = function (query, cb){
    const app = this.app;
    query.operation = {count:false};
    const bookings = this.BookingService.getBookings(query);
    bookings.then((bookings) => {
      let iterator = 0;
      console.log('bookings: ', bookings);
      let hotels = bookings[1];
      let hotels_id = [];
      hotels.forEach((book) =>{
        hotels_id.push(book.hotel_id);
      })
        return app.models.Hotel.find({_id:{$in:hotels_id}})
        .then((hotels) => {
          console.log('hotels: ',hotels);
          return {hotels:hotels, bookings:bookings[1]};
        })
      })
      .then((result) =>{
        let final_hotels = [];
        const hotels = result.hotels;
        const bookings = result.bookings;
        hotels.forEach((hotel, index) => {
          const available_rooms = hotel.rooms.length - bookings[index].count;
          console.log('available_rooms: ', available_rooms);
          if (available_rooms > 0){
            final_hotels.push({hotel:hotel, available_rooms:available_rooms});
            console.log(hotels);
          }
        })
        cb(null, final_hotels);
      })
    .catch((err) =>{
      console.log(err);
      cb({status:400, message:err}, null);
    })
  }

  return Service;
}());
exports.Service = Service;
