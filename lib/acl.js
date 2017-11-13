"use strict"

var ACL = require('acl');
var backend = require('acl-mem-regexp');


var init = function(app){
	
	//console.log(app.db.connection);
	//var acl = new ACL(new ACL.mongodbBackend(app.db.connection, 'acl_',true));
	//var acl = new ACL(new ACL.memoryBackend());
	var acl = new ACL(new backend());
	var permissions = {
		'C':['POST'],
		'R':['GET'],
		'U':['PUT'],
		'D':['DELETE'],
		'CR':['POST','GET'],
		'CU':['POST','PUT'],
		'CUD':['PUT','POST','DELETE'],
		'CRU':['GET','POST','DELETE'],
		'RU':['GET','PUT'],
		'RD':['GET','DELETE'],
		'RUD':['GET','PUT','DELETE'],
		'CRUD':['POST','GET','PUT','DELETE'],
		'UD':['PUT','DELETE'],
	}

	var patron = '[a-zA-Z0-9]+'

	acl.allow([
		
		{
			roles:['guest'],
			allows:[
				{resources:`/bookings`, permissions:permissions.R}, // consulta las reservas
				{resources:'/departaments', permissions:permissions.R}, // consulta de departamentos y ciudades
				{resources:'/hotels', permissions:permissions.R}, // consultas de hoteles
				{resources:`/hotels/${patron}/rooms`, permissions:permissions.R}, // consulta de habitaciones de un hotel
				{resources:'/oauth/register', permissions:permissions.C}, // reigstro
				{resources:'/oauth/login', permissions:permissions.C}, // identificación
			]
		},
		{
			roles:['parent_client'],
			allows:[
				{resources:`/bookings`, permissions:permissions.C}, // crea una reserva
				{resources:`/bookings/${patron}`, permissions:permissions.RD}, // consulta y elimina una reserva
				{resources:`/users/${patron}/`, permissions:permissions.RU}, // consulta y actuliza datos personales
				{resources:`/users/${patron}/bookings`, permissions:permissions.R}, // consulta de reservas
			]
		},
		{
			roles:['parent_mantenedor'],
			allows:[
				{resources:`/hotels/${patron}/rooms`, permissions:permissions.C}, // agregar habitaciones a un hotel
				{resources:`/hotels/${patron}/rooms/${patron}`, permissions:permissions.CUD}, // modificar una habitación
				{resources:`/hotels`, permissions:permissions.C}, // agregar un hotel
			]
			
		},
		{
			roles:['parent_administrador'], // rol de gestion de información basica de la api
			allows:[
				{resources:`/users/`, permissions:permissions.R}, // consulta los usuarios
				{resources:`/users/${patron}`, permissions:permissions.R}, // consulta un usuario
				{resources:`/departaments/`, permissions:permissions.CR}, // consulta departamentos y ciudades
				{resources:`/departaments/${patron}`, permissions:permissions.RUD},
			]
		}
				

	],function(err){
		console.log("acl error: ", err);
	});
	

	acl.addRoleParents('client',['guest','parent_client']);
	acl.addRoleParents('mantenedor',['parent_mantenedor','parent_client']);
	acl.addRoleParents('administrador',['parent_administrador']);

	acl.addUserRoles('guest','guest');
	acl.addUserRoles('client','client');
	acl.addUserRoles('mantenedor','mantenedor');
	acl.addUserRoles('administrador','administrador');

	app.acl = acl;
}

exports.init = init