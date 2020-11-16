function sendRegisterRequest() {
    let email = $('#inputEmail');
    let emailConfirm = $('#confirmEmail');
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
    // Valid Email checking
    let email_re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;

    if (! (email_re.test(email.val())) ) {
        email.addClass("is-invalid");
        $('.invalidEmail').show();
        error = true;
        console.log('Email is invalid.');
    }

    // Email matching confirm checking
    if (email.val() != emailConfirm.val()) {
        email.addClass("is-invalid");
        emailConfirm.addClass("is-invalid");
        $('.unmatchedEmails').show();
        error = true;
        console.log('Emails do not match.');
    }

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
    if ( !(passStrength_re.test(password.val()))) {
        password.addClass("is-invalid");
        passwordConfirm.addClass("is-invalid");
        $('.weakPassword').show();
        error = true;
        $("#passwordCriterion").show();
    }

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
        $.ajax({
            url: '/user/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({email: email.val(), fullName: fullName.val(), password: password.val()}),
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                // redirect to google after 4 seconds
                $('.alert-danger').hide();
                $('.alert-success').fadeIn(500);
                window.setTimeout(function() {
                    window.location.href = '/user/login';
                }, 4000);
            }
        }).fail(function(data, textStatus, jqXHR) {
            $('.alert-danger').fadeIn(500);
        });
    }
        //.done(registerSuccess)
        //.fail(registerError);


}

$().ready( function(){
    $('.alert').hide();
    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        sendRegisterRequest();
    });
});