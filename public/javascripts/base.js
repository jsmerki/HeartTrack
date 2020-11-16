
$(document).ready(function() {
    $('li.active').removeClass('active');
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active');

    if(window.localStorage.getItem("authToken")){
        $('a[href="/user/login"]').hide();
        $('a[href="/user/logout"]').show();

        $('a[href="/health"]').show();
        $('a[href="/user/profile"]').show();
    }
    else {
        $('a[href="/user/login"]').show();
        $('a[href="/user/logout"]').hide();

        $('a[href="/health"]').hide();
        $('a[href="/user/profile"]').hide();
    }
});