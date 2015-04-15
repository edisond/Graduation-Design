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
                loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无动态')
            } else {
                commentList.empty().hide();
                data.sort(function (a, b) {
                    return a.date < b.date
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.myComment(data[i]).appendTo(commentList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(commentList);
                    }
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
                loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无团队')
            } else {
                teamList.empty().hide();
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.myTeam(data[i], USER._id).appendTo(teamList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(teamList);
                    }
                }
                teamList.fadeIn(250)
            }
        })
    }

    fetchComments();
    fetchMyTeam();



    if (typeof FileReader === 'undefined') {
        $('#lower-ie-warning').removeClass('hidden');
        $('#head-setting-preview-big, #head-setting-preview-small').hide();
        $('#submit-head').addClass('disabled');
    } else {

        $('#head-setting-preview-big, #head-setting-preview-small').attr('src', USER.img);

        $('#input-head').change(function () {
            var file = this.files[0];
            if (/^image\//.test(file.type)) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    $('#head-setting-preview-big, #head-setting-preview-small').attr('src', this.result);
                }
            } else {
                notyFacade('请上传图片类型文件', 'warning')
            }
        })

        $('#submit-head').click(function () {
            var file = $('#input-head')[0].files[0];
            if (/^image\//.test(file.type)) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var img = this.result,
                        post = {
                            _id: USER._id,
                            img: img
                        };
                    $.ajax({
                        url: encodeURI('/api/post/user?action=update'),
                        data: post,
                        type: 'POST',
                        success: function () {
                            $('a[href=#head-setting]').click();
                            notyFacade('修改成功，重新登录后生效', 'success')
                        },
                        error: function (XMLHttpRequest) {
                            notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试。（请勿上传大于1MB的头像）', 'error')
                        }
                    })
                }
            } else {
                notyFacade('请上传图片类型文件', 'warning')
            }
        })
    }

    if (USER.type === '老师') {
        var tableApply = $('#table-apply');

        function fetchTeacherProjects() {
            projectList.empty();
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectList);
            $.get(encodeURI('/api/get/project?teacher=' + USER._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无项目');
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
                        if (i < j - 1) {
                            $('<hr>').appendTo(projectList);
                        }
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
                        return row.team ? '<a href="/team/' + row.team._id + '" target="_blank"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-action="approve"><i class="fa fa-check"></i>&nbsp;通过</a><a class="ml20" href="#" data-id="' + data + '" data-action="reject"><i class="fa fa-times"></i>&nbsp;拒绝</a>' : '<a href="/profile/' + row.student._id + '" target="_blank"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-action="approve"><i class="fa fa-check"></i>&nbsp;通过</a><a class="ml20" href="#" data-id="' + data + '" data-action="reject"><i class="fa fa-times"></i>&nbsp;拒绝</a>';
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
                    _id: data._id,
                    date: Date.now,
                    active: false
                };
            $.ajax({
                url: encodeURI('/api/post/select?action=approve'),
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

    } else {


        var tableApply = $('#table-apply');

        function fetchProjects() {
            projectList.empty();
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectList);
            $.get(encodeURI('/api/get/select?student=' + USER._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无项目');
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
                        if (i < j - 1) {
                            $('<hr>').appendTo(projectList);
                        }
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
            "columns": [
                {
                    "data": "user.id"
            },
                {
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
                        return '<a href="/profile/' + row.user._id + '" target="_blank"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-action="approve"><i class="fa fa-check"></i>&nbsp;通过</a><a class="ml20" href="#" data-id="' + data + '" data-action="reject"><i class="fa fa-times"></i>&nbsp;拒绝</a>';
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

    setPasswordForm.html5Validate(function () {
        var post = {
            op: setPasswordForm.find('#input-orign-password').val(),
            np: setPasswordForm.find('#input-new-password').val(),
            cp: setPasswordForm.find('#input-confirm-password').val()
        };
        if (post.np !== post.cp) {
            notyFacade('新密码与确认密码不一致', 'warning')
        } else {
            delete post.cp;
            post.op = md5(post.op);
            post.np = md5(post.np);
            $.ajax({
                url: encodeURI('/api/post/user?action=pwd'),
                data: post,
                type: 'POST',
                success: function () {
                    $('a[href=#password-setting]').click();
                    setPasswordForm[0].reset();
                    notyFacade('修改成功', 'success')
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.status === 401) {
                        notyFacade('原密码错误', 'error')
                    } else {
                        notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error')
                    }
                }
            })
        }
    })

    $.get(encodeURI('/api/get/user?self=true'), function (data) {
        if (data.type === '老师') {
            setProfileForm.find('#input-id').val(data.id);
            setProfileForm.find('#input-email').val(data.email);
            setProfileForm.find('#input-phone').val(data.phone);
            setProfileForm.find('#input-sex').val(data.sex);
            setProfileForm.find('#input-name').val(data.name);
            setProfileForm.find('#input-department').attr('selectedItem', data.teacherAttr.department);
            setProfileForm.find('#input-title').val(data.teacherAttr.title);
        } else if (data.type === '同学') {
            setProfileForm.find('#input-id').val(data.id);
            setProfileForm.find('#input-email').val(data.email);
            setProfileForm.find('#input-phone').val(data.phone);
            setProfileForm.find('#input-sex').val(data.sex);
            setProfileForm.find('#input-name').val(data.name);
            setProfileForm.find('#input-college').attr('selectedItem', data.studentAttr.college);
            setProfileForm.find('#input-major').attr('selectedItem', data.studentAttr.major);
            setProfileForm.find('#input-grade').val(data.studentAttr.grade);
            setProfileForm.find('#input-type').val(data.studentAttr.studentType);
            setProfileForm.find('#input-address').val(data.studentAttr.address);
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

    $('#new-team').find('form').html5Validate(function () {
        var $this = $(this);
        var post = {
            name: $this.find('#input-name').val(),
            desc: $this.find('#input-desc').val()
        }
        $.ajax({
            url: encodeURI('/api/post/team?action=new'),
            type: "POST",
            data: post,
            success: function (data) {
                notyFacade('创建成功', 'success');
                $('#new-team').modal('hide');
                fetchMyTeam();
                $this[0].reset();
            },
            error: function (XMLHttpRequest) {
                if (XMLHttpRequest.status === 403) {
                    notyFacade('你不能拥有超过5个团队', 'warning')
                } else {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error')
                }
            }
        })
    })


})