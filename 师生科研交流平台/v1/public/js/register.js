$(document).ready(function () {
    var register = $('#register');
    register.html5Validate(function () {
        var user = {
            id: register.find('#input-id').val(),
            name: register.find('#input-name').val(),
            password: register.find('#input-password').val(),
            confirm: register.find('#input-confirm-password').val(),
            type: register.find('#input-type-student').is(':checked') ? '同学' : '老师'
        };
        if (user.confirm !== user.password) {
            notyFacade('密码与确认密码不一致', 'warning');
        } else {
            delete user.confirm;
            user.password = md5(user.password);
            $.ajax({
                url: encodeURI('/api/post/user?action=new'),
                type: 'POST',
                data: user,
                success: function () {
                    notyFacade('申请注册成功，请等待管理员确认，3秒后返回主页', 'success');
                    setTimeout(function () {
                        window.location.href = '/'
                    }, 3000)
                },
                error: function () {
                    notyFacade('该学号/工号已被使用，如有疑问，请联系管理员', 'error');
                }
            })
        }
    })
})