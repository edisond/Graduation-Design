$(document).ready(function () {
    $.get('/api/get/open-experiment', function (data) {
        if (data.length === 0) {
            $('#load-state').html('暂无开放实验')
        } else {
            var teachers = [],
                lastUpdate = new Date(data[0].dateUpdate),
                list = $('#list');
            data.sort(function (a, b) {
                return new Date(a.dateUpdate) < new Date(b.dateUpdate);
            });
            for (var i = 0, j = data.length; i < j; i++) {
                var node = $('<div>');
                var title = $('<h4>').appendTo(node);
                $('<a>').attr('href', '/open-experiment/' + data[i]['_id']).html(data[i].name).appendTo(title);
                var subtitle = $('<small class="ml10">').html('指导教师：' + data[i].teacher.name).appendTo(title);
                var tag = $('<span class="label ml10">').appendTo(title);
                if (new Date(data[i].dateStart) > Date.now()) {
                    tag.addClass('label-success').html('未开始');
                } else if (new Date(data[i].dateStart) < Date.now() && new Date(data[i].dateEnd) > Date.now()) {
                    tag.addClass('label-primary').html('进行中');
                } else if (new Date(data[i].dateEnd) < Date.now()) {
                    tag.addClass('label-default').html('已结束');
                }
                $('<p class="text-muted">').html(data[i].detail).appendTo(node);
                node.appendTo(list);
                if (i < j - 1) {
                    $('<hr>').appendTo(list);
                }


                teachers.push(data[i].teacher['_id']);
                var temp = new Date(data[i].dateUpdate);
                if (temp > lastUpdate) {
                    lastUpdate = temp;
                }
            }
            $('#header-oe-num').html(data.length);
            $('#header-teacher-num').html(teachers.unique().length);
            lastUpdate = moment(lastUpdate);
            $('#header-oe-date').html(lastUpdate.fromNow());
        }


    })

})