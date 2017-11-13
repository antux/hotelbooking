'use strinct'

var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../config/config')

var Service = (function(){
	function Service (){

	}

	Service.prototype.generate = function (user_id, user_role, exp){
	    var token = {}

		var expire = (exp)?exp:1;
	    token.payload = {
	        _id: user_id,
	        role:user_role,
	        iat: moment().unix(),
	        exp: moment().add(expire, "days").unix(),
	    };                  
	    token.code = jwt.sign(token.payload, config.secret);
	    return token;
	}

	// genera token para recuperar contraseña y validar cuenta de correo
	Service.prototype.genHash = function(user){
		var token = {}
	    token.payload = {
	        _id: user._id,
	        email: user.email,
	        iat: moment().unix(),
	        exp: moment().add(24, "hours").unix(),
	    };                  
	    token.code = jwt.sign(token.payload, config.secret);
	    return token;
	}


	Service.prototype.verifyToken = function(token,cb){
		return jwt.verify(token, config.secret, function(err, decoded) {
			console.log("token decoded: ", decoded);
			if (err && err.message == 'jwt expired'){
				//console.log('invalid: ', err);
				return cb(err ,null);
				//return cb({is_valid:false, expired:true,  message:"this token has expired!"} ,null);
			}
			return cb(null,{is_valid:true});
			
		})
	}

	return Service
})();



module.exports = Service

