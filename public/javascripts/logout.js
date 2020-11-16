$().ready( function(){
    if(window.localStorage.getItem("authToken")){
        window.localStorage.removeItem("authToken")
        window.location="/user/login";
    }
});