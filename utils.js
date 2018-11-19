var SERVER_ADDR = "https://s.eternitywall.cn:38080";
if (document.location.host == "localhost")
    SERVER_ADDR = "http://localhost:8080";
var API_URL = SERVER_ADDR+"/s/";

function format() {
    var args = arguments;
    return args[0].replace(/{(\d+)}/g, function(match, n) {
        return (typeof args[Number(n)+1]!='undefined') ? args[Number(n)+1] : match;
    });
}

function get_byte_len(normal_val) {
    normal_val = String(normal_val);
    var n = 0;
    for (var i = 0; i < normal_val.length; i++) {
        var c = normal_val.charCodeAt(i);
        n += c < (1 << 7) ? 1 : c < (1 << 11) ? 2 : c < (1 << 16) ? 3 : c < (1 << 21) ? 4 : c < (1 << 26) ? 5 : c < (1 << 31) ? 6 : Number.NaN;
    }
    return n;
}

function get_url_relative_path(){
    var url = document.location.toString();
    var arr_url = url.split("//");
    var start = arr_url[1].indexOf("/");
    var rel_url = arr_url[1].substring(start);
    if(rel_url.indexOf("?") != -1){
        rel_url = rel_url.split("?")[0];
    }
    return rel_url;
}

function get_url_param(param, def) {
    var url = document.location.toString();
    var arr_obj = url.split("?");

    if (arr_obj.length > 1) {
        var arr_para = arr_obj[1].split("&");
        var arr;

        for (var i = 0; i < arr_para.length; i++) {
            arr = arr_para[i].split("=");
            if (arr != null && arr[0] == param) return arr[1];
        }
        return def;
    }
    return def;
}

function authorize_and_redirect() {
    var auth=Cookies.get("auth");
    if (auth==undefined)
        location.replace("login.html?r="+get_url_relative_path());
    return auth;
}

function show_msg(m) {
    var d = $("#msg");
    d.html(m);
    d.show();
    setTimeout(function() { d.hide(); }, 2000);
}

function api_error(e) {
    show_msg("网络错误");
}

function api_success(d) {
    if (d.ok == 0) {
        var msg="";
        switch(d.code) {
            case "e_pending": msg="你已有一条信息待发布"; break;
            case "e_not_owner": msg="资源不属于调用者"; break;
            case "e_invalid_arg": msg="输入的数据有误"; break;
            case "e_invalid_state": msg="此时不允许进行此操作"; break;
            case "e_internal_err": msg="服务内部错误"; break;
            default: break;
        }
        show_msg(msg);
    }
    return (d.ok == 1);
}
