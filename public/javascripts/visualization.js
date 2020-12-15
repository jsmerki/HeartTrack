let currentDeviceName = "";
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function subtractDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

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
    let currentDay = new Date();
    let oneWeekms = 1000 * 3600 * 24 * 7;

    let lastSevenDaysStats = [];

    for (let statistic of data.statistics) {
        let measureTime = new Date(statistic.measureTime);
        if((currentDay - measureTime) < oneWeekms)
        {
            lastSevenDaysStats.push(statistic);
        }
    }

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

    $("tbody").append(rowString);

    let separatedData = getEachDayData(currentDay, lastSevenDaysStats);

    plotDailies(currentDay, separatedData);


}

function plotDailies(currentDay, dailiesData) {
    console.log('Dailies data: ');
    console.dir(dailiesData);
    console.log('--------------');
    for (let i = 0; i < 7; i++) {
        let graphsString = '<div class="row text-center mb-4 mt-4">';
        // Get the day of the week by getting the day (0 - 6) of the first statistic
        // Since we have statistic data and it's grouped by day, we take the first stat
        // and find the weekday corresponding.
        let dayOfTheWeek = subtractDays(currentDay,i);
        graphsString = graphsString + '<h3 class="m-auto">' + weekday[dayOfTheWeek.getDay()] + '</h3></div><div class="row text-center mb-4 mt-4">';

        // For each day in the past seven days
        // If a given day has statistic data
        let dayData = dailiesData[i];

        if(dayData.length > 0) {
            console.log(i);
            let heartPlot = "";
            let oxyPlot = "";

            let hour;

            let timeData = [];
            let heartData = [];
            let oxyData = [];
            for (let statistic of dayData) {
                let dateSplit = statistic.measureTime.toLocaleString().split(", ");

                //Replace slashes with dashes and get time
                let day = dateSplit[0].split("/");
                let time = dateSplit[1].split(" ")[0];

                let dayReconstructed = day[2] + "-" + day[0] + "-" + day[1];
                if(dateSplit[1].split(" ")[1] === "PM"){
                    //After 12PM add 12 to the hour
                    time = time.replace(statistic.measureTime.getHours() - 12, statistic.measureTime.getHours());
                }
                else{
                    //Prepend hour with 0 if before 12PM
                    time = time.replace(statistic.measureTime.getHours(), "0" + statistic.measureTime.getHours());
                }

                let dateString = dayReconstructed + " " + time;

                timeData.push(dateString);
                heartData.push(statistic.heartRate);
                oxyData.push(statistic.bloodOxygen);
            }


            let heartDivString = "heart"+i;
            graphsString = graphsString + '<div id="' + heartDivString + '" class="col-md-6 text-center mb-4 mt-4"></div>';
            var heartTrace = [{
                x: timeData,
                y: heartData,
                mode: 'markers',
                type: 'scatter'
            }];


            let oxyDivString = "oxy"+i;
            graphsString = graphsString + '<div id="' + oxyDivString + '" class="col-md-6 text-center mb-4 mt-4"></div>';

            var oxyTrace = [{
                x: timeData,
                y: oxyData,
                mode: 'markers',
                type: 'scatter'
            }];

            graphsString = graphsString + '</div>';
            $(".graphHolder").append(graphsString);

            Plotly.newPlot(heartDivString, heartTrace);
            Plotly.newPlot(oxyDivString, oxyTrace);
        }
        else {
            graphsString = graphsString + '<h5 class="m-auto">No data recorded.</h5>';
            graphsString = graphsString + '</div>';
            $(".graphHolder").append(graphsString);
        }
    }

}




function getEachDayData(currentDate, lastSevenDaysStats){
    currentDate = currentDate.setHours(0,0,0,1);

    let pastSevenDays = [];
    let dayAnalyzing = currentDate;
    let dayAfterDayAnalyzing = addDays(currentDate,1);
    let dailyData = [];
    for(let i=0; i<7; i++)
    {
        dailyData =[]
        dayAnalyzing = subtractDays(currentDate, i);
        for(let statistic of lastSevenDaysStats)
        {
            statistic.measureTime = new Date(statistic.measureTime);
            // console.log(dayAnalyzing + " < " + statistic.measureTime + " < " + dayAfterDayAnalyzing + ": " + ((statistic.measureTime < dayAfterDayAnalyzing) && (statistic.measureTime > dayAnalyzing)));
            if((statistic.measureTime <= dayAfterDayAnalyzing) && (statistic.measureTime > dayAnalyzing))
            {
                dailyData.push(statistic);
            }
        }

        pastSevenDays.push(dailyData);
        dayAfterDayAnalyzing = subtractDays(currentDate, i);
    }

    return pastSevenDays;
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
