var payment_method = "alipay";
function update_payment() {
    var alipay_qr = "/static/img/alipay-qr.jpg";
    var wechatpay_qr = "/static/img/wechatpay-qr.jpg";
    
    var qr = $("#payment-qr");
    if (payment_method == "wechat") {
        qr.attr('src', wechatpay_qr);
        $("#tab-wechat").addClass("active");
        $("#tab-alipay").removeClass("active");
    }
    else {
        qr.attr('src', alipay_qr);
        $("#tab-alipay").addClass("active");
        $("#tab-wechat").removeClass("active");
    }
}

$(function(){
    var rec_id = GetUrlParam("id", "");
    var auth = "";
    var user_id = "";
    if (rec_id.length > 0) {
        auth = AuthorizeRedirect();
        user_id = Cookies.get("user_id");
        $("#donate_form").show();
        $.ajax({
            type: "POST",
            url: API_URL+"GetRecord",
            data: { rec_id:rec_id, tx:"false" },
            dataType: "json",
            success: function(d) {
                if (api_success(d)) {
                    var rec = d.result;
                    $("#donate_id").val(rec.donate_id);
                    $("#payload").html(rec.payload);
                }
            }
        });
    }

    $("#wechat").click(function(event){
        payment_method = "wechat";
        update_payment();
    });
    $("#alipay").click(function(event){
        payment_method = "alipay";
        update_payment();
    });
    
    $("#donate_form").submit(function(event){
        event.preventDefault();
        if (auth.length==0 || user_id.length==0) return;
        
        var reg = /^[0-9]{6}$/;
        var donate_id = $("#donate_id").val();
        if (!reg.test(donate_id)) {
            show_msg("请输入正确订单号");
            return;
        }
        $.ajax({
            beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
            type: "POST",
            url: API_URL+"UpdateRecordDonation",
            data: { rec_id:rec_id, pay_method:payment_method, donate_id:donate_id },
            dataType: "json",
            success: function(d) {
                if (api_success(d)) {
                    location = GetUrlParam("r", "/");
                }
            }
        });
    });
    
    setInterval(function(){
        $.ajax({
            type: "GET",
            url: "https://blockchain.info/ticker",
            dataType: "json",
            success: function(d) { 
                $("#btc_price").html(d.USD.last);
            }
        });
    }, 2000);
    
    update_payment();
});
