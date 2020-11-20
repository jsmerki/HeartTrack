let express = require('express');
let router = express.Router();
let plotly = require('plotly');
let Statistic = require('../models/statistic');

let jwt = require("jwt-simple");
let jwtSecretKey = "Bsd8-fn35sN2sj4dbv/43sDKvbsd8jvbs9KD"

/* GET health page. */
router.get('/', function(req, res, next) {
  res.render('visualization.njk', { title: 'Express' });
});


router.get('/getStatistics', function(req, res, next) {

  if(!req.headers["x-auth"]){
    return res.status(400).json({success: false, message: "Auth token not provided."});
  }
  else{


    let token = req.headers["x-auth"];
    try{
      let decToken = jwt.decode(token, jwtSecretKey);

      // Find statistics by deviceID
      Statistic.find({deviceID: req.query.deviceID}, function(err, stats){
        if(err){
          res.status(400).json({success: false, message: "Unknown database error"});
        }
        else{

          return res.status(200).json({statistics: stats});
        }
      })

    } catch (exc){
      return res.status(401).json({ success: false, message: "Invalid authentication token."});
    }
  }
});


//Add measurement to posting device's array of measurements
router.post('/measurement', function(req, res, next){

  let resJSON = {
    recorded: false,
    message: "",
    avgBPM: -1.0,
    spo2: 0,
    timestamp: {}
  };

  //Check that all necessary info for measurements is present
  if(!req.body.hasOwnProperty("deviceID")){
    resJSON.message = "Missing device ID";
    return res.status(400).json(resJSON);
  }

  if(!req.body.hasOwnProperty("APIKey")){
    resJSON.message = "Missing device API Key";
    return res.status(400).json(resJSON);
  }
  if(!req.body.hasOwnProperty("avgBPM")){
    resJSON.message = "Missing heart rate measurement";
    return res.status(400).json(resJSON);
  }
  if(!req.body.hasOwnProperty("spo2")){
    resJSON.message = "Missing oxygenation measurement";
    return res.status(400).json(resJSON);
  }
  if(!req.body.hasOwnProperty("published_at")){
    resJSON.message = "Missing timestamp.";
    return res.status(400).json(resJSON);
  }

  //Find device and add heart rate measurement to readings array
  Device.findOne({deviceID: req.body.deviceID}, function(err, device){
    if(err){
      return res.status(400).json({success: false, message: "Unknown database error"});
    }
    else if(device == null){
      return res.status(400).json({success: false, message: "Device does not exist in database"});
    }
    else{
      //Verify matching API key
      if(device.APIKey !== req.body.APIKey){
        resJSON.message = "Invalid API for device";
        return res.status(401).json(resJSON);
      }
      else{

        let measurement = new Statistic( {
          deviceID: req.body.deviceID,
          heartRate: req.body.avgBPM,
          bloodOxygen: req.body.spo2,
          measureTime: req.body.published_at
        })

        //Add statistic to array for device
        device.readings.push(measurement);
        device.save(function(err, device){
          console.log("Data saved to device with deviceID: " + req.body.deviceID);
        });

        measurement.save(function (err, measurement) {
          console.log("New Measurement Saved. ID: " + measurement._id);
        });

        resJSON.recorded = true;
        resJSON.message = "New entry of : " + req.body.avgBPM + " BPM and " + req.body.spo2 +
            " %O2 added at" + req.body.published_at + " !";

        resJSON.avgBPM = req.body.avgBPM;
        resJSON.spo2 = -1.0;
        resJSON.timestamp=  -1.0;

        return res.status(200).json(resJSON);
      }
    }
  });

});



module.exports = router;
