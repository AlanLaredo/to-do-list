var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.end('send all tasks')
});

router.get('/user/:userId', function(req, res, next) {
    res.end('send tasks by user')
});

router.get('/user/:userId/pending', function(req, res, next) {
    res.end('send pending tasks by user')
});

router.get('/user/:userId/active', function(req, res, next) {
    res.end('send active tasks by user')
});
    
module.exports = router;