"use strict";

function init(app) {

	const BookingSchema = new app.db.adapter.Schema({
		hotel: {
			hotel_id:{
				type: app.db.adapter.Schema.Types.ObjectId,
				ref:'Hotel',
				required: true
			},
			name:{
				type:String,
				required:true
			}
		},
		client:{
			client_id:{
				type:app.db.adapter.Schema.Types.ObjectId,
				ref:'User',
				required:true
			},
			full_name:{
				type:String,
				required:true
			}
		},
		room:{
			room_id:{
				type:app.db.adapter.Schema.Types.ObjectId,
				ref:'Room',
				required:true
			},
			type: {
				type: String,
				required:true
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
		},
		date:{
			from:{
				type:Date,
				required:true,
			},
			to:{
				type:Date,
				required:true,
			}
		},
		location:{
			department_id:{
				type:String, // como no usará para poblar, solo se usa para comparar, no se especifica tipo de dato ObjectId
				required:true
			},
			department_name:{
				type:String,
				required:true
			},
			city_name:{
				type:String,
				required:true
			},
			city_id:{
				type:String, // como no se pobla, solo se usa para comparar, no se especifica tipo de dato ObjectId
				required:true
			}
		}
	},{
		timestamps: true,
		toObject: {virtuals: true},
		toJSON: {virtuals: true}		
	});
	
	BookingSchema.index({'hotel.hotel_id':1, 'room.room_id':1,'room.type':1, 'date.from':1, 'date.to':1});

	// indice compuesto para todos los campos de texto de la coleccion Booking
	BookingSchema.index({'hotel.name':'text', room_type:'text'}, {default_language:'spanish'});

	app.models.Booking = app.db.adapter.model('Booking', BookingSchema);
}

exports.init = init;