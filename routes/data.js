var express = require('express');
var router = express.Router();

/* GET health page. */
router.get('/', function(req, res, next) {
  res.render('visualization.njk', { title: 'Express' });
});

module.exports = router;
