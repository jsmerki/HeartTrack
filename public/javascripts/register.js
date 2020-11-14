function sendRegisterRequest() {
    let email = $('#inputEmail');
    let emailConfirm = $('#confirmEmail');
    let password = $('#password');
    let passwordConfirm = $('#passwordConfirm');
    let fullName = $('#fullName');
<<<<<<< HEAD
    console.log('Callback run.');
    $(".invalid-feedback").hide();

    /* *************** *
     *  Error Checking *
     * *************** */
=======
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

>>>>>>> kevinExperimental
    if (email.val() !== emailConfirm.val()) {
        email.addClass("is-invalid");
        emailConfirm.addClass("is-invalid");
        $('.unmatchedEmails').show();
<<<<<<< HEAD
        console.log('Emails invalid.');
=======
>>>>>>> kevinExperimental
        return;
    }
    else {
        email.removeClass("is-invalid").addClass("is-valid");
        emailConfirm.removeClass("is-invalid").addClass("is-valid");
        $('.unmatchedEmails').hide();
<<<<<<< HEAD
        console.log('Emails valid.')
=======
>>>>>>> kevinExperimental
    }

    // Check to make sure the passwords match
    // FIXME: Check to ensure strong password
    if (password.val() != passwordConfirm.val()) {
<<<<<<< HEAD
        $('#ServerResponse').html("<span class='red-text text-darken-2'>Passwords do not match.</span>");
        $('#ServerResponse').show();
        return;
    }
=======
        email.addClass("is-invalid");
        $('.unmatchedPasswords').show();
        return;
    }
    else {
        email.removeClass("is-invalid").addClass("is-valid");
        $('.unmatchedPasswords').hide();
    }
>>>>>>> kevinExperimental

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