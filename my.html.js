var auth = AuthorizeRedirect();
var user_id = Cookies.get("user_id");
var max_payload_length = 75;

function CreateRecordDiv(rec) {
    var div = $(Format('<div id="record" class="well well-sm" record-id="{0}"></div>', rec.id));
    var header = $(Format('<h5 class="record-header"></h5>'));
    div.append(header);
    header.append($(Format("<span>{0}</span>", rec.tm_payload_str)));
    header.append(document.createTextNode(" "));
    if (rec.state=="new") {
        header.append($(Format("<span>{0}</span>", "待审核")));
        header.append(document.createTextNode(" "));
        header.append($(Format('<a href="/donate.html?id={0}&r=/my.html">捐赠</a>', rec.id)));
        header.append(document.createTextNode(" "));
        header.append($(Format('<a id="btn-del" href="javascript:void(0);">删除</a>')));
    }
    else if (rec.state=="confirmed") {
        header.append($(Format("<span>{0}</span>", "已审核")));
    }
    else if (rec.state=="rejected") {
        header.append($(Format("<span>{0}</span>", "已拒绝")));
    }
    else if (rec.state=="uploaded") {
        header.append($(Format("<span>{0}</span>", "已发布")));
        header.append(document.createTextNode(" "));
        header.append($(Format('<a href="/post.html?id={0}">证书</a>', rec.id)));
    }
    div.append($(Format('<p class="record-main-text">{0}</p>', rec.payload)));
    return div;
}

function LoadAllRecord() {
    $.ajax({
        beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
        type: "POST",
        url: API_URL+"GetUserRecords",
        dataType: "json",
        error: function() { api_error(); },
        success: function(d) {
            if (api_success(d)) {
                for (var i=0; i<d.result.length; i++) {
                    $("#records").append(CreateRecordDiv(d.result[i]));
                }
            }
        }
    });
}

$(function(){
    $("#txt-payload").keyup(function(e) {
        var maxchars = max_payload_length;
        var byteslength = getByteLen($(this).val());
        $("#payload-len").text(maxchars-byteslength);
    });
    $("#btn-send").click(function(event) {
        var payload = $("#txt-payload").val();
        var byteslength = getByteLen(payload);
        if (payload.length <= 0 || byteslength > max_payload_length) {
            show_msg("信息太长无法发布");
            return;
        }
        $.ajax({
            beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
            type: "POST",
            url: API_URL+"CreateRecord",
            data: { payload:payload },
            dataType: "json",
            error: function() { api_error(); },
            success: function(d) {
                if (api_success(d)) {
                    $("#records").prepend(CreateRecordDiv(d.result));
                }
            }
        });
        event.preventDefault();
    });
    $("#records").on("click", "#btn-del", function(event) {
        var record = $(this).parent().parent();
        var record_id = record.attr("record-id");
        $.ajax({
            beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
            type: "POST",
            url: API_URL+"RemoveRecord",
            data: { rec_id:record_id },
            dataType: "json",
            error: function() { ajax_error(); },
            success: function(d) {
                if (api_success(d)) record.remove(); }
        });
        event.preventDefault();
    });
    $("#user_id").html(user_id);
    LoadAllRecord();
});
