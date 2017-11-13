"use strict";

const Service = (function () {
  function Service(app) {
      this.app = app;
  }

  // metodo para crear un departamento (estado)
  Service.prototype.create = function (input, cb) {
    const app = this.app;
    const Department = new app.models.Department(input);

    const validation = Department.validateSync();
    if(!validation) cb({status:400, message:validation},null);

    Department.save()
    .then((Departament) => {
      cb(null, Department);
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  // metodo para consultar todos los estados
  Service.prototype.getAll = function (cb) {
    const app = this.app;
    app.models.Department.find()
    .select('-createdAt -updatedAt -__v')
    .exec()
    .then((departaments) => {
      cb(null, departaments);
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }

  // metodo para obtener una reserva
  Service.prototype.getOne = function (department_id, cb) {
    const app = this.app;
    app.models.Department.findOne({_id:department_id})
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

  // metodo para actualizar una departamento (estado)
  Service.prototype.update = function (department_id, input, cb) {
    const app = this.app;

    app.models.Department.update({_id:department_id},{$set:input})
    .exec()
    .then((response) => {
      if(response.n == 0) throw "¡El departamento no existe!"
      cb(null, user)
    })
    .catch((err) =>{
      cb({status:400, message:err});
    })
  }


  return Service;
}());
exports.Service = Service;
