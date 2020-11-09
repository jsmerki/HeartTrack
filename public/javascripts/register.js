function sendRegisterRequest() {
    let email = $('#inputEmail');
    let emailConfirm = $('#confirmEmail');
    let password = $('#password');
    let passwordConfirm = $('#passwordConfirm');
    let fullName = $('#fullName');
    console.log('Callback run.');
    $(".invalid-feedback").hide();

    /* *************** *
     *  Error Checking *
     * *************** */
    if (email.val() !== emailConfirm.val()) {
        email.addClass("is-invalid");
        emailConfirm.addClass("is-invalid");
        $('.unmatchedEmails').show();
        console.log('Emails invalid.');
        return;
    }
    else {
        email.removeClass("is-invalid").addClass("is-valid");
        emailConfirm.removeClass("is-invalid").addClass("is-valid");
        $('.unmatchedEmails').hide();
        console.log('Emails valid.')
    }

    // Check to make sure the passwords match
    // FIXME: Check to ensure strong password
    if (password.val() != passwordConfirm.val()) {
        $('#ServerResponse').html("<span class='red-text text-darken-2'>Passwords do not match.</span>");
        $('#ServerResponse').show();
        return;
    }

    /*
    $.ajax({
        url: '/users/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({email:email, fullName:fullName, password:password}),
        dataType: 'json'
    })
        .done(registerSuccess)
        .fail(registerError);

     */
}

$().ready( function(){
    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        sendRegisterRequest();
    });
});