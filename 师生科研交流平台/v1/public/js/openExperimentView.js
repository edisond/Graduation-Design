$(document).ready(function () {
    var oe = $('#input-oe-id').val(),
        commentList = $('#comments');

    function newComment(comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img src="/img/' + comment.from.type + '-default.jpg" width="50px" height="50px"></a>').appendTo(mediaLeft);
        if (comment.to) {
            $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + (comment.from.type === 'teacher' ? '老师' : '同学') + '回复了<a href="/profile/' + comment.to._id + '">' + comment.to.name + '</a>' + (comment.to.type === 'teacher' ? '老师' : '同学') + '：</h5>').appendTo(mediaBody);
        } else {
            $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + (comment.from.type === 'teacher' ? '老师' : '同学') + '说：</h5>').appendTo(mediaBody);
        }
        $('<p>' + comment.body + '&nbsp;<a href="#input-comment" data-toggle="tooltip" title="回复" class="ml10" data-id="' + comment.from._id + '" data-name="' + comment.from.name + '" data-type="' + comment.from.type + '"><i class="fa fa-reply"></i></a></p>').appendTo(mediaBody);
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;' + moment(comment.date).fromNow() + '</small>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        return media;
    }

    $.get('/api/get/comment?openExperiment=' + oe, function (data) {
        if (data.length === 0) {
            $('#comments-state').html('暂无讨论')
        } else {
            $('#comments-state').hide();
            for (var i = 0, j = data.length; i < j; i++) {
                newComment(data[i]).appendTo(commentList);
                if (i < j - 1) {
                    $('<hr>').appendTo(commentList);
                }
            }
        }

    })

    commentList.delegate('a[href="#input-comment"]', 'click', function () {
        console.log(1);
    })

    $('#input-submit').click(function () {
        var comment = {
            body: $('#input-comment').val(),
            from: USER._id,
            openExperiment: oe,
            date: Date.now()
        };
        $.ajax({
            url: '/api/post/comment?action=new',
            data: comment,
            type: 'POST',
            success: function () {
                comment.from = {
                    _id: USER._id,
                    type: USER.type,
                    name: USER.name
                };

                if (commentList.find('.media').size() === 0) {
                    $('#comments-state').hide();
                } else {
                    $('<hr>').appendTo(commentList);
                }
                newComment(comment).appendTo(commentList);
                $('#form-comment')[0].reset();
                notyFacade('发布成功', 'success');
            },
            error: function () {
                notyFacade('发布失败，请重试或刷新后重试', 'error');
            }
        });
    });
});