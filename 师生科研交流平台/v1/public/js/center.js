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


    }

    function newComment(comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img src="' + comment.from.img + '" class="head head-sm"></a>').appendTo(mediaLeft);
        $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + comment.from.type + '在<a href="/project/' + comment.project._id + '">' + comment.project.name + '</a>回复了我：</h5>').appendTo(mediaBody);
        $('<p>' + comment.body + '&nbsp;<a class="ml10" href="/project/' + comment.project._id + '" data-toggle="tooltip" title="回复"><i class="fa fa-reply"></i></a></p>').appendTo(mediaBody);
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;' + moment(comment.date).fromNow() + '</small>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        return media;
    }

    function newProject(select) {
        var div = $('<div>');
        var title = $('<h4><a href="/project/' + select._id + '">' + select.name + '</a><small class="ml20">' + select.type + '</small></h4>').appendTo(div);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (new Date(select.dateStart) > Date.now()) {
            tag.addClass('label-success').html('未开始');
        } else if (new Date(select.dateStart) < Date.now() && new Date(select.dateEnd) > Date.now()) {
            tag.addClass('label-primary').html('进行中');
        } else if (new Date(select.dateEnd) < Date.now()) {
            tag.addClass('label-default').html('已结束');
        }
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;更新于' + moment(select.dateUpdate).fromNow() + '</small>').appendTo(div);
        return div
    }

    $.get(encodeURI('/api/get/comment?to=' + USER._id), function (data) {
        if (data.length === 0) {
            commentList.find('#load-state').html('暂无动态')
        } else {
            commentList.find('#load-state').hide();
            data.sort(function (a, b) {
                return a.date < b.date
            });
            for (var i = 0, j = data.length; i < j; i++) {
                newComment(data[i]).appendTo(commentList);
                if (i < j - 1) {
                    $('<hr>').appendTo(commentList);
                }
            }
        }

    })

    function newTeam(team) {
        var div = $('<div class="team">');
        var title = $('<h4><a href="/team/' + team._id + '">' + team.name + '</a></h4>').appendTo(div);
        $('<small class="text-muted">' + team.desc + '</small>').appendTo(div);
        return div
    }

    $.get(encodeURI('/api/get/team?leader=' + USER._id + '&member=' + USER._id), function (data) {
        if (data.length === 0) {
            teamList.find('#load-state').html('暂未创建或加入团队')
        } else {
            teamList.find('#load-state').hide();
            for (var i = 0, j = data.length; i < j; i++) {
                newTeam(data[i]).appendTo(teamList);
                if (i < j - 1) {
                    $('<hr>').appendTo(teamList);
                }
            }
        }
    })

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

    console.log(typeof FileReader)

    if (USER.type === '老师') {
        var viewStudentModel = $('#view-select'),
            tableApply = $('#table-apply');


        $.get(encodeURI('/api/get/project?teacher=' + USER._id), function (data) {
            if (data.length === 0) {
                projectList.find('#load-state').html('暂无项目')
            } else {
                projectList.find('#load-state').hide();
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
                    newProject(data[i]).appendTo(projectList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(projectList);
                    }
                }
                $('#oe-num').html(oeNum);
                $('#cc-num').html(ccNum);
                $('#ip-num').html(ipNum);
            }
        });

        tableApply.dataTable({
            "ajax": {
                'url': encodeURI('/api/get/select?active=false&teacher=' + USER._id),
                'dataSrc': '',
            },
            "columns": [
                {
                    "data": "student.id"
            },
                {
                    "data": "student.name"
            }, {
                    "data": "student.type"
            },
                {
                    "data": "project.name"
            },
                {
                    "data": "project.type"
            },
                {
                    "data": "_id",
                    "searchable": false,
                    "orderable": false,
                    "width": '100px',
                    'className': "text-center",
                    'render': function (data, type, row) {
                        return '<a href="#" data-id="' + data + '" data-action="view" data-toggle="modal" data-target="#view-select"><i class="fa fa-eye"></i>&nbsp;查看</a><a class="ml20" href="#" data-id="' + data + '" data-action="approve"><i class="fa fa-check"></i>&nbsp;通过</a>';
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
                    "previous": "上一页",
                    "next": "下一页"
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

        viewStudentModel.on('show.bs.modal', function (e) {
            var $this = $(this),
                data = tableApply.DataTable().row($(e.relatedTarget).parents('tr')[0]).data();
            $this.find('#name').html(data.student.name);
            $('<small class="ml20">').html(data.student.id).appendTo($this.find('#name'));
            $this.find('#college').html(data.student.studentAttr.college);
            $this.find('#major').html(data.student.studentAttr.major);
            $this.find('#grade').html(data.student.studentAttr.grade);
            $this.find('#studentType').html(data.student.studentAttr.studentType);
            $this.find('#address').html(data.student.studentAttr.address);
            $this.find('#phone').html(data.student.phone);
            $this.find('#email').html(data.student.email);
            $this.find('#sex').html(data.student.sex);
        });

    } else {
        var applyList = $('#applies');

        function newApply(apply) {
            var div = $('<div>');
            var title = $('<h4><a href="/project/' + apply.project._id + '">' + apply.project.name + '</a><small class="ml20">' + apply.project.type + '</small></h4>').appendTo(div);
            var tag = $('<span class="label ml10">').appendTo(title);
            if (apply.active) {
                tag.addClass('label-success').html('已通过');
            } else {
                tag.addClass('label-primary').html('申请中');
            }
            $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;更新于' + moment(apply.project.dateUpdate).fromNow() + '</small>').appendTo(div);
            return div
        }

        $.get(encodeURI('/api/get/select?active=true&student=' + USER._id), function (data) {
            if (data.length === 0) {
                projectList.find('#load-state').html('暂无选题')
            } else {
                var oeNum = 0,
                    ccNum = 0,
                    ipNum = 0;
                projectList.find('#load-state').hide();
                data.sort(function (a, b) {
                    return a.project.dateUpdate < b.project.dateUpdate
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    if (data[i].project.type === '开放实验项目') {
                        oeNum++;
                    } else if (data[i].project.type === '挑战杯项目') {
                        ccNum++;
                    } else if (data[i].project.type === '科技创新工程项目') {
                        ipNum++;
                    }
                    newProject(data[i].project).appendTo(projectList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(projectList);
                    }
                }
                $('#oe-num').html(oeNum);
                $('#cc-num').html(ccNum);
                $('#ip-num').html(ipNum);
            }
        });

        $.get(encodeURI('/api/get/select?active=false&student=' + USER._id), function (data) {
            if (data.length === 0) {
                applyList.find('#load-state').html('暂无申请')
            } else {
                applyList.find('#load-state').hide();
                data.sort(function (a, b) {
                    return a.project.dateUpdate < b.project.dateUpdate
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    newApply(data[i]).appendTo(applyList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(applyList);
                    }
                }
            }
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
            setProfileForm.find('#input-department').val(data.teacherAttr.department);
            setProfileForm.find('#input-title').val(data.teacherAttr.title);
        } else if (data.type === '同学') {
            setProfileForm.find('#input-id').val(data.id);
            setProfileForm.find('#input-email').val(data.email);
            setProfileForm.find('#input-phone').val(data.phone);
            setProfileForm.find('#input-sex').val(data.sex);
            setProfileForm.find('#input-name').val(data.name);
            setProfileForm.find('#input-college').val(data.studentAttr.college);
            setProfileForm.find('#input-major').val(data.studentAttr.major);
            setProfileForm.find('#input-grade').val(data.studentAttr.grade);
            setProfileForm.find('#input-studentType').val(data.studentAttr.studentType);
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
                studentType: setProfileForm.find('#input-studentType').val(),
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

    $('button[data-target=#new-team]').click(function () {
        if (USER.type === '老师') {
            notyFacade('只有学生可以作为团队负责人（创建团队）。', 'information')
        }
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
                post._id = data;
                if (teamList.find('div.team').size() === 0) {
                    teamList.find('#load-state').hide();
                } else {
                    $('<hr>').prependTo(teamList);
                }
                newTeam(post).prependTo(teamList);
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