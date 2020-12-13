let express = require('express');
let router = express.Router();
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");
let fs = require('fs');
let User = require('../models/user');

let jwtSecretKey = "Bsd8-fn35sN2sj4dbv/43sDKvbsd8jvbs9KD"


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login.njk', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.njk', { title: 'Express' });
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
          let authToken = jwt.encode({email: req.body.email}, jwtSecretKey);
          res.status(201).json({success: true, jwt: authToken, message: "Authenticated"});
        }
        else{
          res.status(401).json({success: false, message: "Invalid email or password"});
        }
      })
    }
  })
})

router.get('/logout', function(req, res, next) {
  res.render('logout.njk', { title: 'Express' });
});

/* Account Creation Form & Posting Endpoint */
router.get('/register', function(req, res, next) {
  res.render('register.njk', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
  // Error Checking
  if( !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("email")
    || !req.body.hasOwnProperty("fullName")){
    return res.status(400).json({success : false, message : "Missing required data."})
  }


  // Password Hashing and Database Entry Creation
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      console.log("Hash: " + err.errmsg);
      return res.status(400).json({success : false, message : err.errmsg});

    }
    else {
      let newUser = new User({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: hash
      });

      newUser.save(function(err, user) {
        if (err) {
          console.log("Save: " + err.errmsg);
          return res.status(400).json({success: false,
            message: err.errmsg});

        }
        else {
          return res.status(201).json({success: true,
            message: user.fullName + " has been created."});
        }
      });
    }
  });

  //FIXME: Create jwt and put in local storage?
  console.log("Finished registering");
});

router.post('/register', function(req, res, next) {
  res.render('register.njk', { title: 'Express' });
});


// Account Information and Editing
router.get('/profile', function(req, res, next) {
  res.render('profile.njk', { title: 'Express' });
});

// Account Editing Page
router.get('/profile/edit', function(req, res, next) {
  res.render('edit.njk', { title: 'Express' });
});

// Account Edit Processing
router.post('/profile/edit', function(req, res, next) {

  //Error checking, confirm ID
  if(!req.body.hasOwnProperty("fullName") || (req.body.fullName.length < 1)){
    resJSON.message = "Missing Full Name field.";
    return res.status(400).json(resJSON);
  }

  //Use friendlyName in request
  if(!req.body.hasOwnProperty("password")){
    resJSON.message = "Missing password data.";
    return res.status(400).json(resJSON);
  }

  let noPassUpdate = false;
  if ( req.body.password.length < 1) {
    noPassUpdate = true;
  }
  // Password Hashing and Database Entry Creation
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      console.log("Hash: " + err.errmsg);
      return res.status(400).json({success: false, message: err.errmsg});
    }
    else {

      if (!req.headers["x-auth"]) {
        return res.status(400).json({success: false, message: "Auth token not provided."});
      }
      else {

        let token = req.headers["x-auth"];

        try {
          let decToken = jwt.decode(token, jwtSecretKey);
          User.findOne({email: decToken.email}, function (err, user) {
            if (err) {
              res.status(400).json({success: false, message: "Unknown database error"});
            } else {
              user.fullName = req.body.fullName;
              if(!noPassUpdate) {
                user.password = hash;
              }
            }
            user.save(function(err, user) {
              if (err) {
                console.log("Save: " + err.errmsg);
                return res.status(400).json({success: false,
                  message: err.errmsg});

              }
              else {
                return res.status(201).json({success: true,
                  message: user.fullName + " has been created."});
              }
            })
          })
        } catch (exc) {
          return res.status(401).json({success: false, message: "Invalid authentication token."});
        }
      }
    }
  });

});

//Get account info to display on profile.njk
router.get('/account', function(req, res, next){

  if(!req.headers["x-auth"]){
    return res.status(400).json({success: false, message: "Auth token not provided."});
  }
  else{

    let token = req.headers["x-auth"];
    let userInfo = {};

    try{
        let decToken = jwt.decode(token, jwtSecretKey);
        User.findOne({email: decToken.email}, function(err, user){
          if(err){
            res.status(400).json({success: false, message: "Unknown database error"});
          }
          else{
            userInfo["success"] = true;
            userInfo["email"] = user.email;
            userInfo["fullName"] = user.fullName;
            userInfo["lastAccess"] = user.lastAccess;
            userInfo["devices"] = user.userDevices;
          }

          return res.status(200).json(userInfo);
        })
    } catch (exc){
      return res.status(401).json({ success: false, message: "Invalid authentication token."});
    }
  }
})

module.exports = router;
