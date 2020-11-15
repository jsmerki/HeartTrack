function loginUserRequest(){

    let email = $("inputEmail").val();
    let password = $("inputPassword").val();

    $.ajax({
        url: '/users/login',
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
    $.ajax({
        url: '/users/profile',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json'
    });

}

function loginFailure(jqXHR, textStatus, errorThrown){
    console.log("BIG FAIL");
}


$().ready( function(){
    if(window.localStorage.getItem("authToken")){
        $.ajax({
            url: '/users/profile',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json'
        });
        //window.location="/users/profile";
    }

    $('form').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        loginUserRequest();
    });
});