function getAccountInfoRequest(){
    $.ajax({
        url: '/user/account',
        type: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
    })  .done(getInfoSuccess)
        .fail(getInfoFailure);
}

function getInfoSuccess(data, textStatus, jqXHR){
    $("#userEmail").text(data.email);
    $("#fullName").text(data.fullName);
    $("#lastAccess").text(data.lastAccess);

    let devicesDisplay = $("#userDevicesDisplay")

    if(data.devices.length > 0){
        $("#noDevices").hide();
        for(let deviceID of data.devices){
            devicesDisplay.append("<li>Device ID: " + deviceID +  "<button id='ping-" + deviceID +
                "' class='btn btn btn-primary'>PING</button>" + "</li>")

            $("#ping-" + deviceID).click(function(event){
                pingDevice(event, deviceID);
            })
        }
    }

}

function getInfoFailure(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken
    // redirect user to sign-in page (which is index.html)
    if (jqXHR.status == 401) {
        window.localStorage.removeItem("authToken");
        window.location = '/user/login';
    }
}


function showAddDeviceForm(){
    $("#addDeviceForm").hide();
    $("#deviceInput").show();
}

function addNewDeviceRequest(){
    let email = $("#userEmail").text();
    let deviceID = $("#deviceID").val();

    $.ajax({
        url: '/device/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({email:email, deviceID: deviceID}),
        dataType: 'json'
    })
        .done(newDeviceSuccess)
        .fail(newDeviceError);

}

function newDeviceSuccess(data, textStatus, jqXHR){
    //Reload page to show newly added device
    window.location = "/user/profile"
    console.log("You did it!");


    //Give API key to newly registered device
    //FIXME: Add listeners
    $.ajax({
        url: '/device/key',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({deviceID: data.deviceID, APIKey: data.APIKey}),
        dataType: 'json'
    });

}

function newDeviceError(jqXHR, textStatus, errorThrown){
    //TODO:Show error div?
}

//Add click listener for add device button
$().ready(function(){

    //If no auth token return to login page
    if(!window.localStorage.getItem("authToken")){
        window.location = "/user/login";
    }
    else{
        getAccountInfoRequest();
    }

    $("#addDeviceForm").click(showAddDeviceForm);
    $("#addDevice").click(addNewDeviceRequest);
})