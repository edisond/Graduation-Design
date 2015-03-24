$(document).ready(function () {
    $.get('/api/get/open-experiment', function (data) {
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
            if (new Date(data[i].dateEnd) < new Date()) {
                tag.addClass('label-default').html('已结束');
            } else if (data[i].select.length < data[i].capacity) {
                tag.addClass('label-success').html('可申请');
            } else if (data[i].select.length === data[i].capacity) {
                tag.addClass('label-primary').html('进行中');
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
    })

})