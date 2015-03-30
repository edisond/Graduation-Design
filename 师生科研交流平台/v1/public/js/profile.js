$(document).ready(function () {

    var profile = {
            _id: $('#profile-_id').val(),
            type: $('#profile-type').val()
        },
        projectList = $('#projects'),
        teamList = $('#teams');

    function newProject(select) {
        var div = $('<div>');
        var title = $('<h4><a href="/project/' + select._id + '">' + select.name + '</a><small class="ml20">' + select.type + '</small></h4>').appendTo(div);
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

    function newTeam(team) {
        var div = $('<div class="team">');
        var title = $('<h4><a href="/team/' + team._id + '">' + team.name + '</a></h4>').appendTo(div);
        $('<small class="text-muted">' + team.desc + '</small>').appendTo(div);
        return div
    }

    $.get(encodeURI('/api/get/team?leader=' + profile._id + '&member=' + profile._id), function (data) {
        if (data.length === 0) {
            teamList.find('#load-state').html('暂未创建或加入团队')
        } else {
            teamList.find('#load-state').hide();
            for (var i = 0, j = data.length; i < j; i++) {
                newTeam(data[i]).appendTo(teamList);
                if (i < j - 1) {
                    $('<hr>').appendTo(teamList);
                }
            }
        }
    })

    if (profile.type === '老师') {
        $.get(encodeURI('/api/get/project?teacher=' + profile._id), function (data) {
            if (data.length === 0) {
                projectList.find('#load-state').html('暂无项目')
            } else {
                projectList.find('#load-state').hide();
                data.sort(function (a, b) {
                    return a.dateUpdate < b.dateUpdate
                });
                var oeNum = 0,
                    ccNum = 0,
                    ipNum = 0;
                for (var i = 0, j = data.length; i < j; i++) {
                    if (data[i].type === '开放实验项目') {
                        oeNum++;
                    } else if (data[i].type === '挑战杯项目') {
                        ccNum++;
                    } else if (data[i].type === '科技创新工程项目') {
                        ipNum++;
                    }
                    newProject(data[i]).appendTo(projectList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(projectList);
                    }
                }
                $('#oe-num').html(oeNum);
                $('#cc-num').html(ccNum);
                $('#ip-num').html(ipNum);
            }
        });
    } else {
        $.get(encodeURI('/api/get/select?active=true&student=' + profile._id), function (data) {
            if (data.length === 0) {
                projectList.find('#load-state').html('暂无选题')
            } else {
                var oeNum = 0,
                    ccNum = 0,
                    ipNum = 0;
                projectList.find('#load-state').hide();
                data.sort(function (a, b) {
                    return a.project.dateUpdate < b.project.dateUpdate
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    if (data[i].project.type === '开放实验项目') {
                        oeNum++;
                    } else if (data[i].project.type === '挑战杯项目') {
                        ccNum++;
                    } else if (data[i].project.type === '科技创新工程项目') {
                        ipNum++;
                    }
                    newProject(data[i].project).appendTo(projectList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(projectList);
                    }
                }
                $('#oe-num').html(oeNum);
                $('#cc-num').html(ccNum);
                $('#ip-num').html(ipNum);
            }
        });
    }
})