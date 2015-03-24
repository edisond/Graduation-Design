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

$(document).ready(function () {
    var nav = $('nav.navbar-static-top'),
        pathname = window.location.pathname;
    if (pathname.indexOf('/center') === 0) {
        nav.find('#nav-link-to-center').addClass('active');
    } else if (pathname.indexOf('/open-experiment') === 0) {
        nav.find('#nav-link-to-oe').addClass('active');
    } else if (pathname.indexOf('/cc') === 0) {
        nav.find('#nav-link-to-cc').addClass('active');
    } else if (pathname.indexOf('/ip') === 0) {
        nav.find('#nav-link-to-ip').addClass('active');
    }

    nav.loginType = 'student';

    nav.find('#nav-input-exchange').click(function () {
        var label = nav.find('label[for=nav-input-id]');
        if (nav.loginType === 'student') {
            label.fadeOut(250, function () {
                $(this).html('教师 工号').fadeIn(250);
            });
            nav.loginType = 'teacher';
        } else {
            label.fadeOut(250, function () {
                $(this).html('学生 学号').fadeIn(250);
            });
            nav.loginType = 'student';
        }
    });
    nav.keypress(function (e) {
        if (e.which === 13) {
            nav.find('#nav-input-sub').click();
        }
    })
    nav.find('#nav-input-sub').click(function () {
        var post = {
            id: nav.find('#nav-input-id').val(),
            pwd: nav.find('#nav-input-pwd').val()
        };
        if (post.id === '' || post.pwd === '') {
            notyFacade('请输入学号/工号与密码', 'warning');
            return false;
        }
        post.pwd = md5(post.pwd);
        $.ajax({
            type: "POST",
            url: "/api/post/signin?type=" + nav.loginType,
            data: post,
            success: function () {
                location.reload();
            },
            error: function () {
                notyFacade('用户名与密码不匹配，或' + (nav.loginType === 'student' ? '学生' : '教师') + '不存在', 'error')
            }
        });
    });
    nav.find('#nav-sign-out').click(function () {
        $.ajax({
            type: "POST",
            url: "/api/post/signout",
            success: function () {
                location.reload();
            }
        });
    });
    nav.find('#nav-input-admin').click(function () {
        var pwd = prompt('请输入管理员密码');
        if (pwd && pwd !== '') {
            $.ajax({
                type: "POST",
                url: "/api/post/signin?type=admin",
                data: {
                    pwd: md5(pwd)
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

    window.notyFacade = function (text, type) {
        noty({
            text: text,
            type: type,
            theme: 'relax',
            timeout: 3000,
            animation: {
                open: {
                    height: 'toggle'
                },
                close: {
                    height: 'toggle'
                },
                easing: 'swing',
                speed: 300
            }
        });
    }
})