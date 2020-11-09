var express = require('express');
const Task = require('../models/task.model');

var router = express.Router();

router.get('/', function(req, res) {
    res.end('send all tasks')
});

/* Create new task */
router.put('/', async function (req, res) {
    let body = req.body;
    let {userId} = req
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
                success: false,
                err,
            });
        }
        res.json({
            success: true,
            task
        });
    })
})

/* Get pending tasks */
router.get('/pending', function(req, res) {
    let {userId} = req
    Task.find({ userId: userId, finished_date: undefined, deleted_date: undefined }).exec((err, results)=> {
        if(!err) {
            res.json({"success": true, "tasks":results})
        } else if(rv_token.success) {
            res.json({"success": false, message:"No hay tareas pendientes"})        
        }
    });
});

/* Get active tasks */
router.get('/completed', function(req, res) {
    let {userId} = req
    Task.find({ userId: userId, finished_date:  { $ne: null }, deleted_date: undefined }).sort([['date']]).exec((err, results)=> {
        if(!err) {
            res.json({"success": true, "tasks":results})
        } else {
            res.json({"success": false, message:"No hay tareas activas"})        
        }
    });
});

router.post('/name/:taskId', async function (req, res) {
    let {taskId} = req.params;
    let body = req.body;
    let { name } = body;
    let task = await Task.findOne({ _id: taskId })
    if(task) {
        task.name = name
        task.modification_date = Date.now()
        task.save((err)=> {
            if(!err)
                res.json({ "success": true, "message": "Se ha editar la tarea" })
            else
                res.json({ "success": false, "message": "error al intentar editar" })
        })
    } else {
        res.json({ "success": false, "message": "No se encontró la tarea" })
    }
})

/* Remove a task */
router.delete('/:taskId', async function (req, res) {
    let {taskId} = req.params;
    let task = await Task.findOne({ _id: taskId })
    if(task) {
        task.deleted_date = Date.now()
        task.save((err)=> {
            if(!err)
                res.json({ "success": true, "message": "Se ha eliminado la tarea" })
            else
                res.json({ "success": false, "message": "error al intentar eliminar" })
        })
    } else {
        res.json({ "success": false, "message": "No se encontró la tarea" })
    }
})

/* Reorder a task */
router.post('/order', async function (req, res) {
    let body = req.body;
    let { tasks } = body;
    let result = {success:true, tasks:[]}
    tasks.forEach(async i_task => {
        let task = await Task.findOne({ _id: i_task._id})
        if(task) {
            task.order = i_task.order
            task.save((err)=> {
                if(!err)
                    result.tasks.push({updated: true, task})
                else {
                    result.tasks.push({updated: false, task, error: err})
                    result.success = false
                }
            })
        } else {
            result.tasks.push({updated: false, task:i_task, error: 'No se encontró la tarea'})
        }
    })
    res.json(result)
})

/* Update a task */
router.post('/complete', async function (req, res) {
    let body = req.body;
    let { taskId } = body;
    let task = await Task.findOne({ _id: taskId})
    if(task) {
        task.finished_date = Date.now()
        task.save((err)=> {
            if(!err)
                res.json({success: true, message: "Se ha actualizado una tarea"})
            else
                res.json({success: false, message: "Error al intentar actualizar una tarea"})
        })
    } else {
        res.json({success: false, message: "No se encontró la tarea"})
    }    
})
module.exports = router;