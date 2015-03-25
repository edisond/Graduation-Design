$(document).ready(function () {
    var oe = $('#input-oe-id').val();
    $.get('/api/get/comment?openExperiment=' + oe, function (data) {
        console.log(data);
    })
    $('#input-submit').click(function () {
        var comment = {
            body: $('#input-comment').val(),
            from: USER,
            openExperiment: oe,
            date: Date.now()
        };
        $.ajax({
            url: '/api/post/comment?action=new',
            data: comment,
            type: 'POST',
            success: function () {
                console.log(1);
            },
            error: function () {
                console.log(0);
            }
        });
    });
});