$(document).ready(function () {

    var list = $('#list'),
        teams = [];


    function createTeams(_teams) {
        list.empty().hide();
        if (_teams.length) {
            for (var i = 0, j = _teams.length; i < j; i++) {
                DOMCreator.team(_teams[i]).appendTo(list);
            }
        } else {
            var info = $('<span class="text-muted" id="load-state">没有符合条件的结果，点<a href="#">这里</a>重置</span>');
            info.find('a').click(function (e) {
                e.preventDefault();
                createTeams(teams);
            })
            info.appendTo(list.empty());
        }
        list.fadeIn(250);
    }

    function fetchTeams() {
        list.empty();
        var loadstate = $('<span class="text-muted" id="load-state"><i class="fa fa-spinner fa-spin"></i>&nbsp;加载中</span>').appendTo(list)
        $.get(encodeURI('/api/get/team'), function (data) {
            $('#header-team-num').html(data.length);
            if (data.length === 0) {
                loadstate.html('暂无团队');
                $('#header-update-date').html('等待更新');
            } else {
                teams = data;
                list.empty().hide();
                var lastUpdate = new Date(data[0].dateCreate);
                data.sort(function (a, b) {
                    return new Date(a.dateCreate) < new Date(b.dateCreate);
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.team(data[i]).appendTo(list);
                    var temp = new Date(data[i].dateCreate);
                    if (temp > lastUpdate) {
                        lastUpdate = temp;
                    }
                }
                list.fadeIn(250);
                lastUpdate = moment(lastUpdate);
                $('#header-update-date').html('更新于' + lastUpdate.fromNow());
            }
        })
    }

    fetchTeams();

    $('#input-search-in-result').keydown(function (e) {
        if (e.which === 13) {
            $('#search-in-result').click();
        }
    })

    $('#search-in-result').click(function () {
        var search = $('#input-search-in-result').val();
        if (search !== '') {
            var result = [];
            for (var i = 0, j = teams.length; i < j; i++) {
                if (teams[i].name.indexOf(search) >= 0 || teams[i].leader.name.indexOf(search) >= 0)
                    result.push(teams[i])
            }
            createTeams(result);
        }
    })
    $('#sort-by-date').click(function () {
        createTeams(teams.sort(function (a, b) {
            return new Date(a.dateCreate) < new Date(b.dateCreate)
        }));
    })

    $('#sort-by-name').click(function () {
        createTeams(teams.sort(function (a, b) {
            return a.name > b.name
        }));
    })

    $('#sort-by-leader').click(function () {
        createTeams(teams.sort(function (a, b) {
            return a.leader.name > b.leader.name
        }));
    })

    $('#new-team').find('form').html5Validate(function () {
        var $this = $(this);
        var post = {
            name: $this.find('#input-name').val(),
            desc: $this.find('#input-desc').val()
        }
        $.ajax({
            url: encodeURI('/api/post/team?action=new'),
            type: "POST",
            data: post,
            success: function (data) {
                notyFacade('创建成功', 'success');
                $('#new-team').modal('hide');
                fetchTeams();
                $this[0].reset();
            },
            error: function (XMLHttpRequest) {
                if (XMLHttpRequest.status === 403) {
                    notyFacade('你不能拥有超过5个团队', 'warning')
                } else {
                    notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error')
                }
            }
        })
    })
})