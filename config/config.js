'use strict'

module.exports = {  
  name: 'api-hotelguarumo',
  secret: 'secret',
  db: {
    driver: 'mongodb',
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    port: '27017',
    name: 'hotelguarumo'
  },
  /* 
  Roles:
  0- administrador: administrador de información básica de la api
  1- mantenedor: persona encargada de gestionar información hotelera
  2- client: usuario final
  */
  roles: ["client","mantenedor","recepcionista"],
  hotel:{
    room_type: ["individual","double", "triple"]
  }
}
