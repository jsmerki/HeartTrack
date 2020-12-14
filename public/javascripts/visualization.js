function getMeasurementsRequest(){
    $.ajax({
        url: '/user/account',
        type: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
    })  .done(getInfoSuccess)
        .fail(getInfoFailure);
}

function getMeasurementsSuccess(data, textStatus, jqXHR){
    $("#userEmail").text(data.email);
    $("#fullName").text(data.fullName);
    $("#lastAccess").text(data.lastAccess);
    console.log("Date: " + data.lastAccess);
}

function getMeasurementsFailure(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken
    // redirect user to sign-in page (which is index.html)
    if (jqXHR.status == 401) {
        window.localStorage.removeItem("authToken");
        window.location = '/user/login';
    }
}

//Add click listener for add device button
$().ready(function(){

    //If no auth token return to login page
    if(!window.localStorage.getItem("authToken")){
        window.location = "/user/login";
    }
    else{
        // getMeasurementsRequest();
        console.log('Authed');
    }

    getMeasurementsRequest();
})
