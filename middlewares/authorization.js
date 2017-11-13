"use strict";
const jwt = require('jsonwebtoken');
const path = require('path');
function init(app) {
	app.use(function (req, res, next) {
		console.log('path: ',req.url);

		let _path = req.path.slice(-1) != '/' ? req.path : req.path.slice(0,-1);
		if(_path.indexOf('/public/images/') != -1){
			next();
		}

		else if (req.method == 'OPTIONS'){
			next();
		}

		else{
			let bearerToken;
			let bearerHeader = req.headers["authorization"];

			console.log('Header: Authorization: ',bearerHeader);

			if (typeof bearerHeader !== 'undefined') {
				//var bearer = bearerHeader.split(" ");
				//bearerToken = bearer[1];
				bearerToken = bearerHeader;
				jwt.verify(bearerToken, app.config.secret, function(err, decoded) {
					if (err) {
						return res
							.status(403)
							.send({ success: false, message: err.message });
					}else {
						_path = req.path.slice(-1) != '/' ? req.path : req.path.slice(0,-1);
						let role;
						if (decoded.role){
							role = decoded.role;
						}
						else{
							role = 'guest';
						}

						console.log('toke: ', decoded);
						console.log('role: ', role);
						console.log('path: ', _path);
						console.log('method: ', req.method);
						

						app.acl.isAllowed(role, _path, req.method,function(err, response){
							console.log("isAllowed: ", response);
							console.log("path normalize: ", _path);
							if (err){
								return res
									.status(500)
									.send({message:err});
							}
							else if (response){
								req.user = decoded;
								next();
							}
							else{
								return res
									.status(403)
									.send({ success: false, message: "No tiene acceso para esta ruta" });
							}
						})
					}
				});
			}
			else if (!req.headers["authorization"]){
				console.log('........ user guest');
				app.acl.isAllowed('guest',_path, req.method, function (err, response){
					if (err){
						return res
							.status(500)
							.send({message:err});
					}
					else if (response){
						next();
					}
					else{
						return res
							.status(403)
							.send({ success: false, message: "¡La ruta no existe o el metodo no es correcto!" });
					}
				})
			}

			else {
				return res
					.status(401)
					.send({message: "¡La consulta require un token de authenticacion!"});
			}
		}
	});
}
exports.init = init;