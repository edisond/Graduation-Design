$(document).ready(function () {
    var commentList = $('#comments');

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

    $.get('/api/get/comment?to=' + USER._id, function (data) {
        if (data.length === 0) {
            $('#comments-state').html('暂无动态')
        } else {
            $('#comments-state').hide();
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
});