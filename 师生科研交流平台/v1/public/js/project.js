$(document).ready(function () {

    var projectType = $('#projectType').val(),
        list = $('#list');

    function createProject(project) {
        var node = $('<div class="project">');
        var title = $('<h4>').appendTo(node);
        $('<a>').attr('href', '/project/' + project._id).html(project.name).appendTo(title);
        var subtitle = $('<small class="ml10">').html('指导教师：' + project.teacher.name).appendTo(title);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (new Date(project.dateStart) > Date.now()) {
            tag.addClass('label-success').html('未开始');
        } else if (new Date(project.dateStart) < Date.now() && new Date(project.dateEnd) > Date.now()) {
            tag.addClass('label-primary').html('进行中');
        } else if (new Date(project.dateEnd) < Date.now()) {
            tag.addClass('label-default').html('已结束');
        }
        $('<p class="text-muted">').html(project.description).appendTo(node);
        return node;
    };

    $.get('/api/get/project?type=' + projectType, function (data) {
        if (data.length === 0) {
            $('#load-state').html('暂无项目')
        } else {
            $('#load-state').hide();
            var teachers = [],
                lastUpdate = new Date(data[0].dateUpdate);

            data.sort(function (a, b) {
                return new Date(a.dateUpdate) < new Date(b.dateUpdate);
            });
            for (var i = 0, j = data.length; i < j; i++) {
                createProject(data[i]).appendTo(list);
                if (i < j - 1) {
                    $('<hr>').appendTo(list);
                }
                teachers.push(data[i].teacher['_id']);
                var temp = new Date(data[i].dateUpdate);
                if (temp > lastUpdate) {
                    lastUpdate = temp;
                }
            }
            $('#header-project-num').html(data.length);
            $('#header-teacher-num').html(teachers.unique().length);
            lastUpdate = moment(lastUpdate);
            $('#header-update-date').html(lastUpdate.fromNow());
        }
    })


    var model = $('#new-project'),
        form = model.find('#new-oe');
    if (form.size() === 1) {
        form.find(".input-append.date").datetimepicker({
            format: "yyyy-mm-dd",
            minView: 'month',
            autoclose: true,
            todayBtn: true,
            startDate: new Date(),
            pickerPosition: "bottom-left"
        });

        form.find('#input-source-1, #input-source-2, #input-source-3').click(function () {
            form.find('#input-source').attr('disabled', true);
        })
        form.find('#input-source-4').click(function () {
            form.find('#input-source').attr('disabled', false);
        })
        form.find('#input-result-1, #input-result-2, #input-result-3, #input-result-4').click(function () {
            form.find('#input-result').attr('disabled', true);
        })
        form.find('#input-result-5').click(function () {
            form.find('#input-result').attr('disabled', false);
        })
        model.find('#submit').click(function () {

            var post = {
                openExperimentAttr: {
                    detail: form.find('#input-detail').val(),
                    capacity: parseInt(form.find('#input-capacity').val()),
                    effort: parseInt(form.find('#input-effort').val()),
                    requirement: form.find('#input-requirement').val(),
                    object: form.find('#input-object').val(),
                    lab: form.find('#input-lab').val(),
                    source: form.find('#input-source-4').is(':checked') ? form.find('#input-source').val() : form.find('input[name=input-source]:checked').val(),
                    result: form.find('#input-result-5').is(':checked') ? form.find('#input-result').val() : form.find('input[name=input-result]:checked').val()
                },
                description: form.find('#input-description').val(),
                college: form.find('#input-college').val(),
                name: form.find('#input-name').val(),
                teacher: USER._id,
                dateStart: new Date(form.find('#input-dateStart').val()),
                dateEnd: new Date(form.find('#input-dateEnd').val()),
                type: '开放实验项目'
            };
            if (isNaN(post.openExperimentAttr.capacity) || isNaN(post.openExperimentAttr.effort) || post.college === '' || post.name === '' || post.dateStart === '' || post.dateEnd === '') {
                notyFacade('请填写表单各项，并在学生数与学时数中填写整数', 'warning');
            } else {
                $.ajax({
                    type: "POST",
                    url: "/api/post/project?action=new",
                    data: post,
                    success: function () {
                        notyFacade('成功创建开放实验项目', 'success');
                        model.modal('hide');
                        post.teacher = {
                            _id: USER._id,
                            name: USER.name
                        };
                        if (list.find('div.project').size() === 0) {
                            $('#load-state').hide();
                        } else {
                            $('<hr>').prependTo(list);
                        }
                        createProject(post).prependTo(list);
                        form[0].reset();
                    },
                    error: function () {
                        notyFacade('抱歉，产生了一个错误，请重试或刷新后重试', 'error');
                    }
                });
            }
        });
    }


})