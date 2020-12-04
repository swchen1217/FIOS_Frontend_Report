var config;
$.ajax({
    url: "./config.json",
    type: "POST",
    async: false,
    success: function (msg) {
        config=msg;
    },
    error: function (xhr) {
        console.log('ajax er');
        $.alert({
            title: '錯誤',
            content: 'Ajax 發生錯誤 (config)',
            type: 'red',
            typeAnimated: true
        });
    }
});