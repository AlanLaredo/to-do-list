var express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.end('Welcome to You in users Page')
});

router.put('/', function (req, res) {
    let body = req.body
    let { username, password } = body
    username = username.trim().toLowerCase()
    let user = new User({
        username,
        password: bcrypt.hashSync(password, 10)
    });
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        res.json({
            success: true,
            message: "Se ha creado un nuevo usuario"
        })
    })
});

router.get('/checkusername/:username', function(req, res, next) {
    let {username} = req.params
    User.findOne({ username: username.toLowerCase() }, cbExistsUser)
    function cbExistsUser(erro, user) {
        if (erro) {
            return res.status(500).json({
                success: false, 
                err: erro
            })
        }
        if (!user) {
            return res.json({
                success: true,
                exists: false,
                message: "Nombre de usuario disponible"
            })
        }
        res.json({ success: true, exists: true, message: "El nombre de usuario ya esta en uso"})
    }
});

module.exports = router;