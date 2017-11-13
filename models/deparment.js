"use strict";

function init(app) {

	const CitySchema = new app.db.adapter.Schema({
		name:{
			type:String,
			required:true,
			index:true
		}
	})

	const DepartmentSchema = new app.db.adapter.Schema({
		name: {
			type:String,
			required:true,
			unique:true
		},
		cities:[CitySchema]
	},{
		timestamps: true,
		toObject: {virtuals: true},
		toJSON: {virtuals: true}		
	});
	
	DepartmentSchema.index({name:1, 'cites.name':1});

	// indice compuesto para los campos de texto de la coleccion Deparment
	DepartmentSchema.index({'name':'text', 'cites.name':'text'}, {default_language:'spanish'});

	app.models.Department = app.db.adapter.model('Department', DepartmentSchema);
}

exports.init = init;