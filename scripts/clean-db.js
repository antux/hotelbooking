'use strinct'

const mongoose = require('mongoose');

const config = require('../config/config');
const models = require('../models/index');

const app = {};
app.config = config;
const uri = config.db.driver + "://" + config.db.host + "/" + config.db.name;
const db = mongoose.connect(uri, {useMongoClient:true});
mongoose.Promise = Promise;
db.adapter = mongoose;
mongoose.set('debug', true);
mongoose.connection.on('connected', function(){
  app.db = db
  models.init(app)
  clean(app);
});


function clean(app){
  app.models.User.remove({},function(err){});
  app.models.Department.remove({},function(err){});
  app.models.Hotel.remove({},function(err){});
  app.models.Room.remove({},function(err){});
  app.models.Booking.remove({},function(err){});
}