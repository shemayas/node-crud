var express = require('express');
var app = express();
var router = express.Router();

router.use('/account', require(__dirname + '/account'));

module.exports = router;
