function sendRegisterRequest() {
    let email = $('#inputEmail');
    let emailConfirm = $('#confirmEmail');
    let password = $('#inputPassword');
    let passwordConfirm = $('#confirmPassword');
    let fullName = $('#inputFullName');
    console.log('Callback run.');
    $(".invalid-feedback").hide();

    console.log(password.val());
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


    $.ajax({
        url: '/user/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({email:email.val(), fullName:fullName.val(), password:password.val()}),
        dataType: 'json'
    });
        //.done(registerSuccess)
        //.fail(registerError);


}

$().ready( function(){
    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        sendRegisterRequest();
    });
});