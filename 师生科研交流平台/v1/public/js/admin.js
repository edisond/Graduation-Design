$(document).ready(function () {
    var newTeacherModel = $('#new-teacher'),
        newStudentModel = $('#new-student'),
        editTeacherModel = $('#edit-teacher'),
        editStudentModel = $('#edit-student'),
        inactiveStudentModel = $('#inactive-student'),
        inactiveTeacherModel = $('#inactive-teacher'),
        deleteStudentModel = $('#delete-student'),
        deleteTeacherModel = $('#delete-teacher'),
        tableTeacher = $('#table-teacher'),
        tableStudent = $('#table-student');
    //init table teacher
    $('#table-teacher').dataTable({
        "ajax": {
            'url': encodeURI('/api/get/user?type=老师'),
            'dataSrc': '',
        },
        "columns": [
            {
                "data": "id",
                "searchable": false,
                "orderable": false,
                "width": '1px',
                'className': "text-center",
                'render': function (data, type, row) {
                    return '<input type="checkbox" data-action="select" data-id="' + data + '"/>';
                }
            },
            {
                "data": "id"
            },
            {
                "data": "name"
            },
            {
                "data": "sex",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "teacherAttr.department",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "teacherAttr.title",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "active",
                "width": '50px',
                'className': "text-center",
                "searchable": false,
                render: function (data, type, row) {
                    if (data)
                        return '<span class="hidden">true</span><i class="fa fa-check text-success"></i>';
                    return '<span class="hidden">false</span><i class="fa fa-times text-muted"></i>';

                }
            },
            {
                "data": "id",
                "searchable": false,
                "orderable": false,
                "width": '50px',
                'className': "text-center",
                'render': function (data, type, row) {
                    return '<a href="#" data-id="' + data + '" data-action="edit" data-toggle="modal" data-target="#edit-teacher"><i class="fa fa-edit"></i>&nbsp;编辑</a>';
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
                "previous": '<i class="fa fa-chevron-left"></i>',
                "next": '<i class="fa fa-chevron-right"></i>'
            }
        }
    });

    tableTeacher.delegate('tbody  input[data-action=select]', 'click', function () {
        $($(this).parents('tr')[0]).toggleClass('active');
    });

    $('#select-all-teacher').click(function () {
        tableTeacher.find('tbody  input[data-action=select]').not(':checked').click();
    });

    $('#deselect-all-teacher').click(function () {
        tableTeacher.find('tbody  input[data-action=select]:checked').click();
    });


    newTeacherModel.find('form').html5Validate(function () {
        var teacher = {
            type: '老师',
            id: newTeacherModel.find('#input-id').val(),
            name: newTeacherModel.find('#input-name').val(),
            password: md5(newTeacherModel.find('#input-password').val()),
            teacherAttr: {
                department: newTeacherModel.find('#input-department').val(),
                title: newTeacherModel.find('#input-title').val()
            },
            sex: newTeacherModel.find('#input-sex').val(),
            email: newTeacherModel.find('#input-email').val(),
            phone: newTeacherModel.find('#input-phone').val(),
            active: newTeacherModel.find('#input-active').is(':checked')
        };
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/user?action=new"),
            data: teacher,
            success: function () {
                newTeacherModel.modal('hide');
                newTeacherModel.find('form')[0].reset();
                tableTeacher.DataTable().row.add(teacher).draw();
                notyFacade('添加成功', 'success');
            },
            error: function () {
                notyFacade('该工号已被使用', 'error');
            }
        });
    });

    editTeacherModel.on('show.bs.modal', function (e) {
        var data = tableTeacher.DataTable().row($(e.relatedTarget).parents('tr')[0]).data();
        editTeacherModel.find('#input-_id').val(data._id);
        editTeacherModel.find('#input-id').val(data.id);
        editTeacherModel.find('#input-name').val(data.name);
        editTeacherModel.find('#input-department').val(data.teacherAttr ? data.teacherAttr.department : '');
        editTeacherModel.find('#input-title').val(data.teacherAttr ? data.teacherAttr.title : '');
        editTeacherModel.find('#input-sex').val(data.sex);
        editTeacherModel.find('#input-email').val(data.email);
        editTeacherModel.find('#input-phone').val(data.phone);
        editTeacherModel.find('#input-active').attr('checked', data.active);
    });

    editTeacherModel.find('#input-reset-password').click(function () {
        editTeacherModel.find('#input-password').attr('disabled', !$(this).is(':checked'));
    });

    editTeacherModel.find('form').html5Validate(function () {
        var teacher = {
                type: '老师',
                _id: editTeacherModel.find('#input-_id').val(),
                id: editTeacherModel.find('#input-id').val(),
                name: editTeacherModel.find('#input-name').val(),
                password: editTeacherModel.find('#input-password').val(),
                teacherAttr: {
                    department: editTeacherModel.find('#input-department').val(),
                    title: editTeacherModel.find('#input-title').val()
                },
                sex: editTeacherModel.find('#input-sex').val(),
                email: editTeacherModel.find('#input-email').val(),
                phone: editTeacherModel.find('#input-phone').val(),
                active: editTeacherModel.find('#input-active').is(':checked')
            },
            changePwd = editTeacherModel.find('#input-reset-password').is(':checked');
        if (changePwd && teacher.password === '') {
            notyFacade('若希望重置密码，则密码为必填项', 'warning');
        } else {
            if (changePwd) {
                teacher.password = md5(teacher.password);
            } else {
                delete teacher.password;
            }
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/user?action=update"),
                data: teacher,
                success: function () {
                    editTeacherModel.modal('hide');
                    editTeacherModel.find('form')[0].reset();
                    editTeacherModel.find('#input-password').attr('disabled', true);
                    tableTeacher.DataTable().ajax.reload(null, false);
                    notyFacade('保存成功', 'success');
                },
                error: function () {
                    notyFacade('该工号已被使用', 'error');
                }
            });
        }
    });

    inactiveTeacherModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-teacher tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#inactive-teacher-count').html(selectedNum);
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }
    });

    inactiveTeacherModel.find('#submit').click(function () {
        var post = {
                _id: []
            },
            data = tableTeacher.DataTable().rows('.active').data();

        for (var i = 0, j = data.length; i < j; i++) {
            post._id.push(data[i]._id);
        }
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/user?action=inactive"),
            data: post,
            success: function () {
                inactiveTeacherModel.modal('hide');
                tableTeacher.DataTable().ajax.reload(null, false);
                notyFacade('操作成功', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        });
    });

    deleteTeacherModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-teacher tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#delete-teacher-count').html(selectedNum);
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }
    });

    deleteTeacherModel.find('#submit').click(function () {
        var post = {
                _id: []
            },
            data = tableTeacher.DataTable().rows('.active').data();

        for (var i = 0, j = data.length; i < j; i++) {
            post._id.push(data[i]._id);
        }
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/user?action=delete"),
            data: post,
            success: function () {
                deleteTeacherModel.modal('hide');
                tableTeacher.DataTable().ajax.reload(null, false);
                notyFacade('操作成功', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        });
    });

    //init table student
    $('#table-student').dataTable({
        "ajax": {
            'url': encodeURI('/api/get/user?type=同学'),
            'dataSrc': '',
        },
        "columns": [
            {
                "data": "id",
                "searchable": false,
                "orderable": false,
                "width": '1px',
                'className': "text-center",
                'render': function (data, type, row) {
                    return '<input type="checkbox" data-action="select" data-id="' + data + '"/>';
                }
            },
            {
                "data": "id"
            },
            {
                "data": "name"
            },
            {
                "data": "sex",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "studentAttr.college",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "studentAttr.major",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "studentAttr.grade",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "studentAttr.studentType",
                'render': function (data, type, row) {
                    return data ? data : '';
                }
            },
            {
                "data": "active",
                "width": '50px',
                'className': "text-center",
                "searchable": false,
                render: function (data, type, row) {
                    if (data)
                        return '<span class="hidden">true</span><i class="fa fa-check text-success"></i>';
                    return '<span class="hidden">false</span><i class="fa fa-times text-muted"></i>';

                }
            },
            {
                "data": "id",
                "searchable": false,
                "orderable": false,
                "width": '50px',
                'className': "text-center",
                'render': function (data, type, row) {
                    return '<a href="#" data-id="' + data + '" data-action="edit" data-toggle="modal" data-target="#edit-student"><i class="fa fa-edit"></i>&nbsp;编辑</a>';
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
                "previous": '<i class="fa fa-chevron-left"></i>',
                "next": '<i class="fa fa-chevron-right"></i>'
            }
        }
    });
    tableStudent.delegate('tbody  input[data-action=select]', 'click', function () {
        $($(this).parents('tr')[0]).toggleClass('active');
    });
    $('#select-all-student').click(function () {
        tableStudent.find('tbody  input[data-action=select]').not(':checked').click();
    });
    $('#deselect-all-student').click(function () {
        tableStudent.find('tbody  input[data-action=select]:checked').click();
    });

    newStudentModel.find('form').html5Validate(function () {
        var student = {
            type: '同学',
            id: newStudentModel.find('#input-id').val(),
            name: newStudentModel.find('#input-name').val(),
            password: md5(newStudentModel.find('#input-password').val()),
            studentAttr: {
                major: newStudentModel.find('#input-major').val(),
                grade: newStudentModel.find('#input-grade').val(),
                studentType: newStudentModel.find('#input-type').val(),
                college: newStudentModel.find('#input-college').val(),
                address: newStudentModel.find('#input-address').val()
            },
            sex: newStudentModel.find('#input-sex').val(),
            email: newStudentModel.find('#input-email').val(),
            phone: newStudentModel.find('#input-phone').val(),
            active: newStudentModel.find('#input-active').is(':checked')
        };
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/user?action=new"),
            data: student,
            success: function () {
                newStudentModel.modal('hide');
                newStudentModel.find('form')[0].reset();
                tableStudent.DataTable().row.add(student).draw();
                notyFacade('添加成功', 'success');
            },
            error: function () {
                notyFacade('该学号已被使用', 'error');
            }
        });
    })

    editStudentModel.on('show.bs.modal', function (e) {
        var data = tableStudent.DataTable().row($(e.relatedTarget).parents('tr')[0]).data();
        editStudentModel.find('#input-_id').val(data._id);
        editStudentModel.find('#input-id').val(data.id);
        editStudentModel.find('#input-name').val(data.name);
        editStudentModel.find('#input-major').val(data.studentAttr ? data.studentAttr.major : '');
        editStudentModel.find('#input-type').val(data.studentAttr ? data.studentAttr.studentType : '');
        editStudentModel.find('#input-sex').val(data.sex);
        editStudentModel.find('#input-college').val(data.studentAttr ? data.studentAttr.college : '');
        editStudentModel.find('#input-grade').val(data.studentAttr ? data.studentAttr.grade : '');
        editStudentModel.find('#input-email').val(data.email);
        editStudentModel.find('#input-phone').val(data.phone);
        editStudentModel.find('#input-address').val(data.studentAttr ? data.studentAttr.address : '');
        editStudentModel.find('#input-active').attr('checked', data.active);
    });

    editStudentModel.find('#input-reset-password').click(function () {
        editStudentModel.find('#input-password').attr('disabled', !$(this).is(':checked'));
    });

    editStudentModel.find('form').html5Validate(function () {
        var student = {
                _id: editStudentModel.find('#input-_id').val(),
                type: '同学',
                id: editStudentModel.find('#input-id').val(),
                name: editStudentModel.find('#input-name').val(),
                password: editStudentModel.find('#input-password').val(),
                studentAttr: {
                    major: editStudentModel.find('#input-major').val(),
                    grade: editStudentModel.find('#input-grade').val(),
                    studentType: editStudentModel.find('#input-type').val(),
                    college: editStudentModel.find('#input-college').val(),
                    address: editStudentModel.find('#input-address').val()
                },
                sex: editStudentModel.find('#input-sex').val(),
                email: editStudentModel.find('#input-email').val(),
                phone: editStudentModel.find('#input-phone').val(),
                active: editStudentModel.find('#input-active').is(':checked')
            },
            changePwd = editStudentModel.find('#input-reset-password').is(':checked');
        if (changePwd && student.password === '') {
            notyFacade('若希望重置密码，则密码为必填项', 'warning');
            return false;
        } else {
            if (changePwd) {
                student.password = md5(student.password);
            } else {
                delete student.password;
            }
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/user?action=update"),
                data: student,
                success: function () {
                    editStudentModel.modal('hide');
                    editStudentModel.find('form')[0].reset();
                    editStudentModel.find('#input-password').attr('disabled', true);
                    tableStudent.DataTable().ajax.reload(null, false);
                    notyFacade('编辑成功', 'success');
                },
                error: function () {
                    notyFacade('该学号已被使用', 'error');
                }
            });
        }
    });

    inactiveStudentModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-student tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#inactive-student-count').html(selectedNum);
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }
    });

    inactiveStudentModel.find('#submit').click(function () {
        var post = {
                _id: []
            },
            data = tableStudent.DataTable().rows('.active').data();
        for (var i = 0, j = data.length; i < j; i++) {
            post._id.push(data[i]._id);
        }
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/user?action=inactive"),
            data: post,
            success: function () {
                inactiveStudentModel.modal('hide');
                tableStudent.DataTable().ajax.reload(null, false);
                notyFacade('操作成功', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        });
    });

    deleteStudentModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-student tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#delete-student-count').html(selectedNum);
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }
    });

    deleteStudentModel.find('#submit').click(function () {
        var post = {
                _id: []
            },
            data = tableStudent.DataTable().rows('.active').data();

        for (var i = 0, j = data.length; i < j; i++) {
            post._id.push(data[i]._id);
        }
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/user?action=delete"),
            data: post,
            success: function () {
                deleteStudentModel.modal('hide');
                tableStudent.DataTable().ajax.reload(null, false);
                notyFacade('操作成功', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        });
    });

    $('#password-setting').find('form').html5Validate(function () {
        var $this = $(this);
        var originPassword = $this.find('#input-orign-password').val(),
            newPassword = $this.find('#input-new-password').val(),
            confirmPassword = $this.find('#input-confirm-password').val();
        if (newPassword !== confirmPassword) {
            notyFacade('新密码与确认密码不一致', 'warning');
        } else {
            var post = {
                op: md5(originPassword),
                np: md5(confirmPassword)
            }
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/update/admin"),
                data: post,
                success: function () {
                    $('a[href=#password-setting]').click();
                    $this[0].reset();
                    notyFacade('修改成功，重新登录后生效', 'success');
                },
                error: function () {
                    $this[0].reset();
                    notyFacade('原密码不正确，请重试', 'error');
                }
            })
        }
    });

    $('#account-setting').find('form').html5Validate(function () {
        var $this = $(this);
        var post = {
            email: $this.find('#input-email').val()
        };
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/update/admin"),
            data: post,
            success: function () {
                $('a[href=#account-setting]').click();
                notyFacade('修改成功，重新登录后生效', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        })
    });

    $('#active-select-student').click(function () {
        var selectedNum = $('#table-student tbody>tr.active').size();
        if (selectedNum > 0) {
            var post = {
                    _id: []
                },
                data = tableStudent.DataTable().rows('.active').data();
            for (var i = 0, j = data.length; i < j; i++) {
                post._id.push(data[i]._id);
            }
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/user?action=active"),
                data: post,
                success: function () {
                    tableStudent.DataTable().ajax.reload(null, false);
                    notyFacade('操作成功', 'success');
                },
                error: function () {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }
    })

    $('#active-select-teacher').click(function () {
        var selectedNum = $('#table-teacher tbody>tr.active').size();
        if (selectedNum > 0) {
            var post = {
                    _id: []
                },
                data = tableTeacher.DataTable().rows('.active').data();
            for (var i = 0, j = data.length; i < j; i++) {
                post._id.push(data[i]._id);
            }
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/user?action=active"),
                data: post,
                success: function () {
                    tableTeacher.DataTable().ajax.reload(null, false);
                    notyFacade('操作成功', 'success');
                },
                error: function () {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }
    })

});