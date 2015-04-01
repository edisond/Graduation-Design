$(document).ready(function () {

    var projectType = $('#projectType').val(),
        list = $('#list');

    list.delegate('a', 'click', function (e) {
        if (!USER) {
            notyFacade('请先登录', 'information')
            return false
        }

    })

    function fetchProjecs() {
        list.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(list)
        $.get(encodeURI('/api/get/project?type=' + projectType), function (data) {
            if (data.length === 0) {
                loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无项目');
                $('#header-project-num').html('0');
                $('#header-teacher-num').html('0');
                $('#header-update-date').html('等待更新');
            } else {
                list.empty().hide();
                var teachers = [],
                    lastUpdate = new Date(data[0].dateUpdate);
                data.sort(function (a, b) {
                    return new Date(a.dateUpdate) < new Date(b.dateUpdate);
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.project(data[i]).appendTo(list);
                    if (i < j - 1) {
                        $('<hr>').appendTo(list);
                    }
                    if (!isNull(data[i].teacher)) {
                        teachers.push(data[i].teacher._id);
                    }
                    var temp = new Date(data[i].dateUpdate);
                    if (temp > lastUpdate) {
                        lastUpdate = temp;
                    }
                }
                list.fadeIn(250);
                $('#header-project-num').html(data.length);
                $('#header-teacher-num').html(teachers.unique().length);
                lastUpdate = moment(lastUpdate);
                $('#header-update-date').html('更新于' + lastUpdate.fromNow());
            }
        })
    }

    fetchProjecs();

    $('.wysiwyg-textarea').Wysiwyg()

    var model = $('#new-project'),
        formOE = model.find('#new-oe'),
        formCC = model.find('#new-cc'),
        formIP = model.find('#new-ip');

    model.find(".input-append.date").datetimepicker({
        format: "yyyy-mm-dd",
        minView: 'month',
        autoclose: true,
        todayBtn: true,
        startDate: new Date(),
        pickerPosition: "bottom-left"
    });

    if (formOE.size() > 0) {

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
                success: function () {
                    notyFacade('成功创建开放实验项目', 'success');
                    model.modal('hide');
                    fetchProjecs();
                    formOE[0].reset();
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试。（请勿上传总大小超过1MB的图像）', 'error');
                }
            });
        });
    } else if (formCC.size() > 0) {

        formCC.html5Validate(function () {
            var $this = $(this),
                post = {
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
                    type: '挑战杯项目'
                };
            if (USER.type === '老师') {
                post.teacher = USER._id
            } else {
                post.active = false;
            }

            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/project?action=new"),
                data: post,
                success: function () {
                    notyFacade('成功创建挑战杯项目', 'success');
                    model.modal('hide');
                    fetchProjecs();
                    $this[0].reset();
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试。（请勿上传总大小超过1MB的图像）', 'error');
                }
            });
        })

    }


})