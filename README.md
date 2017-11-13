# hotelbooking
## Descripción:

API para la gestión de habitaciones de hoteles en un país.

#### Modelos de Datos:
- Departamentos y Ciudades (departments).
- Hoteles (hotels).
- Habitaciones (rooms).
- Reserva de habitaciones (bookings).
- Usuarios.

#### Clonar
~~~ bash
  git clone ruta
~~~

#### Instalar dependencias
~~~ bash
  npm install
~~~

#### Poblar base de datos
~~~ bash
  npm run populate-db
~~~

#### Eliminar datos
~~~ bash
  npm run clean-db
~~~

#### Rutas:

- **Departments**

  [POST] /departments

  Agregar un departamento.

  [GET]   /departments

  Consultar los estados y sus ciudades.

  [GET]   /departments/department_id

  Consultar un departamento.

  [PUT]   /departments/department_id

  Actualizar un departamento.


- **Hotels**

  [POST]  /hotels

  Agregar un hotel.

  [GET]   /hotels

  Consultar los hoteles con habitaciones disponibles según el filtro < query: fechas, ubicación, hotel >.

  Parámetros querystring:

  ~~~ js
        from_date, to_date, department_id, city_id
  ~~~

  *Nota: Si no se indican parámetros en la consulta, la respuesta es un arreglo vacío.*

  [GET]   /hotels/hotels_id

  Consultar un hotel.

  [PUT]   /hotels/hotels_id

  Actualizar la información de un hotel.

  [POST]   /hotels/hotels_id/rooms

  Agregar una habitación a un hotel.

  ~~~ js
        datos de entrada:
          {
            "price":12000,
            "capacity":1,
            "room_type":"individual",
            "number":"C102"
          }
  ~~~

  [PUT]   /hotels/hotels_id/rooms/room_id

  Actualizar la información de la habitación de un hotel.

  [GET]   /hotels/hotels_id/rooms

  Cosultar las habitaciones de un hotel.

  [DELETE]   /hotels/hotels_id/rooms/room_id

  Eliminar una habitación.


  - **Bookings**

  [POST]  /bookings

  Agregar una reserva:

  ~~~ js
      datos de entrada:
            {
              "client_id":"5a063e00ade8ac5007f9c0b5",
              "hotel_id":"5a05fadbe6ee386455e5c1c8",
              "room_id":"5a071949ed21713c360599f2",
              "from_date":"10/11/2017",
              "to_date":"14/11/2017"
            }
  ~~~

  [GET]   /bookings/bookings_id

  Consultar una reserva.

  - **Usuarios**

  [GET]   /users/user_id

  Consultar un usuario.

  [GET]   /users/user_id

  Actualiza la información del usuario.

   ~~~ js
        datos de entrada:
            {
              "first_name": "Antony",
              "last_name": "Gonzalez",
            }
  ~~~

  *Nota: Los datos básicos se pueden editar.*

  - **Autenticación**

  [POST] /oauth/register

  Registrar un usuario.

  ~~~ js
        datos de entrada:
            {
              "first_name": "Antony",
              "last_name": "Petrocelli",
              "email": "petrocellia@gmail.com",
              "password": "admin"
            }
  ~~~

  *Nota: Al registrarse un usuario, por defecto se le asigna el rol 'client'.*

  [POST] /oauth/login

  Identificar a un usuario.

  ~~~js
        datos de entrada:
            {
              "email": "client@hotelguarumo.com",
              "password": "admin"
            }
  ~~~

