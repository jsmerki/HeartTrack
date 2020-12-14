/* ************** *
 *  Get User Info *
 * ************** */

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
}

function getInfoFailure(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken
    // redirect user to sign-in page (which is index.html)
    if (jqXHR.status == 401) {
        window.localStorage.removeItem("authToken");
        window.location = '/user/login';
    }
}

/* ****************** *
 * Adding New Devices *
 * ****************** */
function showAddDeviceForm(){
    $("#addDeviceForm").hide();
    $("#deviceInput").show();
}

function addNewDeviceRequest(){
    let deviceID = $("#deviceID").val();
    let friendlyName = $("#friendlyName").val();

    $.ajax({
        url: '/device/add',
        type: 'POST',
        contentType: 'application/json',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        data: JSON.stringify({friendlyName: friendlyName, deviceID: deviceID}),
        dataType: 'json'
    })
        .done(newAPIKey)
        .fail(newDeviceError);
}

function newAPIKey(data, textStatus, jqXHR){
    $.ajax({
        url: '/device/key',
        type: 'POST',
        contentType: 'application/json',
        headers: {'x-auth': window.localStorage.getItem("authToken")},
        data: JSON.stringify({deviceID: data.deviceID, APIKey: data.APIKey}),
        dataType: 'json'
    })
        .done(getDevices)
        .fail(newDeviceError);
}

function newDeviceError(jqXHR, textStatus, errorThrown){
    $("#deviceCreationErrorResponse").text(jqXHR.responseJSON.message);
    $("#deviceCreationErrorResponse").show();
}

// Remove device
function removeDeviceRequest(event){

    $('#confirmModal').modal('toggle');

    $.ajax({
        url: '/device/remove',
        type: 'POST',
        contentType: 'application/json',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        data: JSON.stringify({deviceID: event.data.deviceID}),
        dataType: 'json'
    })
        .done(getDevices)
        .fail(removeDeviceError);
}

function removeDeviceError(jqXHR, textStatus, errorThrown){
    $("#deviceDeletionErrorResponse").text(jqXHR.responseJSON.message);
    $("#deviceDeletionErrorResponse").show();
}


/* ***************** *
 *  Get User Devices *
 * ***************** */

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
    $("#deviceCreationErrorResponse").hide();
    $(".card").remove();
    if(data.length > 0) {
        generateCards(data);
    }

}

function getDevicesFailure(jqXHR, textStatus, errorThrown){
    $("#deviceCreationErrorResponse").text(jqXHR.responseJSON.message);
    $("#deviceCreationErrorResponse").show();
}


/* ****************************** *
 *  Generate Device Display Cards *
 * ****************************** */

function generateCards(deviceData) {
    let devicesDisplay = $("#userDevicesDisplay");
    devicesDisplay.empty();
    for (let device of deviceData) {

        let cardHTMLString = $(
            '<div class="card bg-light mb-3" style="width: 18rem;">\n' +
            ' <div class="card-header">Placeholder ID</div>' +
            '  <div class="card-body">\n' +
            '    <h5 class="card-title mb-3">Placeholder Name</h5>\n' +
            '   <div class="col text-center"><a href="#" class="btn btn-primary">Ping</a></div>\n' +
            '  </div>\n' +
            '</div>');


        cardHTMLString.find('.card-header').text('Device ID: ' + device.deviceID);
        cardHTMLString.find('.card-title').text(device.friendlyName);

        // Append close button to card
        cardHTMLString.find('.card-header').append(
            '<button type="button" class="close deleteDevice" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span></button>\n'
        );
        // Attach click handler to close button and pass deviceID to removeDeviceRequest
        cardHTMLString.find('span').click(function(event) {
            $('#confirmModal').modal({backdrop:"static"});
            $('.confirmDelete').click({deviceID:device.deviceID}, removeDeviceRequest);
        });

        cardHTMLString.find('a').html('<button id="edit-' + device.deviceID + '" class="btn btn btn-primary">Edit Device</button>').click(function (event) {
            window.location = ('/device/edit?deviceID=' + device.deviceID);
        });

        devicesDisplay.append(cardHTMLString);

    }
}



//Add click listener for add device button
$().ready(function(){

    //If no auth token return to login page
    if(!window.localStorage.getItem("authToken")){
        window.location = "/user/login";
    }
    else{
        getAccountInfoRequest();
        getDevices();
    }

    // Reset page display
    $(".alert").hide();
    $(".card").remove();

    // Event handlers
    $("#addDeviceForm").click(showAddDeviceForm);
    $("#addDevice").click(addNewDeviceRequest);
    // Event handle for pressing enter on add device field
    $('#deviceID').bind("enterKey",function(e){
        addNewDeviceRequest();
    });
    $('#deviceID').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });

});
