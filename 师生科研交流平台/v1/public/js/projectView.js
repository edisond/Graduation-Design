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
                loadstate.html('对项目有任何疑问都可以在这里与老师或同学交流。')
            } else {
                $('#comment-num').html('共有' + data.length + '条评论');
                commentList.empty().hide();
                data.sort(function (a, b) {
                    return new Date(a.date) > new Date(b.date)
                });
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
    if (projectType === '开放实验项目')
        fetchSelector();

    commentList.delegate('a[href="#input-comment"]', 'click', function (e) {
        if (USER) {
            var $this = $(this);
            $('#reply-object').html('正在回复' + $this.attr('data-name') + $this.attr('data-type'));
            commentBox.attr({
                'data-id': $this.attr('data-id'),
                'data-name': $this.attr('data-name'),
                'data-type': $this.attr('data-type')
            }).focus()
        } else {
            notyFacade('请先登录', 'information');
            e.preventDefault();
        }
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

    var guideProjectModal = $('#guide-project');
    if (guideProjectModal.size()) {
        guideProjectModal.find('#submit').click(function () {
            var post = {
                _id: projectId
            };
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/project?action=guide"),
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



    $('button[data-action=ask]').click(function () {
        commentBox.focus();
    });

    $('#form-comment').html5Validate(function () {
        if (USER) {
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
        } else {
            notyFacade('请先登录', 'information');
            return false;
        }
    });

    $('#input-cancel').click(function () {
        commentBox.removeAttr('data-id').removeAttr('data-name').removeAttr('data-type').html('');
        $('#reply-object').html('');
    });

    $('.wysiwyg-textarea').Wysiwyg()

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

        editProjectModal.find('#new-oe').html5Validate(function () {
            var post = {
                _id: projectId,
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
                dateStart: new Date(editProjectModal.find('#input-dateStart').val()),
                dateEnd: new Date(editProjectModal.find('#input-dateEnd').val()),
                dateUpdate: Date.now()
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

        editProjectModal.find('#new-cc').html5Validate(function () {
            var $this = $(this);
            var post = {
                _id: projectId,
                challengeCupAttr: {
                    ccTeam: $this.find('#input-ccTeam').html(),
                    ccFund: $this.find('#input-ccFund').html(),
                    ccDBasic: $this.find('#input-ccDBasic').html(),
                    ccDMarket: $this.find('#input-ccDMarket').html(),
                    ccDManage: $this.find('#input-ccDManage').html(),
                    ccSchedule: $this.find('#input-ccSchedule').html(),
                    ccCondition: $this.find('#input-ccCondition').html(),
                    ccUsage: $this.find('#input-ccUsage').html(),
                    ccStatus: $this.find('#input-ccStatus').html(),
                    ccGoal: $this.find('#input-ccGoal').html(),
                    ccBasis: $this.find('#input-ccBasis').html(),
                    ccType: $this.find('input[name=input-type]:checked').val()
                },
                description: $this.find('#input-description').val(),
                college: $this.find('#input-college').val(),
                name: $this.find('#input-name').val(),
                dateStart: new Date($this.find('#input-dateStart').val()),
                dateEnd: new Date($this.find('#input-dateEnd').val()),
                dateUpdate: Date.now()
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

        editProjectModal.find('#new-ip').html5Validate(function () {
            var $this = $(this);
            var post = {
                _id: projectId,
                innovationProjectAttr: {
                    ipDetail: $this.find('#input-ipDetail').html(),
                    ipKeywords: $this.find('#input-ipKeywords').val(),
                    ipBasis: $this.find('#input-ipBasis').html(),
                    ipSchedule: $this.find('#input-ipSchedule').html(),
                    ipCondition: $this.find('#input-ipCondition').html(),
                    ipFund: $this.find('#input-ipFund').html()
                },
                description: $this.find('#input-description').val(),
                college: $this.find('#input-college').val(),
                name: $this.find('#input-name').val(),
                dateStart: new Date($this.find('#input-dateStart').val()),
                dateEnd: new Date($this.find('#input-dateEnd').val()),
                dateUpdate: Date.now()
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

    var selectTeamModal = $('#select-team');

    if (selectTeamModal.size() > 0) {
        selectTeamModal.on('show.bs.modal', function (e) {
            var selector = selectTeamModal.find('#selector');
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(selector)
            $.get(encodeURI('/api/get/team?leader=' + USER._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('暂未创建团队');
                } else {
                    selector.empty().hide();
                    for (var i = 0, j = data.length; i < j; i++) {
                        $('<div class="radio"><label><input type="radio" name="select-team" value="' + data[i]._id + '">' + data[i].name + '</label></div>').appendTo(selector);
                    }
                }
                selector.fadeIn(250)
            })
        })

        selectTeamModal.find('#submit').click(function () {
            selected = selectTeamModal.find('[name=select-team]:checked').val();
            if (selected) {
                var post = {
                    _id: projectId,
                    team: selected
                };
                $.ajax({
                    url: encodeURI('/api/post/select?action=apply&type=team'),
                    data: post,
                    type: 'POST',
                    success: function () {
                        selectTeamModal.hide();
                        notyFacade('申请成功，请等待教师确认', 'success');
                    },
                    error: function (XMLHttpRequest) {
                        if (XMLHttpRequest.status === 403) {
                            notyFacade('请勿重复选课', 'warning')
                        } else {
                            notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                        }
                    }

                });
            } else {
                notyFacade('请选择一个团队', 'warning')
            }

        })
    }
});