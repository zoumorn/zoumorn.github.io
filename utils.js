var SERVER_ADDR = "https://s.eternitywall.cn:38080";
var API_URL = SERVER_ADDR+"/s/";

/*
    "Authorize" : { "fn":Authorize, "auth":0, "params": ["user_id"]},
    "GetUserRecords" : { "fn":GetUserRecords, "auth":1, "params": ["user_id"]},
    "GetRecordInfo" : { "fn":GetRecordInfo, "auth":0, "params": ["rec_id"]},
    "CreateRecord" : { "fn":CreateRecord, "auth":1, "params": ["user_id", "payload"]},
    "UpdateRecord" : { "fn":UpdateRecord, "auth":1, "params": ["user_id", "rec_id", "payload"]},
    "UpdateRecordDonation" : { "fn":UpdateRecordDonation, "auth":1, "params": ["user_id", "rec_id", "method", "donate_id"]},
    "RemoveRecord" : { "fn":RemoveRecord, "auth":1, "params": ["user_id", "rec_id"]},
*/

function Format() {
    var args = arguments;
    return args[0].replace(/{(\d+)}/g, function(match, n) {
        return (typeof args[Number(n)+1]!='undefined') ? args[Number(n)+1] : match;
    });
}

function GetUrlRelativePath(){
    var url = document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);
    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

function GetUrlParam(paraName, def) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");
            if (arr != null && arr[0] == paraName) return arr[1];
        }
        return def;
    }
    return def;
}
        
function getByteLen(normal_val) {
    normal_val = String(normal_val);
    var byteLen = 0;
    for (var i = 0; i < normal_val.length; i++) {
        var c = normal_val.charCodeAt(i);
        byteLen += c < (1 << 7) ? 1 : c < (1 << 11) ? 2 : c < (1 << 16) ? 3 : c < (1 << 21) ? 4 : c < (1 << 26) ? 5 : c < (1 << 31) ? 6 : Number.NaN;
    }
    return byteLen;
}

function AuthorizeRedirect() {
    var auth=Cookies.get("auth");
    if (auth==undefined)
        location.replace("login.html?r="+GetUrlRelativePath());
    return auth;
}

function show_msg(m) {
    var d = $("#msg");
    d.html(m);
    d.show();
    setTimeout(function() { d.hide(); }, 2000);
}

function api_error(e) {
    show_msg("未知错误");
}

function api_success(d) {
    if (d.ok == 0) { 
        var msg=d.code;
        if(d.code=="e_pending") msg="你已有一条信息待发布";
        if(d.code=="e_invalid_value") msg="填写的信息有错误";
        if(d.code=="e_invalid_state") msg="不允许进行此操作";
        show_msg(msg);
    }
    return (d.ok == 1);
}
