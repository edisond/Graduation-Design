$(document).ready(function () {
    var register = $('#register');

    $.get(encodeURI('/api/get/admin?email=true'), function (data) {
        if (data) {
            $('<a href="mailto:' + data.email + '">' + data.email + '</a>').appendTo($('#admin-email'))
        }
    })

    register.html5Validate(function () {
        var user = {
            id: register.find('#input-id').val(),
            name: register.find('#input-name').val(),
            password: md5(register.find('#input-password').val()),
            cap: register.find('#input-cap').val(),
            type: register.find('#input-type-student').is(':checked') ? '同学' : '老师'
        };
        $.ajax({
            url: encodeURI('/api/post/user?action=new'),
            type: 'POST',
            data: user,
            success: function () {
                $('#main-panel').hide();
                $('#success-panel').show();
            },
            error: function (error) {
                if (error.status === 406) {
                    notyFacade('验证码错误，请重新输入', 'warning');
                } else {
                    notyFacade('该学号/工号已被使用', 'error');
                }
            }
        })
    })

    register.find('#show-password').mouseenter(function () {
        register.find('#input-password').attr('type', 'text')
    })

    register.find('#show-password').mouseleave(function () {
        register.find('#input-password').attr('type', 'password')
    })
})