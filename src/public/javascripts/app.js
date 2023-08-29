
function notification(mess) {
    const toast = new bootstrap.Toast('#liveToast');
    $('.toast-body').html(mess);
    toast.show();
}
$(document).ready(function () {
    $('#liveToastBtn').click(() => {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/english-course/logout',
        })
            .done((data) => {
                notification(data.message);
                // Chuyển đến trang /english-course?is_from_login=false
                setTimeout(() => {
                    window.location.href = '/english-course/login-signup?is_from_login=false';
                }, 1000);
            })
            .fail((error) => {
                console.error('Error:', error);
            });
    });
    var deleteCourseModal = document.getElementById('deleteCourseModal')
    deleteCourseModal.addEventListener('show.bs.modal', function (event) {
        var btnDel = $('.btn-del-modal');
        // Button that triggered the modal
        var button = event.relatedTarget
        var courseId = button.getAttribute('data-id');
        btnDel.click(() => submitDel(courseId));
        
    })

});

