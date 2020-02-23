var express = require('express');
var app = express();
var router = express.Router();

// Handle all customer logic separately
router.use('/customer', require(__dirname + '/Customer/main'));

// GET route for reading data
router.get('/', function (req, res, next) {
    return res.render('home', {layout: 'default', template: 'home'});
});

module.exports = router;