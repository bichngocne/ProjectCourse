$(document).ready(function () {
    const storecourse = $('#storecourse');

    storecourse.submit(submitForm)
    async function submitForm(e) {
        e.preventDefault();
        const formData = new FormData();
        const name = $("#name").val();
        const description = $("#description").val();
        const enrollment_limit = $("#enrollment_limit").val();
        const level = $("input[name='level']:checked").val();
        const images = $("#images")[0].files;
        const price = $("#price").val();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('enrollment_limit', enrollment_limit);
        formData.append('level', level);
        formData.append('price', price);

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        console.log(formData);

        try {
            const response = await axios.post("/english-course-manager/managementcourse/course", formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            })
            if (response.data.success) {
                notification(response.data.message)
                setTimeout(() => {
                    window.location.href = response.data.uri;
                }, 1000);
            } else {
                notification(response.data.message)
            }
        } catch (error) {
            console.error("Error occurred", error);
        }
    }
    $("#editcourse").submit(function (e) {
        e.preventDefault();
        const formData = new FormData();
        const name = $("#name").val();
        const description = $("#description").val();
        const enrollment_limit = $("#enrollment_limit").val();
        const level = $("input[name='level']:checked").val();
        const images = $("#images")[0].files;
        const price = $("#price").val();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('enrollment_limit', enrollment_limit);
        formData.append('level', level);
        formData.append('price', price);
        console.log(images.length);
        if (images.length !== 0) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        } else {
            formData.append("images", []);
        }
        console.log(formData);

        const courseId = $('.btn-edit-course').data("id");
        console.log(courseId);
        $.ajax({
            url: `/english-course-manager/managementcourse/course-i/${courseId}?_method=PUT`,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    notification(response.message)
                    setTimeout(() => {
                        window.location.href = response.uri;
                    }, 1000);
                } else {
                    notification(response.message)
                }
            },
            error: function (error) {
                notification(response.message)
            }
        });
    });
});
async function submitDel(courseId) {
    $.ajax({
        url: `/english-course-manager/managementcourse/course/${courseId}?_method=DELETE`,
        type: "POST",
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
            if (response.success) {
                notification(response.message);
                setTimeout(() => {
                   location.reload()
                }, 1000); 
            } else {
                notification(response.message);
            }
        },
        error: function (errorResponse) {
            notification(errorResponse.message);
        }

    });
}
