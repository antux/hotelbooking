"use strict";

const Service = (function () {
  function Service(app) {
      this.app = app;
  }

  // metodo para consultar la información de un usuario
  Service.prototype.getOne = function (user_id, cb) {
    const app = this.app;
    app.models.User.findOne({_id:user_id})
    .select('-password -createdAt -updatedAt')
    .exec()
    .then((user) => {
      if(!user) throw "¡El usuario no existe!";
      cb(null, user)
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  // metodo para actualizar la información de un usuario
  Service.prototype.update = function (user_id, input, cb) {
    const app = this.app;

    delete input.password;
    delete input.email;
  
    app.models.User.update({_id:user_id},{$set:input})
    .exec()
    .then((response) => {
      if(response.n == 0) throw "¡El usuario no existe!";
      cb(null, {message:'Usuario actualizado satisfactoriamente.'});
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }


  return Service;
}());
exports.Service = Service;
