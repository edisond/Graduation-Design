$(document).ready(function () {

    function getRequest() {
        var url = location.search,
            request = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                request[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return request;
    }

    var request = getRequest(),
        list = $('#list'),
        searchInfo = $('#search-info');
    if (request) {
        if (request.q && request.q !== '') {
            var q = decodeURI(request.q),
                timestamp = Date.now();
            searchInfo.html('<i class="fa fa-spinner fa-spin"></i>');
            list.empty();
            var loadstate = $('<span class="text-muted" id="load-state">加载中</span>').appendTo(list)
            $.get(encodeURI('/api/get/project?q=' + q), function (data) {
                searchInfo.html('搜索<span class="text-theme">“' + q + '”</span>获得' + data.length + '个结果，耗时' + (Date.now() - timestamp) / 1000 + '秒');
                list.empty().hide();
                data.sort(function (a, b) {
                    return new Date(a.dateUpdate) < new Date(b.dateUpdate);
                });
                for (var i = 0, j = data.length; i < j; i++) {
                    DOMCreator.project(data[i]).appendTo(list);
                }
                list.fadeIn(250);
            })
        } else {
            searchInfo.html('在上方输入项目名并点击搜索')
        }
    }

})