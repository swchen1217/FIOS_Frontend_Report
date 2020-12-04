function init() {
    $(".custom-file-input").change(function () {
        $('#upload_header').html($(".custom-file-input").val().split("\\").pop());
    });
}

function sent() {
    var m_class = $('#m_class').val();
    var m_number = $('#m_number').val();
    var m_name = $('#m_name').val();
    var m_date = $('#thedate').val();
    var m_manufacturer = $('#m_manufacturer').val();
    var m_dishNum = $('#m_dishNum').val();
    var file_data = $('#upload').prop('files')[0];
    if (m_class != '' && m_number != '' && m_name != '' && m_date != '' && m_manufacturer != '' && m_dishNum != '' && $("#upload").val().split("\\").pop() != "") {
        var form_data = new FormData();
        form_data.append('image', file_data);
        form_data.append('class', m_class);
        form_data.append('number', m_number);
        form_data.append('name', m_name);
        form_data.append('date', m_date);
        form_data.append('manufacturer', m_manufacturer);
        form_data.append('dishNum', m_dishNum);

        var responses = null;
        $.ajax({
            url: config['backend_URL'] + '/report/dish',
            data: form_data,
            type: 'POST',
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {

            },
            async: false,
            complete: function (xhr) {
                responses = xhr;
            }
        });
        console.log(responses);
        if (responses.status == 204) {
            ts('#thankyou').modal("show");
            return true;
        }
        if (Math.floor(responses.status / 100) == 5) {
            $.alert({
                title: '錯誤',
                content: '系統發生錯誤!!請聯繫管理員',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
        if (responses.status == 400) {
            $.alert({
                title: '錯誤',
                content: '上傳失敗!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
    } else {
        $.alert({
            title: '錯誤',
            content: '資料不完整！！請檢查是否有未填寫之欄位',
            type: 'red',
            typeAnimated: true
        });
        return false;
    }
}

function FormSubmitListener() {
    $('#form-HasToken').submit(function () {
        HideAlert();
        var getURl = new URL(location.href);
        if (!getURl.searchParams.has('token')) {
            location.replace("./index.html#ChangePW");
            return false;
        }
        var token = getURl.searchParams.get('token');
        var npw = $('#InputNewPw_f').val();
        var npwr = $('#InputNewPwRe_f').val();
        if (npw == "" || npwr == "") {
            $.alert({
                title: '錯誤',
                content: '新密碼或確認新密碼未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            var data = {token: token, new_pswd: npw};
            var res = request('POST', '/pswd/token', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '更改成功!!!', false, true);
                setTimeout(function () {
                    location.replace("./index.html#ChangePW");
                }, 2000);
            }
            if (res.code == 403) {
                if (res.data['error'] == 'Verify code expired') {
                    $.alert({
                        title: '錯誤',
                        content: 'Token過期!!請重新申請',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者錯誤',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
                if (res.data['error'] == 'The Token Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: 'Token錯誤!!請重新申請',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
            }
        }
        return false;
    });
}

function dishPhotoSubmitCheck() {
    if ($("#dish_photo_upload").val().split("\\").pop() != "")
        $('#dish_photo_URL').prop('disabled', true);
    else
        $('#dish_photo_URL').prop('disabled', false);
    if ($('#dish_photo_URL').val() != "")
        $('#dish_photo_upload').prop('disabled', true);
    else
        $('#dish_photo_upload').prop('disabled', false);
    if ($("#dish_photo_upload").val().split("\\").pop() != "" || $('#dish_photo_URL').val() != "")
        $("#btn_dish_photo_submit").prop('disabled', false);
    else
        $("#btn_dish_photo_submit").prop('disabled', true);
}