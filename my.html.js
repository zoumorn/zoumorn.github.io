var auth = authorize_and_redirect();
var user_id = Cookies.get("user_id");
var max_payload_length = 75;

function create_record_div(rec) {
    var div = $(format('<div id="record" class="well well-sm" record-id="{0}"></div>', rec.id));
    var header = $(format('<h5 class="record-header"></h5>'));
    div.append(header);
    header.append($(format("<span>{0}</span>", rec.tm_payload_str)));
    header.append(document.createTextNode(" "));
    if (rec.state=="new") {
        header.append($(format("<span>{0}</span>", "待审核")));
        header.append(document.createTextNode(" "));
        header.append($(format('<a href="/donate.html?id={0}&r=/my.html">捐赠</a>', rec.id)));
        header.append(document.createTextNode(" "));
        header.append($(format('<a id="btn-del" href="javascript:void(0);">删除</a>')));
    }
    else if (rec.state=="confirmed") {
        header.append($(format("<span>{0}</span>", "已审核")));
    }
    else if (rec.state=="rejected") {
        header.append($(format("<span>{0}</span>", "已拒绝")));
    }
    else if (rec.state=="uploaded") {
        header.append($(format("<span>{0}</span>", "已发布")));
        header.append(document.createTextNode(" "));
        header.append($(format('<a href="/post.html?id={0}">证书</a>', rec.id)));
    }
    div.append($(format('<p class="record-main-text">{0}</p>', rec.payload)));
    return div;
}

function load_all_record() {
    $.ajax({
        beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
        type: "POST",
        url: API_URL+"GetUserRecords",
        dataType: "json",
        error: api_error,
        success: function(d) { if (api_success(d)) {
            for (var i=0; i<d.result.length; i++) {
                $("#records").append(create_record_div(d.result[i]));
            }
        }}
    });
}

$(function(){
    $("#user_id").html(user_id);
    load_all_record();

    var txt_payload = $("#txt-payload");
    txt_payload.keyup(function(e) {
        var maxchars = max_payload_length;
        var byteslength = get_byte_len($(this).val());
        $("#payload-len").text(maxchars-byteslength);
    });

    $("#btn-send").click(function(event) {
        event.preventDefault();
        var payload = txt_payload.val();
        var byteslength = get_byte_len(payload);
        if (payload.length <= 0 || byteslength > max_payload_length) {
            show_msg("信息太长无法发布");
            return;
        }
        txt_payload.focus();
        $.ajax({
            beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
            type: "POST",
            url: API_URL+"CreateRecord",
            data: { payload:payload },
            dataType: "json",
            error: api_error,
            success: function(d) { if (api_success(d)) {
                $("#records").prepend(create_record_div(d.result));
                txt_payload.val("");
            }}
        });
    });

    $("#records").on("click", "#btn-del", function(event) {
        event.preventDefault();
        var record = $(this).parent().parent();
        var record_id = record.attr("record-id");
        $.ajax({
            beforeSend: function(xhr){xhr.setRequestHeader("X-Auth", auth);},
            type: "POST",
            url: API_URL+"RemoveRecord",
            data: { rec_id:record_id },
            dataType: "json",
            error: api_error,
            success: function(d) { if (api_success(d)) record.remove(); }
        });
    });
});
