$(document).ready(function () {

    var teamId = $('#team-_id').val(),
        teamMembers = $('#team-members'),
        projectList = $('#projects');

    $.get(encodeURI('/api/get/select?team=' + teamId), function (data) {
        if (data.length === 0) {
            projectList.find('#load-state').html('暂无选题')
        } else {
            projectList.find('#load-state').hide();
            data.sort(function (a, b) {
                return a.project.dateUpdate < b.project.dateUpdate
            });
            for (var i = 0, j = data.length; i < j; i++) {
                newProject(data[i]).appendTo(projectList);
            }
        }
    })


    function fetchTeamMembers() {
        teamMembers.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(teamMembers)
        $.get(encodeURI('/api/get/teamapply?team=' + teamId + '&active=true'), function (data) {
            if (data.length === 0) {
                loadstate.html('暂无同学加入');
            } else {
                teamMembers.empty().hide();
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.head(data[i].user).appendTo(teamMembers);
                }
                teamMembers.fadeIn(250);
            }
        })
    }

    fetchTeamMembers();

    $('#btn-apply').click(function () {
        var post = {
            _id: teamId
        };
        $.ajax({
            url: encodeURI('/api/post/teamapply?action=apply'),
            data: post,
            type: 'POST',
            success: function () {
                $('#btn-cancel-select').show();
                $('#btn-apply').hide();
                notyFacade('申请成功，请等待负责人确认', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }

        });
    })

    $('#btn-cancel-select').click(function () {
        var post = {
            _id: teamId
        };
        $.ajax({
            url: encodeURI('/api/post/teamapply?action=cancel'),
            data: post,
            type: 'POST',
            success: function () {
                $('#btn-apply').show();
                $('#btn-cancel-select').hide();
                notyFacade('已取消加入申请', 'success');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
            }

        });
    });
})