function load_captcha() {
    var id=("0000" + parseInt(Math.random()*1000).toString()).slice(-4);
    $("#captcha").val(id);
    $("#captcha_img").attr("src", SERVER_ADDR+"/captcha/"+id);
}

$(function(){
    $("#login_form").submit(function(event){
        event.preventDefault();
        var captcha = $("#captcha").val();
        var recaptcha = $("#recaptcha").val(); 
        $.ajax({
            type: "POST",
            url: API_URL+"Authorize",
            data: { email:user_id, captcha:captcha, recaptcha:recaptcha },
            dataType: "json",
            error: function() { api_error(); },
            success: function(d) { if (api_success(d)) {
                Cookies.set("user_id", user_id);
                Cookies.set("auth", d.result);
                var r = GetUrlParam("r", "/");
                location.replace(r);
            }}
        });
    });
    $("#captcha_click").click(function(event){
        event.preventDefault();
        load_captcha();
    });
    load_captcha();
});
