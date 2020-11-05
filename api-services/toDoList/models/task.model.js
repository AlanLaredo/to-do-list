const mongoose = require('mongoose')


let Schema = mongoose.Schema

let taskSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de tarea es necesario'] 
    },
    finished_date: {
        type: Date
    },
    order: {
        type: Number
    },
    deleted_date: {
        type: Date
    },
    userId: { 
        type: String
    }
})

module.exports = mongoose.model('Task', taskSchema)