$(document).ready(function () {

    var projectType = $('#projectType').val(),
        list = $('#list');

    list.delegate('a[data-link="project"]', 'click', function (e) {
        if (!USER) {
            notyFacade('请先登录', 'information')
            return false
        }

    })

    function createProject(project) {
        var node = $('<div class="project">');
        var title = $('<h4>').appendTo(node);
        $('<a data-link="project">').attr('href', '/project/' + project._id).html(project.name).appendTo(title);
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

    $.get(encodeURI('/api/get/project?type=' + projectType), function (data) {
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
        formOE = model.find('#new-oe');

    if (formOE.size() > 0) {

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
                overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).css('margin-top', target.css('margin-top')).width(34).height(30);
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

        formOE.find('#input-detail').wysiwyg({
            toolbarSelector: '[data-target=#input-detail][data-role=editor-toolbar]'
        });
        formOE.find('#input-requirement').wysiwyg({
            toolbarSelector: '[data-target=#input-requirement][data-role=editor-toolbar]'
        });

        formOE.find(".input-append.date").datetimepicker({
            format: "yyyy-mm-dd",
            minView: 'month',
            autoclose: true,
            todayBtn: true,
            startDate: new Date(),
            pickerPosition: "bottom-left"
        });

        formOE.find('#input-source-1, #input-source-2, #input-source-3').click(function () {
            formOE.find('#input-source').attr('disabled', true);
        })
        formOE.find('#input-source-4').click(function () {
            formOE.find('#input-source').attr('disabled', false);
        })
        formOE.find('#input-result-1, #input-result-2, #input-result-3, #input-result-4').click(function () {
            formOE.find('#input-result').attr('disabled', true);
        })
        formOE.find('#input-result-5').click(function () {
            formOE.find('#input-result').attr('disabled', false);
        })
        formOE.html5Validate(function () {
            var post = {
                openExperimentAttr: {
                    detail: formOE.find('#input-detail').html(),
                    capacity: parseInt(formOE.find('#input-capacity').val()),
                    effort: parseInt(formOE.find('#input-effort').val()),
                    requirement: formOE.find('#input-requirement').html(),
                    object: formOE.find('#input-object').val(),
                    lab: formOE.find('#input-lab').val(),
                    source: formOE.find('#input-source-4').is(':checked') ? formOE.find('#input-source').val() : formOE.find('input[name=input-source]:checked').val(),
                    result: formOE.find('#input-result-5').is(':checked') ? formOE.find('#input-result').val() : formOE.find('input[name=input-result]:checked').val()
                },
                description: formOE.find('#input-description').val(),
                college: formOE.find('#input-college').val(),
                name: formOE.find('#input-name').val(),
                teacher: USER._id,
                dateStart: new Date(formOE.find('#input-dateStart').val()),
                dateEnd: new Date(formOE.find('#input-dateEnd').val()),
                type: '开放实验项目'
            };

            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/project?action=new"),
                data: post,
                success: function (data) {
                    notyFacade('成功创建开放实验项目', 'success');
                    model.modal('hide');
                    post._id = data;
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
                    formOE[0].reset();
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试。（请勿上传总大小超过1MB的图像）', 'error');
                }
            });
        });
    }


})