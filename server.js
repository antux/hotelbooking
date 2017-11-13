"use strict";
const express = require('express');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./modules/router');
const models = require('./models/index');
const authorization = require('./middlewares/authorization');
const acl = require('./lib/acl');

function bootstrap(cb) {
  let app = express();
  app.config = require('./config/config');
  app.jwt = jwt;
  app.encrypt = bcryptjs;
  app.use(morgan('dev'));
  mongoose.set('debug', true);
  mongoose.Promise = Promise;
  // Instantiate DB adapter
  const uri = app.config.db.driver + "://" + app.config.db.host + "/" + app.config.db.name;
  const db = mongoose.connect(uri, { useMongoClient: true });
  db.adapter = mongoose;
  mongoose.connection.on('connected', function () {
    app.db = db;
    return cb(null, app);
  });

  mongoose.connection.on('error', function (err) {
    console.log(err);
    return cb(err, null);
  });
}

 bootstrap(function (err, app) {
  if(err) throw err;

  authorization.init(app);
  models.init(app);
  router.init(app);
  acl.init(app);
  app.listen(3000)

  if(require.main === module){

  }
});
