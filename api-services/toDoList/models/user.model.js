const mongoose = require('mongoose')

var uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
    values: ["PORTAL", "APP"],
    message: '{VALUE} no es un role válido'
}

let Schema = mongoose.Schema

let userSchema = new Schema({
    name: {
        type: "String",
        unique: true,
        required: [true, 'El usuario es necesario'] 
    },
    password: {
        type: "String",
        unique: true,
        required: [true, 'La contraseña es obligatoria'] 
    },
    role: {
        type: String,
        default: 'APP',
        required: [true],
        enum: rolesValidos
    }
})

userSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('User', userSchema)