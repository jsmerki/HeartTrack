# 513FinalProject

Link to our Webserver: kevinkasper.net

# DOCUMENTATION FOR ENDPOINTS:


## DATA.JS

### /health/getStatistics

Description: POST -> Get all measurements for a certain device

#### Usage

$.ajax({
url: https://kevinkasper.net/health/getStatistics,
type: GET,
data: {  
         deviceID: "deviceID"
       },
headers: { 'x-auth' : Valid Auth Token },
dataType: 'json'
});

#### Successful Response:

STATUS CODE: 200
{
    statistics: Array of Statistic entries
}


#### Possible Error Responses:

Missing Headers:
STATUS CODE: 400
{
    success: false,
    message: "Auth token not provided."
}

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}

Invalid Auth-Token:
STATUS CODE: 401
{
    success: false,
    message: "Invalid authentication token."
}


### /health/measurement

Description: POST -> Add a measurement to the Statistics collections

#### Usage

$.ajax({
url: https://kevinkasper.net/health/measurement,
type: POST,
contentType: 'application/json',
data: {  
         devideID: "deviceID",
         APIKey: "APIKey",
         avgBPM: bpmMeasurement,
         spo2: spo2Measurement,
         published_at: Date.now() 
       },
dataType: 'json'
});

### Successful Response:

STATUS CODE: 200
{
    recorded: true,
    message: "New entry of : " + req.body.avgBPM + " BPM and " + req.body.spo2 +
                         " %O2 added at" + req.body.published_at + " !",
    avgBPM: Measured BPM Value
}

#### Possible Error Responses:

No Device ID:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing device ID"
    avgBPM: -1.0
}

No API Key:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing device API Key"
    avgBPM: -1.0
}

No BPM Measurement:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing heart rate measurement"
    avgBPM: -1.0
}

No spo2 Measurement:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing oxygenation measurement"
    avgBPM: -1.0
}

Database Errors:
STATUS CODE: 400
{
    success: false, 
    message: "Unknown database error"
}

Non-Registered Device Error:
{
    success: false, 
    message: "Device does not exist in database"
}

Invalid API Key Errors:
STATUS CODE: 401
{
    recorded: false,
    message: "Invalid API for device",
    avgBPM: -1.0
}

}

## DEVICES.JS

### /device/add

Description: POST -> Add a device to the Devices collection and update User with new device

#### Usage

$.ajax({
        url: 'https://kevinkasper.net/device/add',
        type: 'POST',
        contentType: 'application/json',
        headers: { 'x-auth' : Valid Auth Token },
        data: {friendlyName: friendlyName, 
               deviceID: deviceID},
        dataType: 'json'
});
    
#### Successful Response:

STATUS CODE: 201
{
    registeredToDb: true,
    registeredToUser: true,
    APIKey: Newly Created API Key,
    deviceID: Registered Device ID,
    message = "Device " + Registered Device ID + " has been successfully registered."
}

#### Possible Error Codes:  
  
Missing Device ID:
STATUS CODE: 400
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = "Missing Device ID"
}

Missing Friendly Name:
STATUS CODE: 400
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = "Missing device's Friendly Name"
}

No Auth Token:
STATUS CODE: 400
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = "Auth Token Not Provided"
}

Invalid Auth Token:
STATUS CODE: 401
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = "Invalid authentication token"
}

Device Already Registered:
STATUS CODE: 400
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = "Device " + req.body.deviceID + " is already registered."
}

Database Error:
STATUS CODE: 400
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = "Unknown Database Error"
}

Device Save Error:
STATUS CODE: 400
{
    registeredToDb: false,
    registeredToUser: false,
    APIKey: "none",
    deviceID: "none",
    message = Error Message From Save Call
}

### /device/measurement

Description: POST -> Add a measurement to the array of measurements for a Device document
NOTE: Accessed via Particle Webhook Integration, data sent from Particle devices
Endpoint: https://kevinkasper.net/device/measurement

#### Usage

JSON Data from Particle Device:
          
{
    "deviceID": "{{PARTICLE_DEVICE_ID}}",
    "APIKey": "{{apiKey}}",
    "avgBPM": "{{avgbpm}}",
    "spo2": "{{spo2}}",
    "published_at": "{{PARTICLE_PUBLISHED_AT}}"
}

#### Successful Response:

STATUS CODE: 201
{
    recorded: true,
    message:  resJSON.message = "New entry of : " + req.body.avgBPM + " BPM and " + req.body.spo2 + " %O2 added!";
    avgBPM: req.body.avgBPM
}

#### Possible Error Codes:

Missing Device ID:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing device ID",
    avgBPM: -1.0,
}

Missing Device API Key:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing device API Key",
    avgBPM: -1.0,
}

Missing Heart Rate:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing heart rate measurement",
    avgBPM: -1.0,
}

Missing Oxygenation:
STATUS CODE: 400
{
    recorded: false,
    message: "Missing oxygenation measurement",
    avgBPM: -1.0,
}

Database Error:
STATUS CODE: 400
{
    recorded: false,
    message: "Unknown database error",
    avgBPM: -1.0,
}

Device Not Registered:
STATUS CODE: 400
{
    recorded: false,
    message: "Device does not exist in database",
    avgBPM: -1.0,
}

Invalid API Key:
STATUS CODE: 401
{
    recorded: false,
    message: "Invalid API for device",
    avgBPM: -1.0,
}

### /device/key

Description: POST -> Use the PArticle cloud to send an API key to a newly registered device

#### Usage

$.ajax({
        url: 'https://kevinkasper.net/device/key',
        type: 'POST',
        contentType: 'application/json',
        headers: {'x-auth': Valid Auth Token},
        data: {deviceID: New Device ID, 
                APIKey: New API Key}),
        dataType: 'json'
});

#### Successful Response:

STATUS CODE: 200
{
    keyset: true,
    message: "API Key set for new device ID: " + req.body.deviceID,
}

#### Possible Error Responses:

Missing Device ID:
STATUS CODE: 400
{
    keyset: false,
    message: "Missing device ID",
}

Missing API Key to Set:
STATUS CODE: 400
{
    keyset: false,
    message: "Missing device API key",
}

Error With Particle Cloud Function:
STATUS CODE: 400
{
    keyset: false,
    message: "Could not call function",
}

Could not Log in to Particle Cloud:
STATUS CODE: 401
{
    keyset: false,
    message: "Could not log in to Particle",
}

### /device/list

Description: GET -> Get a user's array of Device documents

#### Usage

$.ajax({
        url: '/device/list',
        type: 'GET',
        headers: { 'x-auth' : Valid Auth Token },
        dataType: 'json'
})

#### Successful Response:

STATUS CODE: 200
return: .json([Device])

#### Possible Error Responses:

Missing Authentication Token:
STATUS CODE: 400
{
    success: false,
    message: "Auth token not provided."
}

Invalid Authentication Token:
STATUS CODE: 401
{
    success: false,
    message: "Invalid authentication token."
}

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}
    
### /device/getOne

Description: GET -> Get all information on a single Device document

#### Usage

$.ajax({
        url: '/device/getOne',
        type: 'GET',
        headers: { 'x-auth' : Valid Auth Token },
        dataType: 'json'
})

#### Successful Response:

STATUS CODE: 200
{
        deviceID: device.deviceID,
        APIKey: device.APIKey,
        friendlyName: device.friendlyName,
        ownerEmail: device.ownerEmail,
        dateRegistered: device.dateRegistered,
        lastRead: device.lastRead,
        measureInterval: device.measureInterval,
        startTimeHour: device.startTimeHour,
        startTimeMin: device.startTimeMin,
        endTimeHour: device.endTimeHour,
        endTimeMin: device.endTimeMin
}

#### Possible Error Responses:

Missing Device ID:
STATUS CODE: 400
{
    success: false,
    message: "Missing device ID"
}

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}


### /device/edit

Description: POST -> Edit the Measurement Window and Frequency values of a Device via Particle cloud functions

#### Usage

$.ajax({
    url: '/device/edit',
    type: 'POST',
    contentType: 'application/json',
    headers: { 'x-auth' : Valid Auth Token },
    data: {
              deviceID: deviceID,
              friendlyName: friendlyName,
              measureInterval: measureInterval,
              startTimeHour: startTimeHour,
              endTimeHour: endTimeHour,
              startTimeMin: startTimeMin,
              endTimeMin: endTimeMin,
          },
    dataType: 'json'
}

#### Successful Response:

STATUS CODE: 201
{
    success: true,
    message: "Successfully edited device."
}

#### Possible Error Responses:

Missing Device ID:
STATUS CODE: 400
{
    success: false,
    message: "Missing device ID."
}

Missing Friendly Name:
STATUS CODE: 400
{
    success: false,
    message: "Missing device friendly name."
}

Missing Measurement Interval:
STATUS CODE: 400
{
    success: false,
    message: "Missing measure interval."
}

Missing Window Start Hour:
STATUS CODE: 400
{
    success: false,
    message: "Missing start time hour."
}

Missing Window Start Minute:
STATUS CODE: 400
{
    success: false,
    message: "Missing start time minutes."
}

Missing Window End Hour:
STATUS CODE: 400
{
    success: false,
    message: "Missing end time hour."
}

Missing Window End Minute:
STATUS CODE: 400
{
    success: false,
    message: "Missing end time minutes."
}

Missing Authentication Token:
STATUS CODE: 400
{
    success: false,
    message: "Auth token not provided."
}

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}

Device ID Not Belonging to User:
STATUS CODE: 400
{
    success: false,
    message: "Device does not belong to user."
}

Invalid Authentication Token:
STATUS CODE: 401
{
    success: false,
    message: "Invalid authentication token."
}


### /device/remove

Description: POST -> Remove a Device from the database

####Usage

$.ajax({
    url: '/device/remove',
    type: 'POST',
    contentType: 'application/json',
    headers: { 'x-auth' : Valid Auth Token },
    data: {deviceID: deviceID},
    dataType: 'json'
})

#### Successful Response:
STATUS CODE: 201
{
    success: true,
    message: "Removed device."
}

#### Possible Error Responses:

Missing Device ID:
STATUS CODE: 400
{
    success: false,
    message: "Missing device ID."
}

Missing Authentication Token:
STATUS CODE: 400
{
    success: false,
    message: "Auth token not provided."
}

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}

Device Does Not Exist:
STATUS CODE: 400
{
    success: false,
    message: "Device not found in database."
}

Invalid Authentication Token:
STATUS CODE: 401
{
    success: false,
    message: "Invalid authentication token."
}

##USER.JS

### /user/
Description: GET -> Navigate to login.njk

### /user/login
Description: GET -> Navigate to login.njk

### /user/login

Description: POST -> Attempt to login a user with given credentials

####Usage

$.ajax({
    url: '/user/login',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({email:email, password:password}),
    dataType: 'json'
})

#### Successful Response:

STATUS CODE: 201
{
    success: true,
    jwt: New Auth Token,
    message: "Authenticated"
}

#### Possible Error Responses:

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}

Invalid Login Info OR User Not in Database:
STATUS CODE: 401
{
    success: false,
    message: "Invalid email or password"
}

bcrypt Authentication Error:
STATUS CODE: 401
{
    success: false,
    message: "Unknown authentication error"
}

### /user/logout
 
Description: GET -> Navigate to logout.njk

### /user/register

Description: GET -> Navigate to register.njk

### /user/register

Description: POST -> Register new User document in the database

#### Usage

$.ajax({
    url: '/user/register',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({email: email.val(), fullName: fullName.val(), password: password.val()}),
    dataType: 'json'
}

#### Successful Response:

STATUS CODE: 201
{
    success: true,
    message: New User Name + " has been created."
}

#### Possible Error Responses:

Missing User Email, Password, or Full Name:
STATUS CODE: 400
{
    success: false,
    message: "Missing required data."
}

bcrypt Hash Error:
STATUS CODE: 400
{
    success: false,
    message: bcrypt Error Message
}

Database Save Error:
STATUS CODE: 400
{
    success: false,
    message: Database Error Message
}

### /user/register

Description: POST -> Return back to register.njk

### /user/profile

Description: GET -> Navigate to profile.njk

### /user/profile/edit

Description: GET -> Navigate to edit.njk

### /user/profile/edit

Description: POST -> Edit a user's profile information

#### Usage

$.ajax({
    url: '/user/profile/edit',
    type: 'POST',
    contentType: 'application/json',
    headers: { 'x-auth' : Valid Auth Token },
    data: {fullName: fullName,
            password: password},
    dataType: 'json',
}

#### Successful Response:

STATUS CODE: 201
{
    success: true,
    message: New User Full Name + " has been created."
}

#### Possible Error Responses:

Missing Full Name:
STATUS CODE: 400
{
    success: true,
    message: "Missing Full Name field."
}

Missing Password:
STATUS CODE: 400
{
    success: true,
    message: "Missing password data."
}

Missing Auth Token:
STATUS CODE: 400
{
    success: true,
    message: "Auth token not provided."
}

bcrypt Hash Error:
STATUS CODE: 400
{
    success: false,
    message: bcrypt Error Message
}

Database Find Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}

Database Save Error:
STATUS CODE: 400
{
    success: false,
    message: Database Error Message
}

Invalid Auth Token:
STATUS CODE: 401
{
    success: false,
    message: "Invalid authentication token."
}

### /user/account

Description: GET -> Retrieve all user information to show in profile

####Usage

$.ajax({
        url: '/user/account',
        type: 'GET',
        headers: { 'x-auth' : Valid Auth Token },
        dataType: 'json'
})

#### Successful Response

STATUS CODE: 200
{
    success: true,
    email: user.email,
    fullName: user.fullName,
    lastAccess: user.lastAccess,
    devices: user.userDevices
}

#### Possible Error Responses

Missing Auth Token:
STATUS CODE: 400
{
    success: false,
    message: "Auth token not provided."
}

Invalid Authentication Token:
STATUS CODE: 401
{
    success: false,
    message: "Invalid authentication token."
}

Database Error:
STATUS CODE: 400
{
    success: false,
    message: "Unknown database error"
}

## INDEX.JS

### /index/
Description: GET -> Navigate to index.njk

### /index/.well-known/acme-challenge/QY_IaT16z5QCwHeAbHWRu-aB2zMx-k9E2Hsk8DEUGcg
Description: GET -> Navigate to code.njk

## HTTPS Usage:
Note that this app utilizes certbot to generate secure SSL certificates. 


