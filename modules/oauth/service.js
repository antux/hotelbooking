"use strict";
const jwt     = require('jsonwebtoken');
const token = new (require('../../lib/gentoken'));

const Service = (function () {
  function Service(app) {
      this.app = app;
  }

  // metodo para registrar a un usuario
  Service.prototype.register = function (input, cb) {
    const app = this.app;

      let User = new app.models.User({
        first_name: input.first_name,
        last_name:  input.last_name,
        email:      input.email,
        password:   input.password,
        role:       'client',
      });

      const validation = User.validateSync();
      if (validation != undefined){
        cb({status:400, message:validation},null)
      }

      User.save()
      .then(function(result){
        return  cb(null,{message:"Usuario registrado satisfactoriamente."});
      })

      .catch(function(err){
        cb({status:400, message:err},null);
      })
  };  

  // metodo para identificar a un usuario
  Service.prototype.login = function (input, cb) {
    const app = this.app;
    const User = app.models.User.findOne({email: input.email, is_authenticated:true})
    .select("-updatedAt -createdAt -__v -is_authenticated -id")
    .exec()
    .then(function(user) {
      const promesa = new Promise(function(resolve, reject){
        if (!user) {
            reject({ status: 400, message:'¡Usuario no encontrado!'});
        } else {
            user.comparePassword(input.password, function (err, isMatch) {
              if(isMatch){
                resolve(user);
              }
              else{
                reject({ status: 400, message:'Fallo la autenticación. Contraseña incorrecta.'});
              }
            })  
        }
      });

      return promesa.then(function(user){
        return user;
      })
    })

    .then(function(user){

      if (user.hasOwnProperty('status') && user.status == 400){
        throw user.message;
      }
      const t = token.generate(user._id, user.role, undefined);
      // se setea el password para no enviarlo
      user.password = undefined;
      return cb(null, {
        user:user,
        token: t.code,
        tokenExpires: t.payload.exp
      });
    })

    .catch(function(err){
      console.log(err);
      cb(err, null);
    })
  };
  
  return Service;
}());
exports.Service = Service;
