$(document).ready(function () {
    $.get('/api/get/open-experiment', function (data) {
        var teachers = [],
            lastUpdate = new Date(data[0].updateDate),
            list = $('#list');
        for (var i = 0; i < data.length; i++) {
            var node = $('<div>');
            teachers.push(data[i].teacher);
            var temp = new Date(data[i].updateDate);
            if (temp > lastUpdate) {
                lastUpdate = temp;
            }
        }
        $('#header-oe-num').html(data.length);
        $('#header-teacher-num').html(teachers.unique().length);
        $('#header-oe-date').html(lastUpdate.toLocaleDateString());
    })

})