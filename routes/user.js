var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");
let fs = require('fs');
let User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login.njk', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.njk', { title: 'Express' });
});


/* Account Creation Form & Posting Endpoint */
router.get('/register', function(req, res, next) {
  res.render('register.njk', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
  console.log("Registering");
  // Error Checking
  if( !req.body.hasAttribute("password") || !req.body.hasAttribute("email") || !req.body.hasAttribute("password")
    || !req.body.hasAttribute("fullName"))


  // Password Hashing and Database Entry Creation
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      res.status(400).json({success : false, message : err.errmsg});
    }
    else {
      let newUser = new User({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: hash
      });

      newUser.save(function(err, user) {
        if (err) {
          res.status(400).json({success: false,
            message: err.errmsg});
        }
        else {
          res.status(201).json({success: true,
            message: user.fullName + " has been created."});
        }
      });
    }
  });

  //FIXME: Create jwt and put in local storage?
  console.log("Finished registering");
});

// Account Information and Editing
router.get('/profile', function(req, res, next) {
  res.render('profile.njk', { title: 'Express' });
});


router.post('/register', function(req, res, next) {
  res.render('register.njk', { title: 'Express' });
});


//Signing in
router.post("/login", function(req, res){
  User.findOne({email: req.body.email}, function(err, user){
    if(err){
      res.status(401).json({success: false, message: "Unknown database error"});
    }
    else if(!user) {
      res.status(401).json({success: false, message: "Invalid email or password"});
    }
    else{
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid){
        if(err){
          res.status(401).json({success: false, message: "Unknown authentication error"});
        }
        else if(valid){
          //TODO: Create auth token and put in local storage
          res.status(201).json({success: true, message: "Authenticated"});
        }
        else{
          res.status(401).json({success: false, message: "Invalid email or password"});
        }
      })
    }
  })
})

module.exports = router;
