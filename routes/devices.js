var express = require('express');
var router = express.Router();
let Device = require('../models/device');
let User = require('../models/user');


//Generate random API key
function getNewApikey() {
    let newApikey = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 32; i++) {
        newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return newApikey;
}

//Add new device
router.post('/add', function(req, res, next){

    let resJSON = {
        registeredToDb: false,
        registeredToUser: false,
        message: "",
        APIKey: "none",
        deviceID: "none"
    };

    //Error checking, confirm ID
    if(!req.body.hasOwnProperty("deviceID")){
        resJSON.message = "Missing device ID";
        return res.status(400).json(resJSON);
    }

    //Use email in request
    if(!req.body.hasOwnProperty("email")){
        resJSON.message = "Missing device owner's email";
        return res.status(400).json(resJSON);
    }

    Device.findOne({deviceID: req.body.deviceID}, function(err, device){
        //If device already exists return an error
        if(device !== null){
           resJSON.message = "Device " + req.body.deviceID + " is already registered.";
           return res.status(400).json(resJSON);
        }
        else{
            let newKey = getNewApikey();

            //Find user with email and add ID string to array
            User.findOne({email: req.body.email}, function(err, user){
                //Not going to check for null user right now, if logged user should exist
                if(err){
                    return res.status(400).json({success: false, message: "Unknown database error"});
                }
                user.userDevices.push(req.body.deviceID);
                user.save(function(err, user){
                    console.log("New Device ID: " + req.body.deviceID + " added to user " + user.email);
                });

                resJSON.registeredToUser = true;
            })

            //Create new Device to save
            let newDevice = new Device({
                deviceID: req.body.deviceID,
                APIKey: newKey,
                ownerEmail: req.body.email
            });

            //Save Device
            newDevice.save(function(err, newDevice){
                if(err){
                    resJSON.message = err;
                    return res.status(400).json(resJSON);
                }
                else{
                    resJSON.registeredToDb = true;
                    resJSON.APIKey = newKey;
                    resJSON.deviceID = newDevice.deviceID;
                    resJSON.message = "Device " + req.body.deviceID + " has been successfully registered.";
                    return res.status(201).json(resJSON);
                }
            })
        }
    });

});

router.post('/measurement', function(req, eres, next){

    let resJSON = {
        recorded: false,
        message: "",
        avgBPM: -1.0,
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

    //Find device and add heart rate measurement to readings array
    Device.findOne({deviceID: req.body.deviceID}, function(err, device){
        if(err){
            return res.status(400).json({success: false, message: "Unknown database error"});
        }
        else{
            //Verify matching API key
            if(device.APIKey !== req.body.APIKey){
                resJSON.message = "Invalid API for device";
                return res.status(401).json(resJSON);
            }
            else{
                //Add reading to array for device
                device.readings.push(req.body.avgBPM);
                device.save(function(err, device){
                    console.log("New entry of : " + req.body.avgBPM + " BPM added!");
                });

                resJSON.recorded = true;
                resJSON.message = "New entry of : " + req.body.avgBPM + " BPM added!";
                resJSON.avgBPM = req.body.avgBPM;

                return res.status(200).json(resJSON);
            }
        }
    });

});


module.exports = router;