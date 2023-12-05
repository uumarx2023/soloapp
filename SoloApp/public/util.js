function ajax_get(url, callback) {
    return $.ajax({
        url:url,
        type: 'GET',
        success: callback,
        error: ajax_error
    });
}

function ajax_post(url, data, callback) {
    return $.ajax({
        url:url,
        type: 'POST',
        data: data,
        success: callback,
        error: ajax_error
    });
}

function ajax_error(res) {
    alert(res.status + " " + res.responseText);
}