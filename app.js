var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nunjucks = require('nunjucks');
require('dotenv').config()


var app = express();

nunjucks.configure(path.join(__dirname, 'public'), {
  express: app,
  watch: true
});
app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'public'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var dataRouter = require('./routes/data');
var devicesRouter = require('./routes/devices');


app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

// Static File Hosting
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/popper.js/dist'));
app.use(express.static(__dirname + '/node_modules/animejs/lib'));
app.use(express.static(__dirname + '/node_modules/timepicker'));
app.use(express.static(__dirname + '/node_modules/plotly'));

// Routing
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/health', dataRouter);
app.use('/device', devicesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use (function (req, res, next) {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

module.exports = app;
