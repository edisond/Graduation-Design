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
                DOMCreator.myProject(data[i]).appendTo(projectList);
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

    var deleteTeamModal = $('#delete-team'),
        updateTeamModal = $('#update-team'),
        exitTeamModal = $('#exit-team');
    if (deleteTeamModal.length) {
        deleteTeamModal.find('#submit').click(function () {
            var post = {
                _id: teamId
            };
            $.ajax({
                url: encodeURI('/api/post/team?action=delete'),
                data: post,
                type: 'POST',
                success: function () {
                    window.location.href = "/team";
                },
                error: function () {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        })
    }
    if (updateTeamModal.length) {
        updateTeamModal.find('form').html5Validate(function () {
            var $this = $(this);
            var post = {
                name: $this.find('#input-name').val(),
                desc: $this.find('#input-desc').val(),
                _id: teamId
            };
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/team?action=update"),
                data: post,
                success: function () {
                    window.location.reload()
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        })
    }
    if (exitTeamModal.length) {
        exitTeamModal.find('#submit').click(function () {
            var post = {
                _id: teamId
            };
            $.ajax({
                type: "POST",
                url: encodeURI("/api/post/teamapply?action=exit"),
                data: post,
                success: function () {
                    window.location.reload()
                },
                error: function () {
                    notyFacade('抱歉，产生了一个错误，请重试或刷新后重试', 'error');
                }
            });
        })
    }

})