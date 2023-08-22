$(document).ready(function () {
    const toastLiveExample = $('#liveToast');
    console.log(toastLiveExample);
    $('#liveToastBtn').click(() => {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/user/logout',
        })
            .done((data) => {
                console.log(data.message);
                const toast = new bootstrap.Toast('#liveToast');
                $('.toast-body').html(data.message);
                console.log(toast);
                toast.show();
            })
            .fail((error) => {
                console.error('Error:', error);
            });
    });
});
