$(document).ready(function () {

    var commentList = $('#comments'),
        projectList = $('#projects'),
        teamList = $('#teams'),
        setProfileForm = $('#account-setting').find('form'),
        setPasswordForm = $('#password-setting').find('form');

    switch (window.location.hash) {
    case '#news':
        $('#news').tab('show');
        break;
    case '#settings':
        $('#settings').tab('show');
        break;
    case '#project':
        $('#project').tab('show');
        break;
    case '#apply':
        $('#apply').tab('show');
        break;
    case '#team':
        $('#team').tab('show');
        break;
    }


    function fetchComments() {
        commentList.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(commentList)
        $.get(encodeURI('/api/get/comment?to=' + USER._id), function (data) {
            if (data.length === 0) {
                loadstate.html('暂无动态')
            } else {
                commentList.empty().hide();
                data.sort(function (a, b) {
                    return a.date < b.date
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.myComment(data[i]).appendTo(commentList);
                }
                commentList.fadeIn(250)
            }
        })
    }

    function fetchMyTeam() {
        teamList.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(teamList)
        $.get(encodeURI('/api/get/teamapply?user=' + USER._id), function (data) {
            if (data.length === 0) {
                loadstate.html('暂无团队')
            } else {
                teamList.empty().hide();
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.myTeam(data[i], USER._id).appendTo(teamList);
                }
                teamList.fadeIn(250)
            }
        })
    }

    fetchComments();
    fetchMyTeam();

    if (USER.type === '老师') {
        var tableApply = $('#table-apply');

        function fetchTeacherProjects() {
            projectList.empty();
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectList);
            $.get(encodeURI('/api/get/project?teacher=' + USER._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('暂无项目');
                    $('#oe-num').html(0);
                    $('#cc-num').html(0);
                    $('#ip-num').html(0);
                } else {
                    projectList.empty().hide();
                    data.sort(function (a, b) {
                        return a.dateUpdate < b.dateUpdate
                    });
                    var oeNum = 0,
                        ccNum = 0,
                        ipNum = 0;
                    for (var i = 0, j = data.length; i < j; i++) {
                        if (data[i].type === '开放实验项目') {
                            oeNum++;
                        } else if (data[i].type === '挑战杯项目') {
                            ccNum++;
                        } else if (data[i].type === '科技创新工程项目') {
                            ipNum++;
                        }
                        DOMCreator.myProjectT(data[i]).appendTo(projectList);
                    }
                    projectList.fadeIn(250);
                    $('#oe-num').html(oeNum);
                    $('#cc-num').html(ccNum);
                    $('#ip-num').html(ipNum);
                }
            });
        }

        fetchTeacherProjects();

        tableApply.dataTable({
            "ajax": {
                'url': encodeURI('/api/get/select?active=false&teacher=' + USER._id),
                'dataSrc': '',
            },
            "columns": [{
                    "data": "_id",
                    'render': function (data, type, row) {
                        return row.team ? '团队' : '学生'
                    }
                }, {
                    "data": "_id",
                    'render': function (data, type, row) {
                        return row.team ? row.team.name : row.student.name
                    }
                }, {
                    "data": "project.name"
                }, {
                    "data": "project.type"

                }, {
                    "data": "date",
                    'render': function (data, type, row) {
                        return moment(data).fromNow()
                    }
                }, {
                    "data": "_id",
                    "searchable": false,
                    "orderable": false,
                    "width": '200px',
                    'className': "text-center",
                    'render': function (data, type, row) {
                        return row.team ? '<a href="/team/' + row.team._id + '" target="_blank"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-toggle="modal" data-target="#approve-project-apply"><i class="fa fa-check"></i>&nbsp;通过</a><a class="ml20" href="#" data-id="' + data + '" data-toggle="modal" data-target="#reject-project-apply"><i class="fa fa-times"></i>&nbsp;拒绝</a>' : '<a href="/profile/' + row.student._id + '" target="_blank"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-toggle="modal" data-target="#approve-project-apply"><i class="fa fa-check"></i>&nbsp;通过</a><a class="ml20" href="#" data-id="' + data + '" data-toggle="modal" data-target="#reject-project-apply"><i class="fa fa-times"></i>&nbsp;拒绝</a>';
                    }
            }
        ],
            "language": {
                "lengthMenu": "每页显示 _MENU_ 条记录",
                "zeroRecords": "无记录",
                "info": "正在显示第 _PAGE_ 页，共 _PAGES_ 页",
                "infoEmpty": "无记录",
                "sSearch": "搜索",
                "infoFiltered": "(正从 _MAX_ 条记录中过滤)",
                "paginate": {
                    "previous": "<i class='fa fa-chevron-left'></i>",
                    "next": "<i class='fa fa-chevron-right'></i>"
                }
            }
        });

        $('#approve-project-apply').on('show.bs.modal', function (e) {
            var data = tableApply.DataTable().row($(e.relatedTarget).parents('tr')[0]).data(),
                $this = $(this),
                modalBody = $this.find('.modal-body').empty();
            $('<input type="hidden" value="' + data._id + '"/>').appendTo(modalBody);
            if (data.student) {
                modalBody.append($('<p>接收<a target="_blank" href="/profile/' + data.student._id + '">' + data.student.name + '</a>同学到项目<a target="_blank" href="/project/' + data.project._id + '">' + data.project.name + '</a><p>'));
            } else if (data.team) {
                modalBody.append($('<p>接收<a target="_blank" href="/team/' + data.team._id + '">' + data.team.name + '</a>团队到项目<a target="_blank" href="/project/' + data.project._id + '">' + data.project.name + '</a><p>'));
                modalBody.append($('<p class="text-info"><i class="fa fa-info-circle"></i>&nbsp;<small>其它团队对本项目的申请将失效</small></p>'));
            }
        }).find('button[type=submit]').click(function () {
            var $this = $('#approve-project-apply'),
                _id = $this.find('input[type=hidden]');
            if (_id.length) {
                var post = {
                    _id: _id.val(),
                    date: Date.now,
                    active: false
                };
                $.ajax({
                    url: encodeURI('/api/post/select?action=approve'),
                    type: 'POST',
                    data: post,
                    success: function () {
                        tableApply.DataTable().ajax.reload(null, false);
                        $this.modal('hide');
                        notyFacade('操作成功', 'success');
                    },
                    error: function () {
                        notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                    }
                })
            }
        })

        $('#reject-project-apply').on('show.bs.modal', function (e) {
            var data = tableApply.DataTable().row($(e.relatedTarget).parents('tr')[0]).data(),
                $this = $(this),
                modalBody = $this.find('.modal-body').empty();
            $('<input type="hidden" value="' + data._id + '"/>').appendTo(modalBody);
            if (data.student) {
                modalBody.append($('<p>拒绝<a target="_blank" href="/profile/' + data.student._id + '">' + data.student.name + '</a>同学对项目<a target="_blank" href="/project/' + data.project._id + '">' + data.project.name + '</a>的申请<p>'));
            } else if (data.team) {
                modalBody.append($('<p>拒绝<a target="_blank" href="/team/' + data.team._id + '">' + data.team.name + '</a>团队对项目<a target="_blank" href="/project/' + data.project._id + '">' + data.project.name + '</a>的申请<p>'));
            }
        }).find('button[type=submit]').click(function () {
            var $this = $('#reject-project-apply'),
                _id = $this.find('input[type=hidden]');
            if (_id.length) {
                var post = {
                    _id: _id.val()
                };
                $.ajax({
                    url: encodeURI('/api/post/select?action=reject'),
                    type: 'POST',
                    data: post,
                    success: function () {
                        tableApply.DataTable().ajax.reload(null, false);
                        $this.modal('hide');
                        notyFacade('操作成功', 'success');
                    },
                    error: function () {
                        notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                    }
                })
            }
        })


    } else if (USER.type === '同学') {


        var tableApply = $('#table-apply');

        function fetchProjects() {
            projectList.empty();
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectList);
            $.get(encodeURI('/api/get/select?student=' + USER._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('暂无项目');
                    $('#oe-num').html(0);
                    $('#cc-num').html(0);
                    $('#ip-num').html(0);
                } else {
                    projectList.empty().hide();
                    data.sort(function (a, b) {
                        return a.project.dateUpdate < b.project.dateUpdate
                    });
                    var oeNum = 0,
                        ccNum = 0,
                        ipNum = 0;
                    for (var i = 0, j = data.length; i < j; i++) {
                        if (data[i].project.type === '开放实验项目') {
                            oeNum++;
                        } else if (data[i].project.type === '挑战杯项目') {
                            ccNum++;
                        } else if (data[i].project.type === '科技创新工程项目') {
                            ipNum++;
                        }
                        DOMCreator.myProject(data[i]).appendTo(projectList);
                    }
                    projectList.fadeIn(250);
                    $('#oe-num').html(oeNum);
                    $('#cc-num').html(ccNum);
                    $('#ip-num').html(ipNum);
                }

            })
        }

        fetchProjects();

        tableApply.dataTable({
            "ajax": {
                'url': encodeURI('/api/get/teamapply?active=false&leader=' + USER._id),
                'dataSrc': '',
            },
            "columns": [{
                    "data": "user.name"
            }, {
                    "data": "user.type"
            },
                {
                    "data": "team.name"
            },
                {
                    "data": "_id",
                    "searchable": false,
                    "orderable": false,
                    "width": '200px',
                    'className': "text-center",
                    'render': function (data, type, row) {
                        return '<a href="/profile/' + row.user._id + '" target="_blank"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-action="approve"><i class="fa fa-check"></i>&nbsp;通过</a><a class="ml20" href="#" data-id="' + data + '" data-toggle="modal" data-target="#reject-team-apply"><i class="fa fa-times"></i>&nbsp;拒绝</a>';
                    }
            }
        ],
            "language": {
                "lengthMenu": "每页显示 _MENU_ 条记录",
                "zeroRecords": "无记录",
                "info": "正在显示第 _PAGE_ 页，共 _PAGES_ 页",
                "infoEmpty": "无记录",
                "sSearch": "搜索",
                "infoFiltered": "(正从 _MAX_ 条记录中过滤)",
                "paginate": {
                    "previous": "<i class='fa fa-chevron-left'></i>",
                    "next": "<i class='fa fa-chevron-right'></i>"
                }
            }
        });

        tableApply.delegate('a[data-action=approve]', 'click', function (e) {
            var row = $(e.target).parents('tr')[0],
                data = tableApply.DataTable().row(row).data(),
                post = {
                    team: data.team._id,
                    _id: data._id,
                    date: Date.now,
                    active: false
                };
            $.ajax({
                url: encodeURI('/api/post/teamapply?action=approve'),
                type: 'POST',
                data: post,
                success: function () {
                    tableApply.DataTable().row(row).remove().draw(false);
                    notyFacade('操作成功', 'success');
                },
                error: function () {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                }
            })
        });

    }

    $('#reject-team-apply').on('show.bs.modal', function (e) {
        var data = tableApply.DataTable().row($(e.relatedTarget).parents('tr')[0]).data(),
            $this = $(this),
            modalBody = $this.find('.modal-body').empty();
        $('<input type="hidden" value="' + data._id + '"/>').appendTo(modalBody);
        modalBody.append($('<p>拒绝<a target="_blank" href="/profile/' + data.user._id + '">' + data.user.name + '</a>' + data.user.type + '对团队<a target="_blank" href="/team/' + data.team._id + '">' + data.team.name + '</a>的申请<p>'));
    }).find('button[type=submit]').click(function () {
        var $this = $('#reject-team-apply'),
            _id = $this.find('input[type=hidden]');
        if (_id.length) {
            var post = {
                _id: _id.val()
            };
            $.ajax({
                url: encodeURI('/api/post/teamapply?action=reject'),
                type: 'POST',
                data: post,
                success: function () {
                    tableApply.DataTable().ajax.reload(null, false);
                    $this.modal('hide');
                    notyFacade('操作成功', 'success');
                },
                error: function () {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                }
            })
        }
    })

    setPasswordForm.html5Validate(function () {
        var $this = $(this);
        var post = {
            password: md5($this.find('#input-password').val())
        };
        $.ajax({
            url: encodeURI('/api/post/user?action=update'),
            data: post,
            type: 'POST',
            success: function () {
                $('a[href=#password-setting]').click();
                $this[0].reset();
                notyFacade('修改成功', 'success')
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error')
            }
        })
    })

    $.get(encodeURI('/api/get/user?self=true'), function (data) {
        if (data.type === '老师') {
            setProfileForm.find('#input-id').val(data.id);
            setProfileForm.find('#input-email').val(data.email);
            setProfileForm.find('#input-phone').val(data.phone);
            setProfileForm.find('#input-sex').val(data.sex);
            setProfileForm.find('#input-name').val(data.name);
            if (data.teacherAttr) {
                setProfileForm.find('#input-department').attr('selectedItem', data.teacherAttr.department);
                setProfileForm.find('#input-title').val(data.teacherAttr.title);
            }
        } else if (data.type === '同学') {
            setProfileForm.find('#input-id').val(data.id);
            setProfileForm.find('#input-email').val(data.email);
            setProfileForm.find('#input-phone').val(data.phone);
            setProfileForm.find('#input-sex').val(data.sex);
            setProfileForm.find('#input-name').val(data.name);
            if (data.studentAttr) {
                setProfileForm.find('#input-college').attr('selectedItem', data.studentAttr.college);
                setProfileForm.find('#input-major').attr('selectedItem', data.studentAttr.major);
                setProfileForm.find('#input-grade').val(data.studentAttr.grade);
                setProfileForm.find('#input-type').val(data.studentAttr.studentType);
                setProfileForm.find('#input-address').val(data.studentAttr.address);
            }
        }
    })

    setProfileForm.html5Validate(function () {
        var post = {
            _id: USER._id,
            id: setProfileForm.find('#input-id').val(),
            email: setProfileForm.find('#input-email').val(),
            phone: setProfileForm.find('#input-phone').val(),
            sex: setProfileForm.find('#input-sex').val(),
            name: setProfileForm.find('#input-name').val()
        }
        if (USER.type === '同学') {
            post.studentAttr = {
                college: setProfileForm.find('#input-college').val(),
                major: setProfileForm.find('#input-major').val(),
                grade: setProfileForm.find('#input-grade').val(),
                studentType: setProfileForm.find('#input-type').val(),
                address: setProfileForm.find('#input-address').val()
            }
        } else if (USER.type === '老师') {
            post.teacherAttr = {
                department: setProfileForm.find('#input-department').val(),
                title: setProfileForm.find('#input-title').val()
            }
        }
        $.ajax({
            url: encodeURI('/api/post/user?action=update'),
            data: post,
            type: 'POST',
            success: function () {
                $('a[href=#account-setting]').click();
                notyFacade('修改成功，重新登录后生效', 'success')
            },
            error: function (XMLHttpRequest) {
                notyFacade('该学号/工号已被使用', 'error')
            }
        })
    })

    setPasswordForm.find('#show-password').mouseenter(function () {
        setPasswordForm.find('#input-password').attr('type', 'text')
    })

    setPasswordForm.find('#show-password').mouseleave(function () {
        setPasswordForm.find('#input-password').attr('type', 'password')
    })

})