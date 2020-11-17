let express = require('express');
let router = express.Router();
let plotly = require('plotly');

/* GET health page. */
router.get('/', function(req, res, next) {
  res.render('visualization.njk', { title: 'Express' });
});

module.exports = router;
