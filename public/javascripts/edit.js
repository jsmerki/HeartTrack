function sendEditRequest() {
    let password = $('#inputPassword');
    let passwordConfirm = $('#confirmPassword');
    let fullName = $('#inputFullName');

    // Reset form on each submit
    $(".invalid-feedback").hide();
    $(".is-invalid").removeClass("is-invalid").removeClass('is-valid');
    $(".requiredField").remove();
    $("#passwordCriterion").hide();

    let error = false;


    /* *************** *
     *  Error Checking *
     * *************** */
    if(password.val().length > 0) {
        // Password matching confirm checking
        if (password.val() != passwordConfirm.val()) {
            password.addClass("is-invalid");
            passwordConfirm.addClass("is-invalid");
            $('.unmatchedPasswords').show();
            error = true;
            console.log('Passwords do not match.');
        }

        /* Password strength regex uses look-aheads to confirm
            1. At least one uppercase character
            2. At least one special character
            3. At least one digit
            4. At least one lower case
            5. At least 8 characters
        */
        let passStrength_re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}/;
        // Password matching confirm checking
        if (!(passStrength_re.test(password.val()))) {
            password.addClass("is-invalid");
            passwordConfirm.addClass("is-invalid");
            $('.weakPassword').show();
            error = true;
            $("#passwordCriterion").show();
        }
    }
    if(fullName.val().length < 1){
        fullName.addClass("is-invalid");
        fullName.after($( '<div class="invalid-feedback requiredField">This field is required!</div>' ));
        error = true;
    }

    // This is required for some reason??
    $(".requiredField").show();

    $("input:not(.invalid-feedback)").addClass('is-valid');

    if(!error) {
        $.ajax({
            url: '/user/profile/edit',
            type: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth' : window.localStorage.getItem("authToken") },
            data: JSON.stringify({fullName: fullName.val(), password: password.val()}),
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

// Get user's information
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
    $("#inputEmail").val(data.email);
    $("#inputFullName").val(data.fullName);
    $("#inputPassword").val("");
    $("#confirmPassword").val("");
}

function getInfoFailure(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken
    // redirect user to sign-in page (which is index.html)
    if (jqXHR.status == 401) {
        window.localStorage.removeItem("authToken");
        window.location = '/user/login';
    }
}

$().ready( function(){
    $('.alert').hide();
    //If no auth token return to login page
    if(!window.localStorage.getItem("authToken")){
        window.location = "/user/login";
    }
    else{
        getAccountInfoRequest();
    }

    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        sendEditRequest();
    });
});