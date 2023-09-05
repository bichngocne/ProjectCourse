
function notification(mess) {
    const toast = new bootstrap.Toast('#liveToast');
    $('.toast-body').html(mess);
    toast.show();
}
$(document).ready(function () {
    //login-signup
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
    //delete Course Modal
    var deleteCourseModal = document.getElementById('deleteCourseModal')
    //delete course
    deleteCourseModal.addEventListener('show.bs.modal', function (event) {
        var btnDel = $('.btn-del-modal');
        var btnDelKlass = $('.btn-del-klass-modal');
        // Button that triggered the modal
        var button = event.relatedTarget
        var Id = button.getAttribute('data-id');
        btnDel.click(() => submitDel(Id));
        $('.btn-del-modal-fo').click(() => submitDelforever(Id));

        btnDelKlass.click(() => submitDelKlass(Id));

    })
    //khoi phuc course
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
    //arrange name course
    $('.arrname').on('click', function () {
        var nameArr = 'name';
        arrangeCourses(nameArr);
    });
    //arrange price course
    $('.arrprice').on('click', function () {
        var nameArr = 'price';
        arrangeCourses(nameArr);
    });
    //arrange create at course
    $('.arrcreatedat').on('click', function () {
        var nameArr = 'createdAt';
        arrangeCourses(nameArr);
    });
    //search name course
    $('.searchButton').on('click', function () {
        var searchTerm = $('.searchTerm').val();
        console.log(searchTerm);
        $.ajax({
            url: `/english-course-manager/managementcourse/`,
            type: "POST",
            data: { search: searchTerm },

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

    //search name class
    $('.searchButtonClass').on('click', function () {
        var searchTerm = $('.searchTerm').val();
        console.log(searchTerm);
        $.ajax({
            url: `/english-course-manager/class/`,
            type: "POST",
            data: { search: searchTerm },

            success: function (klasses) {
                $('#listcourse').html('')
                var count = 1;
                klasses.klasses.forEach(element => {
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

    //class
     //arrange name class
     $('.arrname-class').on('click', function () {
        var nameArr = 'name';
        arrangeClasses(nameArr);
    });
    //arrange price class
    $('.arrnumbers-class').on('click', function () {
        var nameArr = 'numberofsessions';
        arrangeClasses(nameArr);
    });
    //arrange create at class
    $('.arrcreatedat-class').on('click', function () {
        var nameArr = 'createdAt';
        arrangeClasses(nameArr);
    });
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
//arrange course
function arrangeCourses(nameArr) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `/english-course-manager/managementcourse/arrange/${nameArr}`,
    }).done((courses) => {

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
//arrange class
function arrangeClasses(nameArr) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `/english-course-manager/class/arrange/${nameArr}`,
    }).done((klasses) => {

        $('#listcourse').html('')
        var count = 1;
        klasses.klasses.forEach(element => {
            let rowHTML = `
                <tr>
                    <th scope="row">${count++}</th>
                    <td>${element.name}</td>
                    <td>${Number(element.numberofsessions)}</td>
                    <td>
                    <a href="#"
                    class="btn-edit border-0">Edit</a>
                  <button type="button" class="btn-del border-0 " data-bs-toggle="modal" data-id="${this._id}"
                    data-bs-target="#deleteCourseModal">Xoá</button>
                    </td>
                </tr>`;
            $('#listcourse').append(rowHTML);
        });

    }).fail((error) => {
        console.error('Error:', error);
    });
};

