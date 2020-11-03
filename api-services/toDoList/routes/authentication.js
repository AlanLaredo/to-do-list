var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.end('Welcome to You in authentication Page')
});
    
module.exports = router;