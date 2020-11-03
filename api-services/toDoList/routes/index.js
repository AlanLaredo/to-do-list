var express = require('express');
var authentication = require('./auth')
var tasks = require('./tasks')

const app = express()

app.use('/auth', authentication)
app.use('/tasks', tasks)


module.exports = app;