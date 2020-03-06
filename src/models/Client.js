/*
CREAMOS UN MONGODB/MONGOOSE MODELO PARA EL OBJETO "CLIENT"
*/

const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true},
	cuit: { type: String, required: true, unique: true },
	nombre: { type: String, required: true, unique: false },
	telefono: { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Client', ClientSchema);
