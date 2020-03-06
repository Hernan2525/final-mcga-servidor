const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express()
//Importamos User Schema
const UserSchema = require('./models/User.js');
//Importamos Client Schema
const ClientSchema = require('./models/Client.js');

/*
secretSign es una cadena secreta que usamos para firma los tokens.
*/
const secretsign = 'MCGA2020';

const url = "mongodb+srv://hernan:hh35198624@cluster0-o7h4x.mongodb.net/test?retryWrites=true&w=majority"


mongoose.connect(url, function(err) {
  if (err) {
    console.log("No se pudo conectar a MongoDB!");
  } else {
    console.log(`MongoDB conectado con éxito!`);
  }
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.status(200).send("<h1>Test server</h1>")
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor corriendo en puerto 4000')
})

//Ruta POST para registrar nuevos usuarios
app.post('/register', function(req, res) {
  const { email, password } = req.body;
  const user = new UserSchema({ email, password });
  user.save(function(err) {
    if (err) {
      res.status(500)
        .send("Error al registrar un nuevo usuario, intente nuevamente.");
    } else {
      res.status(200).send("Usuario registrado exitosamente!");
    }
  });
});


//Ruta POST para agregar nuevos clientes
app.post('/addclient', function(req, res) {
  const { id, cuit, nombre, telefono } = req.body;
  const client = new ClientSchema({ id, cuit, nombre, telefono });
  client.save(function(err) {
    if (err) {
      res.status(500)
        .send(err);
    } else {
      res.status(200).send("El cliente ha sido agregado exitosamente!");
    }
  });
});


//Ruta POST para modificar clientes existentes
app.post('/modclient', function(req, res) {
  const { id, cuit, nombre, telefono } = req.body;

  ClientSchema.update({id:id},{$set:{cuit:cuit,nombre:nombre,telefono:telefono}},{multi:true,new:true})
  .then((docs)=>{
    if(docs) {
      res.status(200).send("El cliente ha sido modificado exitosamente!");
    } else {
      res.status(500)
        .send("Error al modificar el cliente, intente nuevamente.");
    }
 })

});

//Ruta POST para eliminar
app.post('/remclient', function(req, res) {
  const { id, cuit, nombre, telefono } = req.body;

  ClientSchema.remove({id:id})
  .then((docs)=>{
    if(docs) {
      res.status(200).send("El cliente ha sido eliminado exitosamente!");
    } else {
      res.status(500)
        .send("Error al eliminar el cliente, intente nuevamente.");
    }
 })

});


//Ruta GET para obtener todos los clientes existentes
app.get('/getclients', function(req, res) {

  ClientSchema.find({}, (err, docs) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(docs);
  });

});

//Ruta GET para validar que el token sea valido
app.get('/checkToken', function(req, res) {
  res.sendStatus(200);
});

//Ruta POST para login de usuarios registrados
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserSchema.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secretsign, {
            expiresIn: '1h'
          });

          res.status(200).send({
              success: true,
              message: 'User logged successfully',
              token: token
          });
        }
      });
    }
  });
});
