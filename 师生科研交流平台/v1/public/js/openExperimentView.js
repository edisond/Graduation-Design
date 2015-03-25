$(document).ready(function () {
    var oe = $('#input-oe-id').val(),
        commentList = $('#comments'),
        commentBox = $('#input-comment');

    function newComment(comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img src="' + comment.from.img + '" width="50px" height="50px"></a>').appendTo(mediaLeft);
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
        var $this = $(this);
        commentBox.attr({
            'placeholder': '正在回复' + $this.attr('data-name') + ($this.attr('data-type') === 'teacher' ? '老师' : '同学'),
            'data-id': $this.attr('data-id'),
            'data-name': $this.attr('data-name'),
            'data-type': $this.attr('data-type')
        }).focus()
    })

    $('#btn-select').click(function () {
        $.ajax({
            url: '/api/post/open-experiment?action=select',
            post: {
                id: USER._id
            },
            type: 'POST',
            success: function () {
                notyFacade('申请成功，请等待教师确认', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }

        });
    });

    $('#btn-ask').click(function () {
        commentBox.focus();
    });

    $('#input-submit').click(function () {
        var comment = {
            body: commentBox.val(),
            from: USER._id,
            openExperiment: oe,
            date: Date.now()
        };
        if (commentBox.attr('data-id')) {
            comment.to = commentBox.attr('data-id')
        }
        $.ajax({
            url: '/api/post/comment?action=new',
            data: comment,
            type: 'POST',
            success: function () {
                comment.from = {
                    _id: USER._id,
                    type: USER.type,
                    name: USER.name,
                    img: USER.img
                };
                if (comment.to) {
                    comment.to = {
                        _id: commentBox.attr('data-id'),
                        type: commentBox.attr('data-type'),
                        name: commentBox.attr('data-name')
                    }
                }
                if (commentList.find('.media').size() === 0) {
                    $('#comments-state').hide();
                } else {
                    $('<hr>').appendTo(commentList);
                }
                newComment(comment).appendTo(commentList);
                $('#form-comment')[0].reset();
                $('#input-cancel').click();
                notyFacade('发布成功', 'success');
            },
            error: function () {
                notyFacade('发布失败，请重试或刷新后重试', 'error');
            }
        });
    });

    $('#input-cancel').click(function () {
        commentBox.attr('placeholder', '说点什么').removeAttr('data-id').removeAttr('data-name').removeAttr('data-type').val('');
    });
});