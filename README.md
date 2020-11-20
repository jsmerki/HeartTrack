# 513FinalProject

DOCUMENTATION FOR MEASUREMENT ENDPOINT:
---------------------------------------

Description:
---------------------------------------
The measurement endpoint /device/measurement stores heart rate and blood oxygenation readings
from a device so long as it's device ID and API Key match records in the server database
and both measurements are present. The database model requires a time stamp of when the 
measurement was submitted which is why the published_at attribute of the ajax call's
data SHOULD BE INITIALIZED WITH Date.now(). After measurements are stored they will be
retrieved in a separate endpoint in order to display them to the user.

Usage:
---------------------------------------
$.ajax({
url: https://3.129.203.46:3000/health/measurement,
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

Successful Response:
---------------------------------------
STATUS CODE: 200
{
    recorded: true,
    message: "{published_at}: New entry of : {avgBPM} BPM and {spo2} %O2 added!"
    avgBPM: {avgBPM}
}

Possible Error Responses:
---------------------------------------
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


