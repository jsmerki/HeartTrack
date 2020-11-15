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
    $("#lastAccess").text(data.lastAccess.toDateString());
    console.log("Date: " + data.lastAccess.toDateString());
}

function getInfoFailure(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken
    // redirect user to sign-in page (which is index.html)
    if (jqXHR.status == 401) {
        window.localStorage.removeItem("authToken");
        window.location = '/user/login';
    }
}

function addNewDeviceRequest(){
    let email = $("#email").val();
    let deviceID = $("#deviceID").val();

    $.ajax({
        url: '/devices/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({email:email, deviceID: deviceID}),
        dataType: 'json'
    })
        .done(newDeviceSuccess)
        .fail(newDeviceError);


}

function newDeviceSuccess(data, textStatus, jqXHR){
   //Reload page to show newly added device?
    window.location = "/user/profile"
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

    //$("#addDevice").click(addNewDeviceRequest);
})