function sendDeviceEditRequest() {
    let friendlyName = $('#friendlyName');
    let measureInterval = $('#measureInterval');
    let startTime = $('#startTime');
    let endTime = $('#endTime');


    // Reset form on each submit
    $(".invalid-feedback").hide();
    $(".is-invalid").removeClass("is-invalid").removeClass('is-valid');
    $(".requiredField").remove();

    let error = false;

    $('input').each( function(index) {
        let input = $(this);
        if(input.val().length < 1){
            input.addClass("is-invalid");
            input.after($( '<div class="invalid-feedback requiredField">This field is required!</div>' ));
            error = true;
        }
    })
    // This is required for some reason??
    $(".requiredField").show();

    $("input:not(.invalid-feedback)").addClass('is-valid');


    if(!error) {
        let requestData = {
            friendlyName: friendlyName.val(),
            measureInterval: measureInterval.val(),
            startTime: startTime.val(),
            endTime: endTime.val(),
        }

        $.ajax({
            url: '/device/edit',
            type: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth' : window.localStorage.getItem("authToken") },
            data: JSON.stringify(requestData),
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                // redirect to google after 4 seconds
                $('.alert-danger').hide();
                $('.alert-success').fadeIn(500);
                window.setTimeout(function() {
                    window.location.href = '/user/profile';
                }, 4000);
            }
        }).fail(function(data, textStatus, jqXHR) {
            $('.alert-danger').fadeIn(500);
        });
    }

}

function getOneDevice(){
    let getURL = '/device/getOne?deviceID=' + (new URLSearchParams(window.location.search).get('deviceID'));
    console.log(getURL);
    $.ajax({
        url: getURL,
        type: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
    })  .done(getOneDeviceSuccess)
        .fail(getOneDeviceFailure);
}

function getOneDeviceSuccess(data, textStatus, jqXHR){
    $('#deviceID').val(data.deviceID);
    $('#APIKey').val(data.APIKey);
    $('#friendlyName').val(data.friendlyName);
    $('#dateRegistered').val(data.dateRegistered);
    $('#lastRead').val(data.lastRead);
    $('#measureInterval').val(data.measureInterval);
    $('#startTime').val(data.startTime);
    $('#endTime').val(data.endTime);
}

function getOneDeviceFailure(jqXHR, textStatus, errorThrown){
    $("#deviceNotFound").show();
    $("form").hide();
}


$().ready( function(){
    $('.alert').hide();
    //If no auth token return to login page
    if(!window.localStorage.getItem("authToken")){
        window.location = "/user/login";
    }
    else{
        getOneDevice();
        $("button#ping").click(function (event) {
            pingDevice(event, device.deviceID);
        });
    }

    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        sendDeviceEditRequest();
    });
});