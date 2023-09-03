
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
        $('.btn-del-modal-fo').click(() => submitDelforever(courseId));

    })
    $('.btn-edit-trash').click((e) => {
        e.preventDefault();
        console.log('click ');
        var courseId = $('.btn-edit-trash').data('id');
        console.log(courseId);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: `/english-course-manager/managementcourse/course/${courseId}/restore?_method=PUT`,
        })
            .done((data) => {
                notification(data.message);
                setTimeout(() => {
                    location.reload();
                }, 1000);
            })
            .fail((error) => {
                console.error('Error:', error);
            });
    })
    $('.arrname').on('click', function () {
        var nameArr = 'name';
        arrangeCourses(nameArr);
    });

    $('.arrprice').on('click', function () {
        var nameArr = 'price';
        arrangeCourses(nameArr);
    });

    $('.arrcreatedat').on('click', function () {
        var nameArr = 'createdAt';
        arrangeCourses(nameArr);
    });
    $('.searchButton').on('click', function () {
        var searchTerm = $('.searchTerm').val();
        console.log(searchTerm);
        $.ajax({
            url: `/english-course-manager/managementcourse/`,
            type: "POST",
            data: {search:searchTerm},
            
            success: function (courses) {
                $('#listcourse').html('')
                var count = 1;
                courses.courses.forEach(element => {
                    let levelHTML = element.level.map(lev => `<td>${lev}</td>`).join('');
                    let rowHTML = `
                <tr>
                    <th scope="row">${count++}</th>
                    <td>${element.name}</td>
                   <td> ${levelHTML}</td>
                    <td>${Number(element.enrollment_limit)}</td>
                    <td>${Number(element.price)} VNĐ</td>
                    <td>
                        <a href="/english-course-manager/managementcourse/course/${element._id}/edit"
                          class="btn-edit border-0">Edit</a>
                        <button type="button" class="btn-del border-0 " data-bs-toggle="modal" data-id="${element._id}"
                          data-bs-target="#deleteCourseModal">Xoá</button>
                    </td>
                </tr>`;
                    $('#listcourse').append(rowHTML);
                });
            }
            
        });
    })
    // courses();
});
function courses() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `/english-course-manager/managementcourse/courses`,
    }).done((coursesData) => {
        // let courses = JSON.parse(coursesData); // Chuyển chuỗi JSON thành đối tượng JavaScript
        let source = $('#courses-template').html();
        let template = Handlebars.compile(source);
        console.log(coursesData);
        // const template = Handlebars.compile("Name: {{name}}");
        // console.log(template({ name: "Nils" }));
        let html = template(coursesData)
        console.log(html);
        $('#listcourse').html(html);
    }).fail((error) => {
        console.error('Error:', error);
    });
};

function arrangeCourses(nameArr) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `/english-course-manager/managementcourse/arrange/${nameArr}`,
    }).done((courses) => {
        // let source = $('#courses-template').html();
        // let template = Handlebars.compile(source);
        // let html = template({listcourse:courses});
        // console.log(html);
        // $('#listcourse').html(html);
        $('#listcourse').html('')
        var count = 1;
        courses.courses.forEach(element => {
            let levelHTML = element.level.map(lev => `<td>${lev}</td>`).join('');
            let rowHTML = `
                <tr>
                    <th scope="row">${count++}</th>
                    <td>${element.name}</td>
                   <td> ${levelHTML}</td>
                    <td>${Number(element.enrollment_limit)}</td>
                    <td>${Number(element.price)} VNĐ</td>
                    <td>
                        <a href="/english-course-manager/managementcourse/course/${element._id}/edit"
                          class="btn-edit border-0">Edit</a>
                        <button type="button" class="btn-del border-0 " data-bs-toggle="modal" data-id="${element._id}"
                          data-bs-target="#deleteCourseModal">Xoá</button>
                    </td>
                </tr>`;
            $('#listcourse').append(rowHTML);
        });

    }).fail((error) => {
        console.error('Error:', error);
    });
};

