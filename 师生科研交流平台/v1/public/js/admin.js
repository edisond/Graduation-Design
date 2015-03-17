$(document).ready(function () {
    var newTeacherModel = $('#new-teacher'),
        deleteTeacherModel = $('#delete-teacher'),
        newStudentModel = $('#new-student'),
        deleteStudentModel = $('#delete-student'),
        tableTeacher = $('#table-teacher'),
        tableStudent = $('#table-student');
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

    $('#table-teacher tbody').on('click', 'tr', function () {
        $(this).toggleClass('active');
    });
    $('#select-all-teacher').click(function () {
        $('#table-teacher tbody>tr').addClass('active');
    });
    $('#deselect-all-teacher').click(function () {
        $('#table-teacher tbody>tr').removeClass('active');
    });

    newTeacherModel.find('#submit').click(function () {
        var teacher = {
            id: newTeacherModel.find('#input-id').val(),
            name: newTeacherModel.find('#input-name').val(),
            pwd: newTeacherModel.find('#input-passowrd').val(),
            department: newTeacherModel.find('#input-department').val(),
            title: newTeacherModel.find('#input-title').val()
        };
        if (teacher.id && teacher.pwd) {
            if (!new RegExp("^[0-9]*$").test(teacher.id)) {
                notyFacade('工号必须由数字组成', 'warning');
                return false;
            } else {
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

    deleteTeacherModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-teacher tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#delete-teacher-count').html(selectedNum);
        } else {
            notyFacade('您没有选中任何记录');
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
                render: function (data, type, row) {
                    if (data)
                        return '<span class="hidden">true</span><i class="fa fa-check text-success"></i>';
                    return '<span class="hidden">false</span><i class="fa fa-times text-muted"></i>';

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
    $('#table-student tbody').on('click', 'tr', function () {
        $(this).toggleClass('active');
    });
    $('#select-all-student').click(function () {
        $('#table-student tbody>tr').addClass('active');
    });
    $('#deselect-all-student').click(function () {
        $('#table-student tbody>tr').removeClass('active');
    });

    newStudentModel.find('#submit').click(function () {
        var student = {
            id: newStudentModel.find('#input-id').val(),
            name: newStudentModel.find('#input-name').val(),
            pwd: newStudentModel.find('#input-passowrd').val(),
            major: newStudentModel.find('#input-major').val(),
            grade: newStudentModel.find('#input-grade').val(),
            type: newStudentModel.find('#input-type').val(),
            active: newStudentModel.find('#input-active').is(':checked')
        };
        if (student.id && student.pwd) {
            if (!new RegExp("^[0-9]*$").test(student.id)) {
                notyFacade('学号必须由数字组成', 'warning');
                return false;
            } else {
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

    deleteStudentModel.on('show.bs.modal', function (e) {
        var selectedNum = $('#table-student tbody>tr.active').size();
        if (selectedNum !== 0) {
            $(this).find('#delete-student-count').html(selectedNum);
        } else {
            notyFacade('您没有选中任何记录');
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
});