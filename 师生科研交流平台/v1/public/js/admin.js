$(document).ready(function () {
    var newTeacherModel = $('#new-teacher'),
        newStudentModel = $('#new-student'),
        editTeacherModel = $('#edit-teacher'),
        editStudentModel = $('#edit-student'),
        deleteStudentModel = $('#delete-student'),
        deleteTeacherModel = $('#delete-teacher'),
        tableTeacher = $('#table-teacher'),
        tableStudent = $('#table-student'),
        changePasswordForm = $('#form-change-password');
    //init table teacher
    $('#table-teacher').on('init.dt', function () {
        $('#teacher-reg').html($(this).DataTable().data().length);
    }).dataTable({
        "ajax": {
            'url': '/api/get/teacher',
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
                "data": "department"
            },
            {
                "data": "title"
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
                "previous": "上一页",
                "next": "下一页"
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

    newTeacherModel.find('#submit').click(function () {
        var teacher = {
            id: newTeacherModel.find('#input-id').val(),
            name: newTeacherModel.find('#input-name').val(),
            password: newTeacherModel.find('#input-password').val(),
            department: newTeacherModel.find('#input-department').val(),
            title: newTeacherModel.find('#input-title').val()
        };
        if (teacher.id !== '' && teacher.password !== '') {
            if (!new RegExp("^[0-9]*$").test(teacher.id)) {
                notyFacade('工号必须由数字组成', 'warning');
                return false;
            } else {
                teacher.password = md5(teacher.password);
                $.ajax({
                    type: "POST",
                    url: "/api/post/new/teacher",
                    data: teacher,
                    success: function () {
                        newTeacherModel.modal('hide');
                        newTeacherModel.find('form')[0].reset();
                        tableTeacher.DataTable().row.add(teacher).draw();
                        notyFacade('添加成功', 'success');
                    },
                    error: function () {
                        notyFacade('该工号已存在', 'error');
                    }
                });
            }
        } else {
            notyFacade('工号与初始密码为必填项', 'warning');
        }
    });

    editTeacherModel.on('show.bs.modal', function (e) {
        var data = tableTeacher.DataTable().row($(e.relatedTarget).parents('tr')[0]).data();
        editTeacherModel.find('#input-id').val(data.id);
        editTeacherModel.find('#input-name').val(data.name);
        editTeacherModel.find('#input-department').val(data.department);
        editTeacherModel.find('#input-title').val(data.title);
    });

    editTeacherModel.find('#input-reset-password').click(function () {
        editTeacherModel.find('#input-password').attr('disabled', !$(this).is(':checked'));
    });

    editTeacherModel.find('#submit').click(function () {
        var teacher = {
                id: editTeacherModel.find('#input-id').val(),
                name: editTeacherModel.find('#input-name').val(),
                password: editTeacherModel.find('#input-password').val(),
                department: editTeacherModel.find('#input-department').val(),
                title: editTeacherModel.find('#input-title').val()
            },
            changePwd = editTeacherModel.find('#input-reset-password').is(':checked');
        if (teacher.id !== '') {
            if (changePwd && teacher.password === '') {
                notyFacade('若希望重置密码，则密码为必填项', 'warning');
                return false;
            } else {
                teacher.password = md5(teacher.password);
                $.ajax({
                    type: "POST",
                    url: "/api/post/update/teacher",
                    data: teacher,
                    success: function () {
                        editTeacherModel.modal('hide');
                        editTeacherModel.find('form')[0].reset();
                        tableTeacher.DataTable().ajax.reload(null, false);
                        notyFacade('编辑成功', 'success');
                    },
                    error: function () {
                        notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                    }
                });
            }
        } else {
            notyFacade('工号为必填项', 'warning');
            return false;
        }
    });

    deleteTeacherModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-teacher tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#delete-teacher-info').html('删除选中的教师记录？（共&nbsp;' + selectedNum + '&nbsp;条）');
        } else {
            notyFacade('您没有选中任何记录', 'information');
            return false;
        }

    });

    deleteTeacherModel.find('#submit').click(function () {
        var post = {
                id: []
            },
            data = tableTeacher.DataTable().rows('.active').data();
        for (var i = 0, j = data.length; i < j; i++) {
            post.id.push(data[i].id);
        }
        $.ajax({
            type: "POST",
            url: "/api/post/delete/teacher",
            data: post,
            success: function () {
                deleteTeacherModel.modal('hide');
                tableTeacher.DataTable().rows('.active').remove().draw(false);
                notyFacade('删除成功', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        });
    });

    //init table student
    $('#table-student').on('init.dt', function () {
        var studentReg = $(this).DataTable().data(),
            studentLength = studentReg.length,
            studentActive = 0;
        for (i = 0; i < studentLength; i++)
            if (studentReg[i].active) studentActive++;
        $('#student-reg').html(studentLength);
        $('#student-active').html(studentActive);
    }).dataTable({
        "ajax": {
            'url': '/api/get/student',
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
                "data": "grade"
            },
            {
                "data": "major"
            },
            {
                "data": "type"
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
                "previous": "上一页",
                "next": "下一页"
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

    newStudentModel.find('#submit').click(function () {
        var student = {
            id: newStudentModel.find('#input-id').val(),
            name: newStudentModel.find('#input-name').val(),
            password: newStudentModel.find('#input-password').val(),
            major: newStudentModel.find('#input-major').val(),
            grade: newStudentModel.find('#input-grade').val(),
            type: newStudentModel.find('#input-type').val(),
            active: newStudentModel.find('#input-active').is(':checked')
        };
        if (student.id !== '' && student.password !== '') {
            if (!new RegExp("^[0-9]*$").test(student.id)) {
                notyFacade('学号必须由数字组成', 'warning');
                return false;
            } else {
                student.password = md5(student.password);
                $.ajax({
                    type: "POST",
                    url: "/api/post/new/student",
                    data: student,
                    success: function () {
                        newStudentModel.modal('hide');
                        newStudentModel.find('form')[0].reset();
                        tableStudent.DataTable().row.add(student).draw();
                        notyFacade('添加成功', 'success');
                    },
                    error: function () {
                        notyFacade('该学号已存在', 'error');
                    }
                });
            }
        } else {
            notyFacade('学号与初始密码为必填项', 'warning');
        }
    });

    editStudentModel.on('show.bs.modal', function (e) {
        var data = tableStudent.DataTable().row($(e.relatedTarget).parents('tr')[0]).data();
        editStudentModel.find('#input-id').val(data.id);
        editStudentModel.find('#input-name').val(data.name);
        editStudentModel.find('#input-major').val(data.major);
        editStudentModel.find('#input-type').val(data.type);
        editStudentModel.find('#input-grade').val(data.grade);
        editStudentModel.find('#input-active').attr('checked', data.active);
    });

    editStudentModel.find('#input-reset-password').click(function () {
        editStudentModel.find('#input-password').attr('disabled', !$(this).is(':checked'));
    });

    editStudentModel.find('#submit').click(function () {
        var student = {
                id: editStudentModel.find('#input-id').val(),
                name: editStudentModel.find('#input-name').val(),
                password: editStudentModel.find('#input-password').val(),
                major: editStudentModel.find('#input-major').val(),
                type: editStudentModel.find('#input-type').val(),
                grade: editStudentModel.find('#input-grade').val(),
                active: editStudentModel.find('#input-active').is(':checked')
            },
            changePwd = editStudentModel.find('#input-reset-password').is(':checked');
        if (student.id !== '') {
            if (changePwd && student.password === '') {
                notyFacade('若希望重置密码，则密码为必填项', 'warning');
                return false;
            } else {
                student.password = md5(student.password);
                $.ajax({
                    type: "POST",
                    url: "/api/post/update/student",
                    data: student,
                    success: function () {
                        editStudentModel.modal('hide');
                        editStudentModel.find('form')[0].reset();
                        tableStudent.DataTable().ajax.reload(null, false);
                        notyFacade('编辑成功', 'success');
                    },
                    error: function () {
                        notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                    }
                });
            }
        } else {
            notyFacade('学号为必填项', 'warning');
            return false;
        }
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
                id: []
            },
            data = tableStudent.DataTable().rows('.active').data();
        for (var i = 0, j = data.length; i < j; i++) {
            post.id.push(data[i].id);
        }
        $.ajax({
            type: "POST",
            url: "/api/post/delete/student",
            data: post,
            success: function () {
                deleteStudentModel.modal('hide');
                tableStudent.DataTable().rows('.active').remove().draw(false);
                notyFacade('删除成功', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }
        });
    });

    changePasswordForm.find('#button-submit-password').click(function () {
        var originPassword = changePasswordForm.find('#input-orign-password').val(),
            newPassword = changePasswordForm.find('#input-new-password').val(),
            confirmPassword = changePasswordForm.find('#input-confirm-password').val();
        if (originPassword === '' || newPassword === '') {
            notyFacade('请输入原密码与新密码', 'warning');
            return false;
        } else if (newPassword !== confirmPassword) {
            notyFacade('输入的新密码与确认密码不匹配', 'warning');
        } else {
            var post = {
                op: md5(originPassword),
                np: md5(confirmPassword)
            }
            $.ajax({
                type: "POST",
                url: "/api/post/update/admin",
                data: post,
                success: function () {
                    changePasswordForm[0].reset();
                    notyFacade('修改成功', 'success');
                },
                error: function () {
                    changePasswordForm[0].reset();
                    notyFacade('原密码不正确，请重试', 'error');
                }
            })
        }
    });

    changePasswordForm.keypress(function (e) {
        if (e.which === 13) {
            changePasswordForm.find('#button-submit-password').click();
        }
    });

});