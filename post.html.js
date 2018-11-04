$(function(){
    var rec_id = GetUrlParam("id", "");
    $.ajax({
        type: "POST",
        url: API_URL+"GetRecord",
        data: { rec_id:rec_id, tx:"true" },
        dataType: "json",
        success: function(d) {
            if (api_success(d)) {
                var rec = d.result;
                $("#tm_payload_str").html(rec.tm_payload_str);
                $("#payload").html(rec.payload);
                $("#txid").html(rec.tx.txid);
                $("#blockhash").html(rec.tx.blockhash);
                $("#confirmations").html(rec.tx.confirmations);
            }
        }
    });
});
