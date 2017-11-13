"use strict";

function init(app) {
	const UserSchema = new app.db.adapter.Schema({
		first_name: {
			type: String,
			required: true
		},
		last_name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese una dirección de correo electrónico válida.'],
			required: true
		},
		password: {
			type: String,
			required:true
		},
		is_authenticated: {
			type: Boolean,
			default: false
		},
		role: {
			type: String,
			enum: app.config.roles,
			required:true
		}
	}, {
		timestamps: true,
		toObject: {virtuals: true},
		toJSON: {virtuals: true}		
	});
	

	UserSchema.index({first_name:1})
	UserSchema.index({last_name:1})
	// indice compuesto para todos los campos de texto de la coleccion usuario
	UserSchema.index({first_name:'text', last_name:'text', email:'text'}, {default_language:'spanish'});


	UserSchema.virtual('full_name').get(function () {
		return this.first_name + ' ' + this.last_name;
	});

	UserSchema.pre('save', function (next) {
		const user = this;
		user.wasNew = user.isNew;
		if(user.isNew){
			app.encrypt.genSalt(10, function (err, salt) {
				if (err) {
					return next(err);
				}
				app.encrypt.hash(user.password, salt, function (err, passwordhash) {
					if (err) {
						return next(err);
					}
					user.password = passwordhash;
					user.is_authenticated = true;
					next();
				});
			});
		}
		

		if (user.isModified('password')) {
			app.encrypt.genSalt(10, function (err, salt) {
				if (err) {
					return next(err);
				}
				app.encrypt.hash(user.password, salt, function (err, hash) {
					if (err) {
						return next(err);
					}
					user.password = hash;
					next();
				});
			});
		} 
		else {
			next();
		}
	});

	UserSchema.methods.compareHash = function (hash, cb) {
		app.encrypt.compare(hash, this.hash, function (err, isMatch) {
			if (err) {
				return cb(err, null);
			}
			return cb(null, isMatch);
		});
	};

	UserSchema.methods.comparePassword = function (passw, cb) {
		app.encrypt.compare(passw, this.password, function (err, isMatch) {
			if (err) {
				return cb(err, null);
			}
			return cb(null, isMatch);
		});
	};


	app.models.User = app.db.adapter.model('User', UserSchema);
}

exports.init = init;