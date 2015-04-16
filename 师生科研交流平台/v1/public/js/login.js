$(document).ready(function () {
    $('#login').html5Validate(function () {
        var $this = $(this);
        var post = {
            id: $this.find('#input-id').val(),
            password: md5($this.find('#input-pwd').val())
        };
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/signin"),
            data: post,
            success: function () {
                window.location.href = '/center';
            },
            error: function () {
                notyFacade('用户名与密码不匹配', 'error')
            }
        });
    });

    $('#login-admin').click(function () {
        var password = prompt('请输入管理员密码');
        if (password && password !== '') {
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/signin?type=admin"),
                data: {
                    password: md5(password)
                },
                success: function () {
                    window.location = '/admin';
                },
                error: function () {
                    notyFacade('密码错误', 'error')
                }
            });
        } else {
            return false;
        }
    });
});