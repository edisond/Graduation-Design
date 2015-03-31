$(document).ready(function () {

    var profile = {
            _id: $('#profile-_id').val(),
            type: $('#profile-type').val()
        },
        projectList = $('#projects'),
        teamList = $('#teams');

    function fetchMyTeam() {
        teamList.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(teamList)
        $.get(encodeURI('/api/get/teamapply?user=' + profile._id), function (data) {
            if (data.length === 0) {
                loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无团队')
            } else {
                teamList.empty().hide();
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.myTeam(data[i], profile._id).appendTo(teamList);
                    if (i < j - 1) {
                        $('<hr>').appendTo(teamList);
                    }
                }
                teamList.fadeIn(250)
            }
        })
    }

    fetchMyTeam();

    if (profile.type === '老师') {
        function fetchProjects() {
            projectList.empty();
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectList);
            $.get(encodeURI('/api/get/project?teacher=' + profile._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无项目');
                    $('#oe-num').html(0);
                    $('#cc-num').html(0);
                    $('#ip-num').html(0);
                } else {
                    projectList.empty().hide();
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
                        DOMCreator.project(data[i]).appendTo(projectList);
                        if (i < j - 1) {
                            $('<hr>').appendTo(projectList);
                        }
                    }
                    projectList.fadeIn(250);
                    $('#oe-num').html(oeNum);
                    $('#cc-num').html(ccNum);
                    $('#ip-num').html(ipNum);
                }
            });
        }

        fetchProjects();
    } else {
        function fetchProjects() {
            projectList.empty();
            var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(projectList);
            $.get(encodeURI('/api/get/select?student=' + profile._id), function (data) {
                if (data.length === 0) {
                    loadstate.html('<i class="fa fa-frown-o"></i>&nbsp;暂无项目');
                    $('#oe-num').html(0);
                    $('#cc-num').html(0);
                    $('#ip-num').html(0);
                } else {
                    projectList.empty().hide();
                    data.sort(function (a, b) {
                        return a.project.dateUpdate < b.project.dateUpdate
                    });
                    var oeNum = 0,
                        ccNum = 0,
                        ipNum = 0;
                    for (var i = 0, j = data.length; i < j; i++) {
                        if (data[i].project.type === '开放实验项目') {
                            oeNum++;
                        } else if (data[i].project.type === '挑战杯项目') {
                            ccNum++;
                        } else if (data[i].project.type === '科技创新工程项目') {
                            ipNum++;
                        }
                        DOMCreator.myProject(data[i]).appendTo(projectList);
                        if (i < j - 1) {
                            $('<hr>').appendTo(projectList);
                        }
                    }
                    projectList.fadeIn(250);
                    $('#oe-num').html(oeNum);
                    $('#cc-num').html(ccNum);
                    $('#ip-num').html(ipNum);
                }

            })
        }

        fetchProjects();
    }
})