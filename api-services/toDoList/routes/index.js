var express = require('express');
const app = express()

var authentication = require('./authentication')
var tasks = require('./tasks')

app.use('/authentication', authentication)
app.use('/tasks', tasks)

module.exports = app;