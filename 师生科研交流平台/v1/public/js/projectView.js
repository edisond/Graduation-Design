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

    function fetchComments() {
        commentList.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(commentList)
        $.get(encodeURI('/api/get/comment?project=' + projectId), function (data) {
            if (data.length === 0) {
                loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无讨论')
            } else {
                commentList.empty().hide();
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.comment(data[i]).appendTo(commentList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(commentList);
                    }
                }
                commentList.fadeIn(250);
            }
        })
    }

    function fetchSelector() {
        projectSelects.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectSelects)
        $.get(encodeURI('/api/get/select?project=' + projectId + '&active=true'), function (data) {
            $('#project-selects-num').html(data.length);
            if (data.length === 0) {
                loadstate.html('暂无同学选课');
            } else {
                projectSelects.empty().hide();
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.head(data[i].student).appendTo(projectSelects);
                }
            }
            projectSelects.fadeIn(250)
        })
    }

    fetchComments();
    fetchSelector();

    commentList.delegate('a[href="#input-comment"]', 'click', function () {
        var $this = $(this);
        $('#reply-object').html('正在回复' + $this.attr('data-name') + $this.attr('data-type'));
        commentBox.attr({
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
            body: commentBox.html(),
            from: USER._id,
            project: projectId,
            date: Date.now()
        };
        if (comment.body === '') {
            notyFacade('请填写讨论内容', 'warning');
            return false;
        }
        if (commentBox.attr('data-id')) {
            comment.to = commentBox.attr('data-id')
        }
        $.ajax({
            url: encodeURI('/api/post/comment?action=new'),
            data: comment,
            type: 'POST',
            success: function () {
                fetchComments();
                commentBox.html('');
                $('#input-cancel').click();
                notyFacade('发布成功', 'success');
            },
            error: function () {
                notyFacade('发布失败，请重试或刷新后重试', 'error');
            }
        });
    });

    $('#input-cancel').click(function () {
        commentBox.removeAttr('data-id').removeAttr('data-name').removeAttr('data-type').html('');
        $('#reply-object').html('');
    });

    function initToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'],
            fontTarget = $('[title=字体]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });

        $('[title]').tooltip({
            container: 'body'
        });

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this),
                target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(34).height(30);
        });

        $('.dropdown-menu input').click(function () {
                return false;
            })
            .change(function () {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function () {
                this.value = '';
                $(this).change();
            });
    };

    initToolbarBootstrapBindings();

    $('#input-comment').wysiwyg({
        toolbarSelector: '[data-target=#input-comment][data-role=editor-toolbar]'
    });

    var editProjectModal = $('#edit-project');

    if (editProjectModal.size() > 0) {

        editProjectModal.find('#input-detail').wysiwyg({
            toolbarSelector: '[data-target=#input-detail][data-role=editor-toolbar]'
        });
        editProjectModal.find('#input-requirement').wysiwyg({
            toolbarSelector: '[data-target=#input-requirement][data-role=editor-toolbar]'
        });

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
                    detail: editProjectModal.find('#input-detail').html(),
                    capacity: parseInt(editProjectModal.find('#input-capacity').val()),
                    effort: parseInt(editProjectModal.find('#input-effort').val()),
                    requirement: editProjectModal.find('#input-requirement').html(),
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