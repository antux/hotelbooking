"use strict";

const moment = require('moment');

const Service = (function () {
  function Service(app) {
      this.app = app;

      // metodo para obtener todas las reservas de un hotel segun los parametros de entrada
      this.getBookings = function(query){
        let from_date;
        let to_date;
        console.log('query: ', query);

        const pipeline = [];
        const promise = new Promise((resolve, reject) => {
          if (query.from_date && query.to_date){
            from_date = moment.utc(query.from_date,'DD/MM/YYYY hh:mm:ss').startOf('day').toDate();
            to_date = moment.utc(query.to_date,'DD/MM/YYYY hh:mm:ss').startOf('day').toDate();

            if(moment(from_date).diff(to_date, 'days') > 0) {
              console.log(moment(from_date).diff(to_date, 'days'))
              reject('¡La fecha hasta debe ser mayor que la fecha desde!');
              
            }
          }
          else{
            from_date = moment.utc().startOf('day').toDate();
            to_date = moment.utc().startOf('day').toDate();
          }

          const match = {$match:{}};
          if(query.hotel_id && query.room_id){
            match.$match['hotel.hotel_id'] = app.db.adapter.Types.ObjectId(query.hotel_id);
            match.$match['room.room_id'] = app.db.adapter.Types.ObjectId(query.room_id);
          }

          if(query.department_id && query.city_id){
            match.$match['location.department_id'] = query.department_id;
            match.$match['location.city_id'] = query.city_id;
          }
          console.log(`fechas booking_id:  ${from_date} y ${to_date}`);;;;
          match.$match['$or'] =  [
            {'date.from':{$gte:from_date,$lte:to_date}}, // si fecha de inicio de la reserva existen esta dentro del rango de las fechas a consultar
            {'date.to':{$gte:from_date, $lte:to_date}}, // o si fecha de fin de la reserva existen esta dentro del rango de las fechas a consultar
          ]

          // consulta
          pipeline.push(match)

          // agrupamiento
          pipeline.push({$group:{
            _id:{hotel_id:'$hotel.hotel_id'}, count:{$sum:1}, rooms:{$addToSet:'$room.room_id'}
          }})

          // proyección
          pipeline.push({$project:{
            _id:0, hotel_id:'$_id.hotel_id', rooms:'$rooms', count:'$count'
          }})


          const data = Promise.race([{date:{from_date:from_date, to_date:to_date}}])
          resolve(Promise.all([data, app.models.Booking.aggregate(pipeline)]));
        })

        return promise;
      }
  }

  // metodo para crear una reserva
  Service.prototype.create = function (input, cb) {
    const app = this.app;
    const _room = app.models.Room.findOne({_id:input.room_id})
    .populate({
      path:'hotel_id',
      model:'Hotel'
    })
    const _client = app.models.User.findOne({_id:input.client_id})
    const bookings = this.getBookings(input)
    bookings.then((result) =>{

      console.log('result ', result);
      if(result[1].length == 0){
        return Promise.all([_room, _client])
      }
      throw '¡Esta habitación ya esta ocupada para la fecha indicada!';
    })
    .then((response) => {
      console.log('response promise all: ', response);
      // si la habitación y el hotel asociado no existen
      if(!response[0]) throw '¡La habitación o el hotel asociado existe!';
      if(!response[1]) throw '¡El usuario no existe!';
      const room = response[0];
      const hotel = room.hotel_id;
      const client =response[1];
      const new_booking = {
        hotel: {
          hotel_id:hotel._id,
          name:hotel.name,
        },
        client:{
          client_id: client._id,
          full_name: `${client.first_name} ${client.last_name}`
        },
        room:{
          room_id: room._id,
          type: room.room_type,
          price: room.price,
          capacity: room.capacity,
        },
        date:{
          from:moment.utc(input.from_date,'DD/MM/YYYY hh:mm').startOf('day').toDate(),
          to:moment.utc(input.to_date,'DD/MM/YYYY hh:mm').startOf('day').toDate()
        },
        location:hotel.location
        }
      return new app.models.Booking(new_booking).save()
      })
      .then((booking) =>{
        cb(null, booking);
      })
      .catch((err) =>{
        console.log(err);
        cb({status:400, message:err});
      })
  };

  // metodo para obtener una reserva
  Service.prototype.getOne = function (booking_id, cb) {
    const app = this.app;
    app.models.Booking.findOne({_id:booking_id})
    .select('-password -createdAt -updatedAt')
    .exec()
    .then((booking) => {
      if(!booking) throw "¡La reserva solicitada no existe!";
      cb(null, booking)
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  return Service;
}());
exports.Service = Service;
