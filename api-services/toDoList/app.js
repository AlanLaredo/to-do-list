var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


var jwt = require('jsonwebtoken')
const User = require('./models/user.model');


dotenv.config()
process.env.EXPIRATION_TOKEN = '10h';//hours
process.env.SEED_AUTENTICACION = 'to-do-list-development-seed';

const routes = require('./routes');
const { Console } = require('console');

var app = express();
/* especific cors
var whitelist = ['http://127.0.0.1:8100']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}*/
// app.use(cors({origin:'http://127.0.0.1:8100'}))
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("*", async function(req, res, next) {
    let partsOfPath = req.originalUrl.split('/')

    let levelOne = '/'+partsOfPath[1]
    let levelTwo = '/'+partsOfPath[1]+'/'+partsOfPath[2]
    let levelThree = '/'+partsOfPath[1]+'/'+partsOfPath[2]+'/'+partsOfPath[3]

    if (levelOne == '/users'
        || levelTwo == '/auth/login'
        || levelTwo == '/users/checkusername') 
        return next()

    let token = req.headers['authorization']
    let userId
    if (!token)
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err)
            res.json({status: 400, success: false, message: "Token no válido"})
        else 
            userId = row.user._id
    })
    let user = await User.findOne({_id: userId})
    if(user.token == token) {
        req.userId = userId
        req.token = token
        console.log(user.username)
        next()
    } else {
        return res.json({
            success: false,
            message: "El token no esta registrado",
            status: 200
        })
    }
})

app.use('/', routes);

if(process.env.URLDB) {
    mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) throw err;
        console.log("Base de datos online: " + process.env.URLDB);
    });
} else {
    console.log("No se encontró la variable de entorno")
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
