var express = require('express');
var authentication = require('./auth')
var tasks = require('./tasks')
var users = require('./users')

const app = express()

app.use('/auth', authentication)
app.use('/tasks', tasks)
app.use('/users', users)


module.exports = app;