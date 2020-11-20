function getStatisticsRequest(deviceID){
    $.ajax({
        url: '/health/getStatistics',
        type: 'GET',
        data: ({deviceID: deviceID}),
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
    })  .done(getStatsSuccess)
        .fail(getStatsFailure);
}

function getStatsSuccess(data, textStatus, jqXHR){

    for (let statistic of data.statistics) {
        let rowString = $(
            '<tr>\n' +
            ' <td class="dateTime">[Timestamp]</td>' +
            ' <td class="heartRate">[Timestamp]</td>' +
            ' <td class="bloodOxygen">[Timestamp]</td>' +
            ' <td class="deviceID">[Timestamp]</td>' +
            '</tr>');

        rowString.find('.dateTime').text(statistic.measureTime);
        rowString.find('.heartRate').text(statistic.heartRate);
        rowString.find('.bloodOxygen').text(statistic.bloodOxygen);
        rowString.find('.deviceID').text(statistic.deviceID);

        $("tbody").append(rowString);
    }
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
    for(let device of data) {
        getStatisticsRequest(device.deviceID);
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