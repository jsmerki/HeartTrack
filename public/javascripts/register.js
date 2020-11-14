function sendRegisterRequest() {
    let email = $('#inputEmail');
    let emailConfirm = $('#confirmEmail');
    let password = $('#password');
    let passwordConfirm = $('#passwordConfirm');
    let fullName = $('#fullName');
    $(".invalid-feedback").hide();


    /* *************** *
     *  Error Checking *
     * *************** */
    let emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
    if (!emailRe.test(email.val())) {
        email.addClass("is-invalid");
        $('.improperEmail').show();
        return;
    }
    else {
        email.removeClass("is-invalid").addClass("is-valid");
        $('.improperEmail').hide();
    }

    if (email.val() !== emailConfirm.val()) {
        email.addClass("is-invalid");
        emailConfirm.addClass("is-invalid");
        $('.unmatchedEmails').show();
        return;
    }
    else {
        email.removeClass("is-invalid").addClass("is-valid");
        emailConfirm.removeClass("is-invalid").addClass("is-valid");
        $('.unmatchedEmails').hide();
    }

    // Check to make sure the passwords match
    // FIXME: Check to ensure strong password
    if (password.val() != passwordConfirm.val()) {
        email.addClass("is-invalid");
        $('.unmatchedPasswords').show();
        return;
    }
    else {
        email.removeClass("is-invalid").addClass("is-valid");
        $('.unmatchedPasswords').hide();
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