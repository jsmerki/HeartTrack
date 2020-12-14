function loginUserRequest(){

    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();

    $.ajax({
        url: '/user/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({email:email, password:password}),
        dataType: 'json'
    })
        .done(loginSuccess)
        .fail(loginFailure);

}

function loginSuccess(data, textStatus, jqXHR){
    //Login succeeded, move on to profile page
    window.localStorage.setItem("authToken", data.jwt);
    window.location="/user/profile";

}

function loginFailure(jqXHR, textStatus, errorThrown){
    $('#loginError').show();
}


$().ready( function(){
    if(window.localStorage.getItem("authToken")){
        window.location="/user/profile";
    }

    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        loginUserRequest();
    });
});