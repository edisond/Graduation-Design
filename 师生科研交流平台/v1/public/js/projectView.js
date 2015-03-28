$(document).ready(function () {
    var projectId = $('#input-project-id').val(),
        projectType = $('#input-project-type').val(),
        projectSelects = $('#project-selects'),
        commentList = $('#comments'),
        commentBox = $('#input-comment');
    if (projectType === '开放实验项目') {
        $('#nav-link-to-oe').addClass('active');
    } else if (projectType === '挑战杯项目') {
        $('#nav-link-to-cc').addClass('active');
    } else if (projectType === '科技创新工程项目') {
        $('#nav-link-to-ip').addClass('active');
    }

    function newComment(comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img src="' + comment.from.img + '" width="50px" height="50px"></a>').appendTo(mediaLeft);
        if (comment.to) {
            $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + comment.from.type + '回复了<a href="/profile/' + comment.to._id + '">' + comment.to.name + '</a>' + comment.to.type + '：</h5>').appendTo(mediaBody);
        } else {
            $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + comment.from.type + '说：</h5>').appendTo(mediaBody);
        }
        $('<p>' + comment.body + '&nbsp;<a href="#input-comment" data-toggle="tooltip" title="回复" class="ml10" data-id="' + comment.from._id + '" data-name="' + comment.from.name + '" data-type="' + comment.from.type + '"><i class="fa fa-reply"></i></a></p>').appendTo(mediaBody);
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;' + moment(comment.date).fromNow() + '</small>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        return media;
    }

    function newHead(user) {
        var head = $('<a class="dinlineblock mr5 mt5" data-toggle="tooltip" data-placement="bottom" title="' + user.name + '" href="/profile/' + user._id + '"></a>');
        $('<img height="50px" width="50px" src="' + user.img + '"/>').appendTo(head);
        return head.tooltip();
    }

    $.get(encodeURI('/api/get/comment?project=' + projectId), function (data) {
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

    $.get(encodeURI('/api/get/select?project=' + projectId + '&active=true'), function (data) {
        $('#project-selects-num').html(data.length);
        if (data.length === 0) {
            $('<span class="text-muted">暂无同学选课</span>').appendTo(projectSelects);
        } else {
            for (var i = 0, j = data.length; i < j; i++) {
                newHead(data[i].student).appendTo(projectSelects);
            }
        }


    })

    commentList.delegate('a[href="#input-comment"]', 'click', function () {
        var $this = $(this);
        commentBox.attr({
            'placeholder': '正在回复' + $this.attr('data-name') + $this.attr('data-type'),
            'data-id': $this.attr('data-id'),
            'data-name': $this.attr('data-name'),
            'data-type': $this.attr('data-type')
        }).focus()
    })

    $('#btn-apply').click(function () {
        var post = {
            _id: projectId
        };
        $.ajax({
            url: encodeURI('/api/post/select?action=apply'),
            data: post,
            type: 'POST',
            success: function () {
                $('#btn-cancel-select').show();
                $('#btn-apply').hide();
                notyFacade('申请成功，请等待教师确认', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }

        });
    });

    $('#btn-cancel-select').click(function () {
        var post = {
            _id: projectId
        };
        $.ajax({
            url: encodeURI('/api/post/select?action=cancel'),
            data: post,
            type: 'POST',
            success: function () {
                $('#btn-apply').show();
                $('#btn-cancel-select').hide();
                notyFacade('已取消选课申请', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }

        });
    });

    $('button[data-action=ask]').click(function () {
        commentBox.focus();
    });

    $('#form-comment').html5Validate(function () {
        var comment = {
            body: commentBox.val(),
            from: USER._id,
            project: projectId,
            date: Date.now()
        };
        if (commentBox.attr('data-id')) {
            comment.to = commentBox.attr('data-id')
        }
        $.ajax({
            url: encodeURI('/api/post/comment?action=new'),
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

    var editProjectModal = $('#edit-project');

    if (editProjectModal.size() > 0) {

        editProjectModal.find(".input-append.date").datetimepicker({
            format: "yyyy-mm-dd",
            minView: 'month',
            autoclose: true,
            todayBtn: true,
            startDate: new Date(),
            pickerPosition: "bottom-left"
        });

        editProjectModal.find('form').html5Validate(function () {
            var post = {
                _id: editProjectModal.find('#input-_id').val(),
                openExperimentAttr: {
                    detail: editProjectModal.find('#input-detail').val(),
                    capacity: parseInt(editProjectModal.find('#input-capacity').val()),
                    effort: parseInt(editProjectModal.find('#input-effort').val()),
                    requirement: editProjectModal.find('#input-requirement').val(),
                    object: editProjectModal.find('#input-object').val(),
                    lab: editProjectModal.find('#input-lab').val(),
                    source: editProjectModal.find('#input-source').val(),
                    result: editProjectModal.find('#input-result').val()
                },
                description: editProjectModal.find('#input-description').val(),
                college: editProjectModal.find('#input-college').val(),
                name: editProjectModal.find('#input-name').val(),
                teacher: USER._id,
                dateStart: new Date(editProjectModal.find('#input-dateStart').val()),
                dateEnd: new Date(editProjectModal.find('#input-dateEnd').val()),
                dateUpdate: Date.now(),
                type: '开放实验项目'
            };
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/project?action=update"),
                data: post,
                success: function () {
                    window.location.reload()
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        })
    }

});