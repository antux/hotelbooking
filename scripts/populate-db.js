'use strinct'

const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const config = require('../config/config');
const models = require('../models/index');

const app = {};
app.bcrypt = bcryptjs;
app.config = config;
const uri = config.db.driver + "://" + config.db.host + "/" + config.db.name;
const db = mongoose.connect(uri, {useMongoClient:true});
mongoose.Promise = Promise;
db.adapter = mongoose;
mongoose.set('debug', true);
mongoose.connection.on('connected', function(){
  app.db = db
  models.init(app)
  populate(app);
});


//models.init(app)

console.log('app');

const users = [
  {
    _id:db.adapter.Types.ObjectId('5a063e00ade8ac5007f9c0b5'),
    first_name:'client',
    last_name:'client',
    password:'$2a$10$KtZp92o.wbOnenDt/sT9Ku8MFITzH8mSW0xLnQnD3yUUKm1vD4dT.',
    email:'client@nada.com',
    role:'client',
    is_authenticated:true
  },
  {
    _id:db.adapter.Types.ObjectId('5a063e00ade8ac5007f9c0b6'),
    first_name:'mantenedor',
    last_name:'mantenedor',
    password:'$2a$10$KtZp92o.wbOnenDt/sT9Ku8MFITzH8mSW0xLnQnD3yUUKm1vD4dT.',
    email:'mantenedor@nada.com',
    role:'mantenedor',
    is_authenticated:true
  },
  {
    _id:db.adapter.Types.ObjectId('5a063e00ade8ac5007f9c0b7'),
    first_name:'administrador',
    last_name:'administrador',
    password:'$2a$10$KtZp92o.wbOnenDt/sT9Ku8MFITzH8mSW0xLnQnD3yUUKm1vD4dT.',
    email:'administrador@nada.com',
    role:'administrador',
    is_authenticated:true
  }
]

const departments = [{
    _id:"5a05ef08660f0e47efa73344",
    "name":"Arauca",
    "cities":[{_id:"5a08d39e1303c920ec6463ad", name:"Arauquita"}, {_id:"5a08d39e1303c920ec6463ac", name:"Fortul"}]
  },
  {
    _id:"5a05ef08660f0e47efa73347",
    name:"Cundinamarca",
    cities:[{_id:"5a08d39e1303c920ec6463af", name:"Bogotá"}, {_id:"5a08d39e1303c920ec6463ae", name:"Cota"}]
  }
]

const hotels = [
  {
    _id:'5a05fadbe6ee386455e5c1c8',
    name:"Bogotá Suite",
    stars:4,
    location:{
      department_id:'5a05ef08660f0e47efa73347',
      department_name:'Cundinamarca',
      city_name:'Bogotá',
      city_id:'5a08d39e1303c920ec6463af',
      address:''
    }
  },
  {
    _id:'5a05fadbe6ee386455e5c1cd',
    name:"Parce Suite",
    stars:3,
    location:{
      department_id:'5a05ef08660f0e47efa73344',
      department_name:'Arauca',
      city_name:'Arauquita',
      city_id:'5a08d39e1303c920ec6463ad',
      address:''
    },
    rooms:[
      
    ]
  }
]

const rooms = [
      { 
        _id:'5a071949ed21713c360599f0',
        hotel_id:'5a05fadbe6ee386455e5c1c8',
        price:50000,
        capacity:3,
        room_type:'triple',
        number:'A1'

      },
      {
        _id:'5a071949ed21713c360599f1',
        hotel_id:'5a05fadbe6ee386455e5c1c8',
        price:50000,
        capacity:3,
        room_type:'triple',
        number:'C3'
      },
      {
        _id:'5a071949ed21713c360599f2',
        hotel_id:'5a05fadbe6ee386455e5c1c8',
        price:36000,
        capacity:2,
        room_type:'double',
        number:'B8'

      },
      {
        _id:'5a071949ed21713c360599f3',
        hotel_id:'5a05fadbe6ee386455e5c1c8',
        price:20000,
        capacity:1,
        room_type:'individual',
        number:'A6'
      },
      { 
        _id:'5a071949ed21713c360599f5',
        hotel_id:'5a05fadbe6ee386455e5c1cd',
        price:40000,
        capacity:3,
        room_type:'triple',
        number:'A102'
      },
      {
        _id:'5a071949ed21713c360599f4',
        hotel_id:'5a05fadbe6ee386455e5c1cd',
        price:28000,
        capacity:2,
        room_type:'double',
        number:'A304'
      },
      {
        _id:'5a071949ed21713c360599f6',
        hotel_id:'5a05fadbe6ee386455e5c1cd',
        price:17000,
        capacity:1,
        room_type:'individual',
        number:'C222'

      }
    ]

const bookings = [{
  "_id": "5a09b342ddcdc5772e57de49",
  "location": {
    "city_id": "5a08d39e1303c920ec6463af",
    "city_name": "Bogotá",
    "department_name": "Cundinamarca",
    "department_id": "5a05ef08660f0e47efa73347"
  },
  "date": {
    "from": "2017-11-17T00:00:00.000Z",
    "to": "2017-11-17T00:00:00.000Z"
  },
  "room": {
    "room_id": "5a071949ed21713c360599f0",
    "type": "triple",
    "price": 50000,
    "capacity": 3
  },
  "client": {
    "client_id": "5a063e00ade8ac5007f9c0b5",
    "full_name": "client client"
  },
  "hotel": {
    "hotel_id": "5a05fadbe6ee386455e5c1c8",
    "name": "Bogotá Suite"
  },
  "id": "5a09b342ddcdc5772e57de49"
},
{
  "_id": "5a09b4286691e57ae85e27d7",
  "location": {
    "city_id": "5a08d39e1303c920ec6463af",
    "city_name": "Bogotá",
    "department_name": "Cundinamarca",
    "department_id": "5a05ef08660f0e47efa73347"
  },
  "date": {
    "from": "2017-11-17T00:00:00.000Z",
    "to": "2017-11-17T00:00:00.000Z"
  },
  "room": {
    "room_id": "5a071949ed21713c360599f1",
    "type": "triple",
    "price": 50000,
    "capacity": 3
  },
  "client": {
    "client_id": "5a063e00ade8ac5007f9c0b5",
    "full_name": "client client"
  },
  "hotel": {
    "hotel_id": "5a05fadbe6ee386455e5c1c8",
    "name": "Bogotá Suite"
  }
},
{
  "_id": "5a09b63478fea37b8623032f",
  "location": {
    "city_id": "5a08d39e1303c920ec6463af",
    "city_name": "Bogotá",
    "department_name": "Cundinamarca",
    "department_id": "5a05ef08660f0e47efa73347"
  },
  "date": {
    "from": "2017-11-18T00:00:00.000Z",
    "to": "2017-11-20T00:00:00.000Z"
  },
  "room": {
    "room_id": "5a071949ed21713c360599f2",
    "type": "double",
    "price": 36000,
    "capacity": 2
  },
  "client": {
    "client_id": "5a063e00ade8ac5007f9c0b5",
    "full_name": "client client"
  },
  "hotel": {
    "hotel_id": "5a05fadbe6ee386455e5c1c8",
    "name": "Bogotá Suite"
  }
},
{
  "_id": "5a09b6e978fea37b86230330",
  "location": {
    "city_id": "5a08d39e1303c920ec6463ad",
    "city_name": "Arauquita",
    "department_name": "Arauca",
    "department_id": "5a05ef08660f0e47efa73344"
  },
  "date": {
    "from": "2017-11-17T00:00:00.000Z",
    "to": "2017-11-19T00:00:00.000Z"
  },
  "room": {
    "room_id": "5a071949ed21713c360599f5",
    "type": "triple",
    "price": 40000,
    "capacity": 3
  },
  "client": {
    "client_id": "5a063e00ade8ac5007f9c0b5",
    "full_name": "client client"
  },
  "hotel": {
    "hotel_id": "5a05fadbe6ee386455e5c1cd",
    "name": "Parce Suite"
  }
},
{
  "_id": "5a09b71378fea37b86230331",
  "location": {
    "city_id": "5a08d39e1303c920ec6463ad",
    "city_name": "Arauquita",
    "department_name": "Arauca",
    "department_id": "5a05ef08660f0e47efa73344"
  },
  "date": {
    "from": "2017-11-20T00:00:00.000Z",
    "to": "2017-11-20T00:00:00.000Z"
  },
  "room": {
    "room_id": "5a071949ed21713c360599f6",
    "type": "individual",
    "price": 17000,
    "capacity": 1
  },
  "client": {
    "client_id": "5a063e00ade8ac5007f9c0b5",
    "full_name": "client client"
  },
  "hotel": {
    "hotel_id": "5a05fadbe6ee386455e5c1cd",
    "name": "Parce Suite"
  }
}]


function populate(app){
  /*
  */
  
  users.forEach((user) => {
    app.db.collection('users').insert(user);
  })
  departments.forEach((departament) => {
    new app.models.Department(departament).save();
  })

  hotels.forEach((hotel) => {
    new app.models.Hotel(hotel).save();
  })

  rooms.forEach((room) => {
    new app.models.Room(room).save()
    .then((response) =>{
      console.log('updating hotel..');
      app.models.Hotel.update({_id:room.hotel_id},{$addToSet:{rooms:room._id}}).exec()
    })

  })

  bookings.forEach((booking) => {
    new app.models.Booking(booking).save()
  })
  /*
  */


  //process.exit(0);
}