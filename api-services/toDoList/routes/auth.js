var express = require('express');
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require('../models/user.model');


var router = express.Router();

router.get('/', function (req, res, next) {
    res.end('Welcome to You in auth Page')
});

router.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    User.findOne({ username: username }, loginCallback)

    function  loginCallback(erro, user) {
        console.log(user)
        if (erro) {
            return res.status(500).json({
                result: false, 
                err: erro
            })
        }
        if (!user) {
            return res.status(400).json({
                result: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                })
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ 
                result: false, 
                err: { message: "Usuario o contraseña incorrectos" } 
            });
        }
        
        let token = jwt.sign({ user: user, algorithms: ['RS256'] }, 
            process.env.SEED_AUTENTICACION, 
            { 
                expiresIn: process.env.EXPIRATION_TOKEN,
            })
            
        res.json({ result: true, user, token })
    }

})

router.post('/register', function (req, res) {
    let body = req.body;
    let { username, password } = body;

    let user = new User({
        username,
        password: bcrypt.hashSync(password, 10)
    });

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                result: false,
                err,
            });
        }
        res.json({
            result: true
            
        });
    })
});
  


router.post('/decode', async (req, res) => {
    let token = req.headers['authorization']
    if (!token) {
        return {success: false, status: 401, error: "Es necesario el token de autenticación"}
    }

    token = token.replace('Bearer ', '')

    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err) {
            return {success: false, status: 401, error: 'Token inválido'}
        } else {
            return {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
})


module.exports = router;