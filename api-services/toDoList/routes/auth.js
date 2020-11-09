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

    function loginCallback(erro, user) {
        if (erro) {
            return res.status(500).json({
                success: false, 
                err: erro
            })
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                })
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ 
                success: false, 
                err: { message: "Usuario o contraseña incorrectos" } 
            });
        }
        
        let token = jwt.sign({ 
            user: user, 
            algorithms: ['RS256'] }, 
            process.env.SEED_AUTENTICACION, { 
                expiresIn: process.env.EXPIRATION_TOKEN,
            })
            
        user.token = token
        user.save()
            
        res.json({ success: true, user, token })
    }

})


router.post('/logout', (req, res) => {
    /* validation */
    let token = req.headers['authorization']
    let user = {}
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"})
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err) {
            return res.json({ success: true, user, message: 'El token no es valido' })
        } else {
            user = row.user
        }
    })
    /* end  validation */

    User.findOne({ _id: user._id }, loginCallback)

    function loginCallback(erro, user) {
        if(user.token != token)
            return res.json({ success: true, user, message: 'El token no es valido' })

        if (erro) {
            return res.status(500).json({
                success: false, 
                err: erro
            })
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                    err: {
                        message: "El usuario no existe"
                    }
                })
        }

        user.token = null 
        user.save()
            
        res.json({ success: true, user, token })
    }

})
module.exports = router;