$(function(){
    loadLog();
    setInterval(loadLog, 5000);
});

function loadLog(){
    $.get('net.log', function(data){
        $('#logfile').html(data);
        $("#content").animate({ scrollTop: $('#content').height() }, 1);
    });
}