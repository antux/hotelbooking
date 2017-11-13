"use strict";

function init(app) {
	const RoomSchema = new app.db.adapter.Schema({
		hotel_id:{
			type: app.db.adapter.Schema.Types.ObjectId,
			ref:'Hotel',
			required: true
		},
		price: {
			type: Number,
			required: true,
			min:0,
			index:true
		},
		capacity: {
			type: Number,
			required:true,
			min:0,
			index:true
		},
		room_type: {
			type: String,
			enum: app.config.hotel.room_type,
			required:true
		},
		number:{
			type:String,
			required:true
		}
	},{
		timestamps: true,
		toObject: {virtuals: true},
		toJSON: {virtuals: true}		
	});
	
	// indice compuesto para todos los campos de texto de la coleccion room
	RoomSchema.index({room_type:'text', number:'text'}, {default_language:'spanish'});

	app.models.Room = app.db.adapter.model('Room', RoomSchema);
}

exports.init = init;