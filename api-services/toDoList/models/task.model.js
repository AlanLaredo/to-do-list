const mongoose = require('mongoose')


let Schema = mongoose.Schema

let taskSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de tarea es necesario'] 
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    finished_date: {
        type: Date
    },
    deleted_date: {
        type: Date
    },
    modification_date: {
        type: Date
    },
    order: {
        type: Number
    },

    userId: { 
        type: String
    }
})

module.exports = mongoose.model('Task', taskSchema)