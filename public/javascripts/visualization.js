let currentDeviceName = "";
function getStatisticsRequest(deviceID, deviceName){
    currentDeviceName = deviceName;
    $.ajax({
        url: '/health/getStatistics',
        type: 'GET',
        data: ({deviceID: deviceID}),
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
    })  .done(getStatsSuccess)
        .fail(getStatsFailure);
}

function getStatsSuccess(data, textStatus, jqXHR, deviceName){
    let minHeartRate = 0;
    let avgHeartRate = 0;
    let maxHeartRate = 0;
    console.log(data.statistics);
    let currentDay = new Date();
    let oneWeekms = 1000 * 3600 * 24 * 7;

    let lastSevenDaysStats = {};


    for (let statistic of data.statistics) {
        let measureTime = new Date(statistic.measureTime);
        if((currentDay - measureTime) < oneWeekms)
        {
            lastSevenDaysStats.append(statistic);
        }
    }

    console.log(lastSevenDaysStats);
    minHeartRate = lastSevenDaysStats[0].heartRate;
    maxHeartRate = lastSevenDaysStats[0].heartRate;

    for (let statistic of lastSevenDaysStats) {

        avgHeartRate = avgHeartRate + statistic.heartRate;
        if(statistic.heartRate > maxHeartRate) {
            maxHeartRate = statistic.heartRate;
        }
        if(statistic.heartRate < minHeartRate) {
            minHeartRate = statistic.heartRate;
        }
    }

    if((lastSevenDaysStats.length) > 0)
    {
        avgHeartRate = avgHeartRate / (lastSevenDaysStats.length);
    }
    else
    {
        minHeartRate = '-';
        avgHeartRate = '-';
        maxHeartRate = '-';
    }

    let rowString = $(
        '<tr>\n' +
        ' <td class="friendlyName">[Timestamp]</td>' +
        ' <td class="minHeartRate">[Timestamp]</td>' +
        ' <td class="avgHeartRate">[Timestamp]</td>' +
        ' <td class="maxHeartRate">[Timestamp]</td>' +
        '</tr>');
    rowString.find('.friendlyName').text(currentDeviceName);
    rowString.find('.minHeartRate').text(minHeartRate);
    rowString.find('.avgHeartRate').text(avgHeartRate);
    rowString.find('.maxHeartRate').text(maxHeartRate);

    // for (let statistic of data.statistics) {
    //
	// let timestamp = new Date(statistic.measureTime);
	// let dateString = timestamp.toLocaleDateString('en-US', {timeZone: 'America/Phoenix'});
	// let timeString = timestamp.toLocaleTimeString('en-US', {timeZone: 'America/Phoenix'});
    //
    //
    //     $("tbody").append(rowString);
    // }

    $("tbody").append(rowString);
    console.log("fetched data");
}

function getStatsFailure(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken
    // redirect user to sign-in page (which is index.html)
    // if (jqXHR.status == 401) {
    //     window.localStorage.removeItem("authToken");
    //     window.location = '/user/login';
    // }
    console.log("failed");
    $("tbody").append('<tr><td><h4>No measurements taken yet!</h4></td></tr>');
}

// Request user's list of devices
function getDevices(){
    $.ajax({
        url: '/device/list',
        type: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
    })  .done(getDevicesSuccess)
        .fail(getDevicesFailure);
}

function getDevicesSuccess(data, textStatus, jqXHR){
    console.log(data);
    for(let device of data) {
        getStatisticsRequest(device.deviceID,device.friendlyName);
        console.log("Device found, requesting statistic.");
    }

}

function getDevicesFailure(jqXHR, textStatus, errorThrown){
    // $("#deviceCreationErrorResponse").text(jqXHR.responseJSON.message);
    // $("#deviceCreationErrorResponse").show();
    console.log("Failed to get devices.");
}


//Add click listener for add device button
$().ready(function(){

    //If no auth token return to login page
    if(!window.localStorage.getItem("authToken")){
        window.location = "/user/login";
    }
    else{
        getDevices();
        console.log('Authed');
    }
})
