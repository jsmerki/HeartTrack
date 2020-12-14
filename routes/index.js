var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.njk', { title: 'Express' });
});

router.get('/.well-known/acme-challenge/QY_IaT16z5QCwHeAbHWRu-aB2zMx-k9E2Hsk8DEUGcg', function(req, res, next) {
  res.render('code.njk', { title: 'Express' });
});


module.exports = router;
