$(document).ready(function () {
    var commentList = $('#comments'),
        applyList = $('#applies'),
        selectList = $('#selects');

    function newComment(comment) {
        var media = $('<div class="media">'),
            mediaLeft = $('<div class="media-left">').appendTo(media),
            mediaBody = $('<div class="media-body">').appendTo(media),
            project = {};
        $('<a href="/profile/' + comment.from._id + '"><img src="' + comment.from.img + '" width="50px" height="50px"></a>').appendTo(mediaLeft);
        if (comment.openExperiment) {
            project._id = comment.openExperiment._id;
            project.name = comment.openExperiment.name;
            project.urlfix = 'open-experiment';
        } else if (comment.challengeCup) {
            project._id = comment.challengeCup._id;
            project.name = comment.challengeCup.name;
            project.urlfix = 'challenge-cup';
        } else if (comment.innovationProject) {
            project._id = comment.innovationProject._id;
            project.name = comment.innovationProject.name;
            project.urlfix = 'innovation-project';
        }
        $('<h5 class="media-heading"><a href="/profile/' + comment.from._id + '">' + comment.from.name + '</a>' + (comment.from.type === 'teacher' ? '老师' : '同学') + '在<a href="/' + project.urlfix + '/' + project._id + '">' + project.name + '</a>回复了我：</h5>').appendTo(mediaBody);

        $('<p>' + comment.body + '&nbsp;<a class="ml10" href="/' + project.urlfix + '/' + project._id + '" data-toggle="tooltip" title="回复"><i class="fa fa-reply"></i></a></p>').appendTo(mediaBody);
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;' + moment(comment.date).fromNow() + '</small>').appendTo(mediaBody);
        media.find('[data-toggle=tooltip]').tooltip();
        return media;
    }

    function newSelect(select) {
        var div = $('<div>');
        var title = $('<h4><a href="/' + select.projectType + '/' + select._id + '">' + select.name + '</a><small class="ml10">指导教师：' + select.teacher.name + '</h4>').appendTo(div);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (new Date(select.dateStart) > Date.now()) {
            tag.addClass('label-success').html('未开始');
        } else if (new Date(select.dateStart) < Date.now() && new Date(select.dateEnd) > Date.now()) {
            tag.addClass('label-primary').html('进行中');
        } else if (new Date(select.dateEnd) < Date.now()) {
            tag.addClass('label-default').html('已结束');
        }
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;更新于' + moment(select.dateUpdate).fromNow() + '</small>').appendTo(div);
        return div
    }

    function newApply(apply) {
        var div = $('<div>');
        var title = $('<h4><a href="/' + apply.projectType + '/' + apply._id + '">' + apply.name + '</a><small class="ml10">指导教师：' + apply.teacher.name + '</h4>').appendTo(div);
        var tag = $('<span class="label ml10">').appendTo(title);
        if (apply.active) {
            tag.addClass('label-success').html('已通过');
        } else {
            tag.addClass('label-primary').html('申请中');
        }
        $('<small class="text-muted"><i class="fa fa-clock-o"></i>&nbsp;更新于' + moment(apply.dateUpdate).fromNow() + '</small>').appendTo(div);
        return div
    }

    $.get('/api/get/comment?to=' + USER._id, function (data) {
        if (data.length === 0) {
            commentList.find('#load-state').html('暂无动态')
        } else {
            commentList.find('#load-state').hide();
            data.sort(function (a, b) {
                return a.date < b.date
            });
            for (var i = 0, j = data.length; i < j; i++) {
                newComment(data[i]).appendTo(commentList);
                if (i < j - 1) {
                    $('<hr>').appendTo(commentList);
                }
            }
        }

    })

    $.get('/api/get/project?select=' + USER._id, function (data) {
        if (data.length === 0) {
            selectList.find('#load-state').html('暂无选课')
        } else {
            selectList.find('#load-state').hide();
            data.sort(function (a, b) {
                return a.dateUpdate < b.dateUpdate
            });
            for (var i = 0, j = data.length; i < j; i++) {
                newSelect(data[i]).appendTo(selectList);
                if (i < j - 1) {
                    $('<hr>').appendTo(selectList);
                }
            }
        }
    });

    $.get('/api/get/project?apply=' + USER._id, function (data) {
        if (data.length === 0) {
            applyList.find('#load-state').html('暂无申请')
        } else {
            applyList.find('#load-state').hide();
            data.sort(function (a, b) {
                return a.dateUpdate < b.dateUpdate
            });
            for (var i = 0, j = data.length; i < j; i++) {
                newApply(data[i]).appendTo(applyList);
                if (i < j - 1) {
                    $('<hr>').appendTo(applyList);
                }
            }
        }
    });
})