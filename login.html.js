$(function(){
    $("#login_form").submit(function(event){
        event.preventDefault();
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var user_id = $("#user_id").val();
        if (!reg.test(user_id)) {
            show_msg("请输入正确的邮箱地址");
            return;
        }
        $.ajax({
            type: "POST",
            url: API_URL+"Authorize",
            data: { email:user_id },
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
});
