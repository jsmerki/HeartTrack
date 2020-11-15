function addNewDeviceRequest(){
    let email = $("#email").val();
    let deviceID = $("deviceID").val();

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
    //TODO:Something? Reload page to show added device?
    $.ajax({
        url: '/users/profile',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json'
    });
    //window.location = "/users/profile"
}

function newDeviceError(jqXHR, textStatus, errorThrown){
    //TODO:Show error div?
}

//Add click listener for add device button
$().ready(function(){
    $("#addDevice").click(addNewDeviceRequest)
})