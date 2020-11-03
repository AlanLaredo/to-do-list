var express = require('express');
var jwt = require('jsonwebtoken')
var router = express.Router();
const Task = require('../models/task.model');

router.get('/', function(req, res, next) {
    res.end('send all tasks')
});

/* Create new task */
router.put('/', function (req, res, next) {
    let token = req.headers['authorization']
    let rv_token = {}
    let userId
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err)
        rv_token = {status: 400,success: false,error: "Token inválido"}
        else {
            userId = row.user._id
            rv_token = {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
    if(!rv_token.success) 
        return res.json(rv_token)/* end validation */ 

    let body = req.body;
    let { name, order } = body;
    let task = new Task({
        name,
        status: 0,
        order: order,
        userId: userId
    });
    task.save((err, task) => {
        if (err) {
            return res.status(400).json({
                result: false,
                err,
            });
        }
        res.json({
            result: true,
            task
        });
    })
})

/* Get pending tasks */
router.get('/pending', function(req, res, next) {
    let token = req.headers['authorization']
    let rv_token = {}
    let userId
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err)
        rv_token = {status: 400,success: false,error: "Token inválido"}
        else {
            userId = row.user._id
            rv_token = {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
    if(!rv_token.success) 
        return res.json(rv_token)/* end validation */ 
    
    Task.find({ userId: userId, finished: false, deleted_date: undefined }).exec((err, results)=> {
        if(!err) {
            res.json({"success": true, "tasks":results})
        } else if(rv_token.success) {
            res.json({"success": false, message:"No hay tareas pendientes"})        
        }
    });
});

/* Get active tasks */
router.get('/completed', function(req, res, next) {
    let token = req.headers['authorization']
    let rv_token = {}
    let userId
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err)
        rv_token = {status: 400,success: false,error: "Token inválido"}
        else {
            userId = row.user._id
            rv_token = {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
    if(!rv_token.success) 
        return res.json(rv_token)/* end validation */ 

    Task.find({ userId: userId, finished: true, deleted_date: undefined }).exec((err, results)=> {
        if(!err) {
            res.json({"success": true, "tasks":results})
        } else {
            res.json({"success": false, message:"No hay tareas activas"})        
        }
    });
});

/* Remove a task */
router.delete('/', async function (req, res, next) {
    let token = req.headers['authorization']
    let rv_token = {}
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err)
            rv_token = {status: 400,success: false,error: "Token inválido"}
        else {
            rv_token = {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
    if(!rv_token.success) 
        return res.json(rv_token)/* end validation */ 

    let body = req.body;
    let { taskId } = body;

    let task = await Task.findOne({ _id: taskId })
    if(task) {
        task.deleted_date = Date.now()
        task.save((err)=> {
            if(!err)
                res.json({ result: true, message: "Se ha eliminado la tarea" })
            else
                res.json({ result: false, message: "error al intentar eliminar" })
        })
    } else {
        res.json({ result: false, message: "No se encontró la tarea" })
    }
})

/* Update a task */
router.post('/edit', async function (req, res, next) {
    /* validation */
    let token = req.headers['authorization']
    let rv_token = {}
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err) {
            return res.status(400).json({success: false, status: 401, error: "Token inválido"}); 
        } else {
            rv_token = {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
    /* end  validation */

    let body = req.body;
    let { taskId, name } = body;

    let task = await Task.findOne({ _id: taskId})
    if(task) {
        task.name = name
        task.save((err)=> {
            if(!err)
                res.json({result: true, message: "Se ha actualizado una tarea"})
            else
                res.json({result: false, message: "Error al intentar actualizar una tarea"})
        })
    } else {
        res.json({result: false, message: "No se encontró la tarea"})
    }
})

/* Update a task */
router.post('/complete', async function (req, res, next) {
    let token = req.headers['authorization']
    let rv_token = {}
    let userId
    if (!token) {
        return res.status(400).json({success: false, status: 401, error: "Es necesario el token de autenticación"}); 
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, process.env.SEED_AUTENTICACION, function (err, row) {
        if (err)
        rv_token = {status: 400,success: false,error: "Token inválido"}
        else {
            userId = row.user._id
            rv_token = {
                success: true, status:200, message: 'El token es valido' + row.user.username + ' ' + row.user._id + ' ' + process.env.EXPIRATION_TOKEN
            }
        }
    })
    if(!rv_token.success) 
        return res.json(rv_token)/* end validation */ 

    let body = req.body;
    let { taskId, name } = body;

    let task = await Task.findOne({ _id: taskId})
    if(task) {
        task.finished = true
        task.save((err)=> {
            if(!err)
                res.json({result: true, message: "Se ha actualizado una tarea"})
            else
                res.json({result: false, message: "Error al intentar actualizar una tarea"})
        })
    } else {
        res.json({result: false, message: "No se encontró la tarea"})
    }
})
module.exports = router;