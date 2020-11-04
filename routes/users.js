var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login.njk', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.njk', { title: 'Express' });
});

module.exports = router;
