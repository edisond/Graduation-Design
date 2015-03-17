$(document).ready(function () {
    var nav = $('nav.navbar-static-top'),
        pathname = window.location.pathname;
    if (pathname.indexOf('/student/center') === 0) {
        nav.find('#nav-link-to-center').addClass('active');
    } else if (pathname.indexOf('/oe') === 0) {
        nav.find('#nav-link-to-oe').addClass('active');
    } else if (pathname.indexOf('/cc') === 0) {
        nav.find('#nav-link-to-cc').addClass('active');
    } else if (pathname.indexOf('/ip') === 0) {
        nav.find('#nav-link-to-ip').addClass('active');
    }

    nav.find('#nav-input-sub').click(function () {
        var post = {
            id: nav.find('#nav-input-id').val(),
            pwd: nav.find('#nav-input-pwd').val()
        };
        $.ajax({
            type: "POST",
            url: "/api/post/signin",
            data: post,
            success: function () {
                window.location = '/student/center';
            },
            error: function () {
                notyFacade('用户名与密码不匹配', 'error')
            }
        });
    });
    nav.find('#nav-sign-out').click(function () {
        $.ajax({
            type: "POST",
            url: "/api/post/signout",
            success: function () {
                window.location = '/';
            }
        });
    });
    nav.find('#nav-input-admin').click(function () {
        var pwd = prompt('请输入管理员密码');
        $.ajax({
            type: "POST",
            url: "/api/post/signin?type=admin",
            data: {
                pwd: pwd
            },
            success: function () {
                window.location = '/admin';
            },
            error: function () {
                notyFacade('密码错误', 'error')
            }
        });
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