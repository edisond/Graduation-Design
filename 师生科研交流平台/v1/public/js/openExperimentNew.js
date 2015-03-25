$(document).ready(function () {
    var form = $('#new-oe');
    $(".input-append.date").datetimepicker({
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
    form.find('#input-submit').click(function () {

        var post = {
            college: $('#input-college').val(),
            lab: $('#input-lab').val(),
            name: $('#input-name').val(),
            object: $('#input-object').val(),
            capacity: parseInt($('#input-capacity').val()),
            effort: parseInt($('#input-effort').val()),
            detail: $('#input-detail').val(),
            requirement: $('#input-requirement').val(),
            teacher: $('#input-teacher-id').val(),
            dateStart: new Date($('#input-dateStart').val()),
            dateEnd: new Date($('#input-dateEnd').val()),
            status: 'new',
            source: form.find('#input-source-4').is(':checked') ? form.find('#input-source').val() : form.find('input[name=input-source]:checked').val(),
            result: form.find('#input-result-5').is(':checked') ? form.find('#input-result').val() : form.find('input[name=input-result]:checked').val()
        };
        if (isNaN(post.capacity) || isNaN(post.effort) || post.college === '' || post.lab === '' || post.name === '' || post.object === '' || post.capacity === '' || post.effort === '' || post.detail === '' || post.requirement === '' || post.teacher === '' || post.dateStart === '' || post.dateEnd === '') {
            notyFacade('请填写表单各项，请在学生数与学时数中填写整数', 'warning');
        } else {
            $.ajax({
                type: "POST",
                url: "/api/post/open-experiment?action=new",
                data: post,
                success: function () {
                    setTimeout(function () {
                        location = '/open-experiment'
                    }, 2000)
                    notyFacade('成功创建开放实验，两秒后返回列表页', 'success');
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        }
    });
})