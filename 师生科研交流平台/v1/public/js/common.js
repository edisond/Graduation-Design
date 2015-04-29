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
        layout: 'top',
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

// $.fetchAvatars() <img data-email="test@email.com" data-target="gravatar" data-size="200px">
$.fn.fetchAvatar = function (options) {
    var settings = {
        url: 'http://gravatar.duoshuo.com/avatar/',
        rating: 'pg'
    };
    var options = $.extend(settings, options);
    return this.each(function () {
        var $this = $(this),
            hash = md5($this.data('email').toLowerCase()),
            size = $this.data('size') || "50px";
        $this.attr('src', options.url + hash + '?s=' + size + '&r=' + options.rating);
    });
}

var DOMCreator = {
    project: function (project) {
        var node = $('<div class="project">');
        var title = $('<h4>').appendTo(node);
        $('<a>').attr('href', '/project/' + project._id).html('<b>' + project.name + '</b>').appendTo(title);
        var tag = $('<span class="label ml10">').appendTo(title),
            dateStart = new Date(project.dateStart),
            dateEnd = new Date(project.dateEnd);
        if (!project.teacher) {
            tag.addClass('label-warning').html('寻求导师');
        } else if (dateStart > Date.now()) {
            tag.addClass('label-success').html('未开始');
        } else if (dateStart <= Date.now() && dateEnd >= Date.now()) {
            tag.addClass('label-primary').html('进行中');
        } else if (new Date(project.dateEnd) < Date.now()) {
            tag.addClass('label-default').html('已结束');
        }
        $('<p class="text-muted">').html(project.description).appendTo(node);
        $('<h6 class="mt20 text-muted"><i class="fa fa-street-view"></i>&nbsp;' + (project.teacher ? project.teacher.name : '暂无指导教师') + '<i class="fa fa-clock-o ml20"></i>&nbsp;更新于' + moment(project.dateUpdate).fromNow() + '</h6>').appendTo(node);
        return node;
    },

    myProject: function (select) {
        var div = $('<div class="project">');
        var title = $('<h4><a href="/project/' + select.project._id + '"><b>' + select.project.name + '</b></a></h4>').appendTo(div);
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
        $('<h6 class="mt20 text-muted"><i class="fa fa-tag"></i>&nbsp;' + select.project.type + '<i class="fa fa-clock-o ml20"></i>&nbsp;更新于' + moment(select.project.dateUpdate).fromNow() + '</h6>').appendTo(div);
        return div
    },

    myProjectT: function (project) {
        var div = $('<div class="project">');
        var title = $('<h4><a href="/project/' + project._id + '"><b>' + project.name + '</b></a></h4>').appendTo(div);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (new Date(project.dateStart) > Date.now()) {
            tag.addClass('label-success').html('未开始');
        } else if (new Date(project.dateStart) < Date.now() && new Date(project.dateEnd) > Date.now()) {
            tag.addClass('label-primary').html('进行中');
        } else if (new Date(project.dateEnd) < Date.now()) {
            tag.addClass('label-default').html('已结束');
        }
        $('<h6 class="mt20 text-muted"><i class="fa fa-tag"></i>&nbsp;' + project.type + '<i class="fa fa-clock-o ml20"></i>&nbsp;更新于' + moment(project.dateUpdate).fromNow() + '</h6>').appendTo(div);
        return div
    },

    comment: function (comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img data-email="' + comment.from.email + '" data-target="gravatar" data-size="50px" class="head head-sm"></a>').appendTo(mediaLeft);
        var heading = '';
        if (comment.to) {
            heading += '<p class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + comment.from.type + '</a>&nbsp;回复了&nbsp;<a href="/profile/' + comment.to._id + '">' + comment.to.name + comment.to.type + '</a>';
        } else {
            heading += '<p class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + comment.from.type + '</a>';
        }
        heading += '<span class="text-muted">&nbsp;&nbsp;&#8226;&nbsp;&nbsp;' + moment(comment.date).fromNow() + '</span></p>';
        heading = $(heading);
        heading.appendTo(mediaBody);
        $('<div class="comment-body">').html(comment.body).appendTo(mediaBody);
        $('<h6><a data-toggle="tooltip" title="回复" class="text-muted" href="#input-comment" data-id="' + comment.from._id + '" data-name="' + comment.from.name + '" data-type="' + comment.from.type + '"><i class="fa fa-reply"></i></a></h6>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        media.find('img[data-target=gravatar]').fetchAvatar();
        return media;
    },

    myComment: function (comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media);
        $('<a href="/profile/' + comment.from._id + '"><img data-email="' + comment.from.email + '" data-target="gravatar" data-size="50px" class="head head-sm"></a>').appendTo(mediaLeft);
        if (comment.project) {
            $('<p class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + comment.from.type + '</a>&nbsp;在&nbsp;<a href="/project/' + comment.project._id + '">' + comment.project.name + '</a>&nbsp;回复了我<span class="text-muted">&nbsp;&nbsp;&#8226;&nbsp;&nbsp;' + moment(comment.date).fromNow() + '</span></p>').appendTo(mediaBody);
            $('<div class="comment-body">').html(comment.body).appendTo(mediaBody);
            $('<h6><a href="/project/' + comment.project._id + '" data-toggle="tooltip" title="回复" class="text-muted"><i class="fa fa-reply"></i></a></h6>').appendTo(mediaBody);
        } else {
            $('<p class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + comment.from.type + '</a>&nbsp;对我说<span class="text-muted">&nbsp;&nbsp;&#8226;&nbsp;&nbsp;' + moment(comment.date).fromNow() + '</span></p>').appendTo(mediaBody);
            $('<div class="comment-body">').html(comment.body).appendTo(mediaBody);
            $('<h6><a href="/profile/' + comment.from._id + '" data-toggle="tooltip" title="回复" class="text-muted"><i class="fa fa-reply"></i></a></h6>').appendTo(mediaBody);
        }
        media.find('[data-toggle=tooltip]').tooltip();
        media.find('img[data-target=gravatar]').fetchAvatar();
        return media;
    },

    head: function (user) {
        var head = $('<a class="dinlineblock mr5 mt5" data-toggle="tooltip" data-placement="bottom" title="' + user.name + '" href="/profile/' + user._id + '"></a>');
        $('<img height="50px" width="50px" data-email="' + user.email + '" data-target="gravatar" data-size="50px"/>').fetchAvatar().appendTo(head);
        return head.tooltip();
    },

    team: function (team) {
        var div = $('<div class="project">');
        var title = $('<h4><a href="/team/' + team._id + '"><b>' + team.name + '</b></a></h4>').appendTo(div);
        $('<h6 class="mt20 text-muted"><i class="fa fa-user"></i>&nbsp;' + team.leader.name + '<i class="fa fa-clock-o ml20"></i>&nbsp;创建于' + moment(team.dateCreate).fromNow() + '</h6>').appendTo(div);
        return div
    },

    myTeam: function (apply, user_id) {
        var div = $('<div class="project">');
        var title = $('<h4><a href="/team/' + apply.team._id + '"><b>' + apply.team.name + '</b></a></h4>').appendTo(div);
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
        $('<h6 class="mt20 text-muted"><i class="fa fa-clock-o"></i>&nbsp;创建于' + moment(apply.team.dateCreate).fromNow() + '</h6>').appendTo(div);
        return div
    }
}

$.fn.extend({
    Wysiwyg: function (options) {
        return $(this).each(function () {
            var $this = $(this),
                defaults = {
                    imgBtn: true
                };
            var options = $.extend(options, defaults);
            var withImgBtn = typeof withImgBtn === 'undefined' ? true : withImgBtn;
            var toolbar = '<div class="btn-toolbar" data-role="editor-toolbar" data-target="#' + $this.attr('id') + '">';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" title="字体"><i class="fa fa-font"></i>&nbsp;<b class="caret"></b></a><ul class="dropdown-menu"></ul></div>';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" title="大小"><i class="fa fa-text-height"></i>&nbsp;<b class="caret"></b></a><ul class="dropdown-menu"><li><a data-edit="fontSize 5"><font size="5">大</font></a></li><li><a data-edit="fontSize 3"><font size="3">中</font></a></li><li><a data-edit="fontSize 1"><font size="1">小</font></a></li></ul></div>';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" title="颜色"><i class="fa fa-paint-brush"></i>&nbsp;<b class="caret"></b></a><ul class="dropdown-menu"><li><a data-edit="foreColor #000" style="color:#000">Default</a></li><li><a data-edit="foreColor #005d6c" style="color:#005d6c">JNU Green</a></li><li><a data-edit="foreColor #777" style="color:#777">Muted</a></li><li><a data-edit="foreColor #337ab7" style="color:#337ab7">Primary</a></li><li><a data-edit="foreColor #3c763d" style="color:#3c763d">Success</a></li><li><a data-edit="foreColor #31708f" style="color:#31708f">Info</a></li><li><a data-edit="foreColor #8a6d3b" style="color:#8a6d3b">Warning</a></li><li><a data-edit="foreColor #a94442" style="color:#a94442">Danger</a></li></ul></div>';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm" data-edit="bold" title="加粗 (Ctrl/Cmd+B)"><i class="fa fa-bold"></i></a><a class="btn btn-default btn-sm" data-edit="italic" title="斜体 (Ctrl/Cmd+I)"><i class="fa fa-italic"></i></a><a class="btn btn-default btn-sm" data-edit="strikethrough" title="删除线"><i class="fa fa-strikethrough"></i></a><a class="btn btn-default btn-sm" data-edit="underline" title="下划线 (Ctrl/Cmd+U)"><i class="fa fa-underline"></i></a></div>';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm" data-edit="insertunorderedlist" title="无序列表"><i class="fa fa-list-ul"></i></a><a class="btn btn-default btn-sm" data-edit="insertorderedlist" title="有序列表"><i class="fa fa-list-ol"></i></a><a class="btn btn-default btn-sm" data-edit="outdent" title="退格 (Shift+Tab)"><i class="fa fa-dedent"></i></a><a class="btn btn-default btn-sm" data-edit="indent" title="入格 (Tab)"><i class="fa fa-indent"></i></a></div>';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" title="超链接"><i class="fa fa-link"></i></a><div class="dropdown-menu input-append p10 minw250"><input class="form-control" placeholder="URL" type="text" data-edit="createLink" /><button class="btn btn-block btn-primary btn-sm mt5" type="button">添加</button><br/><p class="text-info"><i class="fa fa-info-circle"></i>&nbsp;<small>只接受以http://，https://或mailto:开头的链接地址</small></p></div></div>';
            toolbar += '<div class="btn-group"><a class="btn btn-default btn-sm" data-edit="undo" title="撤销 (Ctrl/Cmd+Z)"><i class="fa fa-undo"></i></a><a class="btn btn-default btn-sm" data-edit="redo" title="恢复 (Ctrl/Cmd+Y)"><i class="fa fa-repeat"></i></a></div>';
            toolbar += '</div>';
            toolbar = $(toolbar);

            var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'],
                fontTarget = toolbar.find('[title=字体]').siblings('.dropdown-menu');
            $.each(fonts, function (idx, fontName) {
                fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
            });

            toolbar.find('[title]').tooltip({
                container: 'body'
            });

            toolbar.find('.dropdown-menu input').click(function () {
                    return false;
                })
                .change(function () {
                    $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
                })
                .keydown('esc', function () {
                    this.value = '';
                    $(this).change();
                });
            toolbar.insertBefore($this);
            $this.wysiwyg({
                toolbarSelector: '[data-target=#' + $this.attr('id') + '][data-role=editor-toolbar]'
            });
        })
    }

});



$(document).ready(function () {

    var nav = $('nav.navbar-static-top'),
        navToolbar = $('.nav-toolbar'),
        pathname = window.location.pathname;

    if (pathname.indexOf('/center') === 0) {
        nav.find('#nav-link-to-center').addClass('active');
    } else if (pathname.indexOf('/open-experiment') === 0) {
        nav.find('#nav-link-to-oe').addClass('active');
    } else if (pathname.indexOf('/challenge-cup') === 0) {
        nav.find('#nav-link-to-cc').addClass('active');
    } else if (pathname.indexOf('/innovation-project') === 0) {
        nav.find('#nav-link-to-ip').addClass('active');
    } else if (pathname.indexOf('/team') === 0) {
        nav.find('#nav-link-to-team').addClass('active');
    } else if (pathname.indexOf('/support') === 0) {
        nav.find('#nav-link-to-support').addClass('active');
    }

    navToolbar.find('#input-search').keydown(function (e) {
        if (e.which === 13) {
            navToolbar.find('#nav-search').click()
        }
    })

    navToolbar.find('#nav-search').click(function () {
        var q = navToolbar.find('#input-search').val();
        if (q !== '') {
            window.location.href = "/search?q=" + q;
        }
    })

    navToolbar.find('#sign-out').click(function () {
        $.ajax({
            type: "POST",
            url: encodeURI("/api/post/signout"),
            success: function () {
                location.reload();
            }
        });
    });

    $('.captcha').click(function () {
        var $this = $(this);
        $.get(encodeURI('/api/get/captcha'), function (data) {
            $this.attr('src', data)
        })

    })

    function initBackToTop() {
        var btt = $('<a data-toggle="tooltip" title="返回顶部" id="back-to-top"><i class="fa fa-chevron-up"></i></a>"');
        btt.appendTo($('body')).click(function () {
            $('html,body').animate({
                scrollTop: 0
            }, 500);
        });

        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                btt.addClass('showme');
            } else {
                btt.removeClass('showme');
            }
        })
    }

    initBackToTop();

    $('[data-toggle="tooltip"]').tooltip();
    $('img[data-target="gravatar"]').fetchAvatar();

    $(function () {
        var selectList = $('[data-role=selector]');
        if (selectList.length) {
            $.get(encodeURI('/data/colleges.json'), function (data) {
                var data = data.data;
                selectList.each(function () {
                    var sCollege = $(this).find('select[data-bind=college]'),
                        sMajor = $(this).find('select[data-bind=major]'),
                        sCollegeSelected = sCollege.attr('selectedItem'),
                        sMajorSelected = sMajor.attr('selectedItem');

                    function college() {
                        var html = '<option value="">-- 请选择学院 --</option>';
                        for (var i = 0, j = data.length; i < j; i++) {
                            html += ('<option ' + (sCollegeSelected === data[i].name ? 'selected' : '') + '>' + data[i].name + '</option>');
                        }
                        sCollege.html(html);
                        major();
                    }

                    function major() {
                        if (sMajor.length) {
                            var html = '<option value="">-- 请选择专业 --</option>';
                            var n = sCollege[0].selectedIndex - 1;
                            if (n >= 0) {
                                for (var i = 0, j = data[n].majors.length; i < j; i++) {
                                    html += ('<option ' + (sMajorSelected === data[n].majors[i] ? 'selected' : '') + '>' + data[n].majors[i] + '</option>');
                                }
                            }
                            sMajor.html(html);
                        }
                    }
                    college();
                    sCollege.change(function () {
                        major();
                    })
                })
            })
        }
    })
})