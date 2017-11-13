"use strict";

function init(app) {	
	const HotelSchema = new app.db.adapter.Schema({
		name:{
			type:"String",
			required:true
		},
		stars:{
			type:Number,
			default:1,
			min:1,
			max:5
		},
		location:{
			department_id:{
				type:app.db.adapter.Schema.Types.ObjectId,
				ref:'City',
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
				type:String,
				required:true
			},
			address:{
				type:String
			}
		},
		rooms:{
			type:[app.db.adapter.Schema.Types.ObjectId],
			default:[]
		},
		check_time:{
			check_out:{
				type:String,
				default:'12:00'
			},
			check_in:{
				type:String,
				default:'15:00'
			}
		}
	},{
		timestamps: true,
		toObject: {virtuals: true},
		toJSON: {virtuals: true}		
	});
	
	// indice compuesto para todos los campos de texto de la coleccion hotel
	HotelSchema.index({'location.department_id':1, 'location.city_name':1});
	HotelSchema.index({'hotel.name':'text', room_type:'text'}, {default_language:'spanish'});

	app.models.Hotel = app.db.adapter.model('Hotel', HotelSchema);
}

exports.init = init;