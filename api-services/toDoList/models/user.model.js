const mongoose = require('mongoose')

var uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

let userSchema = new Schema({
    username: {
        type: "String",
        unique: true,
        required: [true, 'El usuario es necesario'] 
    },
    password: {
        type: "String",
        unique: true,
        required: [true, 'La contraseña es obligatoria'] 
    },
    token: "String",
    tokenExpiration: Date  
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