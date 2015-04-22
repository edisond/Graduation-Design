$(document).ready(function () {
    $.get(encodeURI('/api/get/admin?email=true'), function (data) {
        if (data) {
            $('<a href="mailto:' + data.email + '">' + data.email + '</a>').appendTo($('#admin-email'))
        }
    })

    $('#support').html5Validate(function () {
        var $this = $(this),
            submitBtn = $this.find('button[type=submit]'),
            support = {
                name: $this.find('#input-name').val(),
                email: $this.find('#input-email').val(),
                title: $this.find('#input-title').val(),
                body: $this.find('#input-body').val(),
                type: $this.find('input[name=input-type]:checked').val()
            };
        submitBtn.attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i>&nbsp;&nbsp;处理中');
        $.ajax({
            url: encodeURI('/api/post/email?to=author'),
            type: 'POST',
            data: support,
            success: function () {
                $('#wtire-support').hide();
                $('#success').show();
                $this[0].reset();
                submitBtn.attr('disabled', false).html('提交');
            },
            error: function () {
                notyFacade('抱歉，系统产生了一个错误，请重试或刷新后重试', 'error');
                submitBtn.attr('disabled', false).html('提交');
            }
        })
    })

    $('#write-again').click(function (e) {
        $('#success').hide();
        $('#wtire-support').show();
        e.preventDefault();
    })
})