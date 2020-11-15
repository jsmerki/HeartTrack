var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");
let fs = require('fs');
let Device = require('../models/device');

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
router.post("add", function(req, res, next){
    let ownerEmail = "";
    let resJSON = {
        registered: true,
        message: "",
        APIKey: "none",
        deviceID: "none"
    };

    //Error checking, confirm ID
    if(!req.body.hasAttribute("deviceID")){
        resJSON.message = "Missing device ID";
        return res.status(400).json(resJSON);
    }

    //Use email from auth token if provided, else use email in request
    //FIXME: Will we use jwt, and if so what's secret?
    if(!req.body.hasAttribute("email")){
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

            //Create new Device to save
            let newDevice = new Device({
                deviceID: req.body.deviceID,
                APIKey: newKey
            });

            //Save Device
            newDevice.save(function(err, newDevice){
                if(err){
                    resJSON.message = err;
                    return res.status(400).json(resJSON);
                }
                else{
                    resJSON.registered = true;
                    resJSON.APIKey = newKey;
                    resJSON.deviceID = req.body.deviceID;
                    resJSON.message = "Device " + req.body.deviceID + " has been successfully registered.";
                    return res.status(201).json(resJSON);
                }
            })
        }
    });

});