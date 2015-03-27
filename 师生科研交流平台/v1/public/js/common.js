moment.locale('zh-cn');

Array.prototype.unique = function () {
    var n = {},
        r = [];
    for (var i = 0; i < this.length; i++) {
        if (!n[this[i]]) {
            n[this[i]] = true;
            r.push(this[i]);
        }
    }
    return r;
}


if ($('#USERID').size() === 1) {
    var USER = {
        _id: $('#USERID').val(),
        name: $('#USERNAME').val(),
        type: $('#USERTYPE').val(),
        img: $('#USERIMG').val(),
    }
}

Array.prototype.contains = function (element) {
    for (var i = 0, j = this.length; i < j; i++) {
        if (this[i] === element) {
            return true;
        }
    }
    return false;
}

notyFacade = function (text, type) {
    noty({
        text: text,
        type: type,
        theme: 'relax',
        timeout: 3000,
        layout: 'topLeft',
        animation: {
            open: {
                opacity: 'toggle'
            },
            close: {
                opacity: 'toggle'
            },
            easing: 'swing',
            speed: 300
        }
    });
}

$(document).ready(function () {
    var nav = $('nav.navbar-static-top'),
        pathname = window.location.pathname;
    if (pathname.indexOf('/center') === 0) {
        nav.find('#nav-link-to-center').addClass('active');
    } else if (pathname.indexOf('/open-experiment') === 0) {
        nav.find('#nav-link-to-oe').addClass('active');
    } else if (pathname.indexOf('/challenge-cup') === 0) {
        nav.find('#nav-link-to-cc').addClass('active');
    } else if (pathname.indexOf('/innovation-project') === 0) {
        nav.find('#nav-link-to-ip').addClass('active');
    }
    nav.keypress(function (e) {
        if (e.which === 13) {
            nav.find('#nav-input-sub').click();
        }
    })
    nav.find('#nav-input-sub').click(function () {
        var post = {
            id: nav.find('#nav-input-id').val(),
            password: nav.find('#nav-input-pwd').val()
        };
        if (post.id === '' || post.pwd === '') {
            notyFacade('请输入学号/工号与密码', 'warning');
            return false;
        }
        post.password = md5(post.password);
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/signin"),
            data: post,
            success: function () {
                location.reload();
            },
            error: function () {
                notyFacade('用户名与密码不匹配', 'error')
            }
        });
    });
    nav.find('#nav-sign-out').click(function () {
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/signout"),
            success: function () {
                location.reload();
            }
        });
    });
    nav.find('#nav-input-admin').click(function () {
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
    $('[data-toggle="tooltip"]').tooltip();
})