/*
CREAMOS UN MONGODB/MONGOOSE MODELO PARA EL OBJETO "USER"
*/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
	//Revisar si el documento es nuevo o se ingresó una nueva contraseña
	if (this.isNew || this.isModified('password')) {
		const document = this;
		bcrypt.hash(document.password, saltRounds, function(err, hashedPassword) {
			if (err) {
				next(err);
			}
			else {
				document.password = hashedPassword;
				next();
			}
		});
	}
	else {
		next();
	}
});

/*
Agregamos un método al UserSchema que tomará la contraseña ingresada como una cadena de caracteres,
y usaremos bcryptjs para desencriptar la contraseña y detectar si la contraseña ingresada es la correcta
*/

UserSchema.methods.isCorrectPassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, same) {
		if (err) {
			callback(err);
		} else {
			callback(err, same);
		}
	});
}

module.exports = mongoose.model('User', UserSchema);
