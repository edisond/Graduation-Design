moment.locale('zh-cn');

if ($('#USERID').size() === 1) {
    var USER = {
        _id: $('#USERID').val(),
        name: $('#USERNAME').val(),
        type: $('#USERTYPE').val(),
        img: $('#USERIMG').val(),
    }
}

function isNull(object) {
    return !object && typeof (object) !== "undefined" && object !== 0
}

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

var DOMCreator = {
    project: function (project) {
        var node = $('<div>');
        var title = $('<h4>').appendTo(node);
        $('<a>').attr('href', '/project/' + project._id).html(project.name).appendTo(title);
        var subtitle = $('<small class="ml10">').html('指导教师：' + project.teacher.name).appendTo(title);
        var tag = $('<span class="label ml10">').appendTo(title),
            dateStart = new Date(project.dateStart),
            dateEnd = new Date(project.dateEnd);
        if (dateStart > Date.now()) {
            tag.addClass('label-success').html('未开始');
        } else if (dateStart <= Date.now() && dateEnd >= Date.now()) {
            tag.addClass('label-primary').html('进行中');
        } else if (new Date(project.dateEnd) < Date.now()) {
            tag.addClass('label-default').html('已结束');
        }
        $('<p class="text-muted">').html(project.description).appendTo(node);
        return node;
    },

    myProject: function (select) {
        var div = $('<div>');
        var title = $('<h4><a href="/project/' + select.project._id + '">' + select.project.name + '</a><small class="ml20">' + select.project.type + '</small></h4>').appendTo(div);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (select.active) {
            if (new Date(select.project.dateStart) > Date.now()) {
                tag.addClass('label-success').html('未开始');
            } else if (new Date(select.project.dateStart) < Date.now() && new Date(select.project.dateEnd) > Date.now()) {
                tag.addClass('label-primary').html('进行中');
            } else if (new Date(select.project.dateEnd) < Date.now()) {
                tag.addClass('label-default').html('已结束');
            }
        } else {
            tag.addClass('label-warning').html('申请中');
        }
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;更新于' + moment(select.project.dateUpdate).fromNow() + '</small>').appendTo(div);
        return div
    },

    comment: function (comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img src="' + comment.from.img + '" class="head head-sm"></a>').appendTo(mediaLeft);
        if (comment.to) {
            $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + comment.from.type + '回复了<a href="/profile/' + comment.to._id + '">' + comment.to.name + '</a>' + comment.to.type + '：</h5>').appendTo(mediaBody);
        } else {
            $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + comment.from.type + '说：</h5>').appendTo(mediaBody);
        }
        $('<p>' + comment.body + '&nbsp;<a href="#input-comment" data-toggle="tooltip" title="回复" class="ml10" data-id="' + comment.from._id + '" data-name="' + comment.from.name + '" data-type="' + comment.from.type + '"><i class="fa fa-reply"></i></a></p>').appendTo(mediaBody);
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;' + moment(comment.date).fromNow() + '</small>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        return media;
    },

    myComment: function (comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img src="' + comment.from.img + '" class="head head-sm"></a>').appendTo(mediaLeft);
        $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + comment.from.type + '在<a href="/project/' + comment.project._id + '">' + comment.project.name + '</a>回复了我：</h5>').appendTo(mediaBody);
        $('<p>' + comment.body + '&nbsp;<a class="ml10" href="/project/' + comment.project._id + '" data-toggle="tooltip" title="回复"><i class="fa fa-reply"></i></a></p>').appendTo(mediaBody);
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;' + moment(comment.date).fromNow() + '</small>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        return media;
    },

    head: function (user) {
        var head = $('<a class="dinlineblock mr5 mt5" data-toggle="tooltip" data-placement="bottom" title="' + user.name + '" href="/profile/' + user._id + '"></a>');
        $('<img height="50px" width="50px" src="' + user.img + '"/>').appendTo(head);
        return head.tooltip();
    },

    myTeam: function (apply, user_id) {
        var div = $('<div>');
        var title = $('<h4><a href="/team/' + apply.team._id + '">' + apply.team.name + '</a></h4>').appendTo(div);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (apply.active) {
            if (apply.team.leader === user_id) {
                tag.addClass('label-success').html('负责人');
            } else {
                tag.addClass('label-primary').html('团员');
            }
        } else {
            tag.addClass('label-warning').html('申请中');
        }
        $('<small class="text-muted">' + apply.team.desc + '</small>').appendTo(div);
        return div
    }


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