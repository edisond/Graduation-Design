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
            error: function (err) {
                if (err.status === 403) {
                    notyFacade('该用户尚未激活，请等待管理员审核', 'warning')
                } else {
                    notyFacade('用户名与密码不匹配', 'error')
                }
            }
        });
    });

    $('#admin-login').find('form').html5Validate(function () {
        var password = $(this).find('#input-admin-password').val();
        if (password !== '') {
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