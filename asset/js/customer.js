$(document).ready(function () {
    // Fetch and display customer list
    function loadCustomers() {
        $.ajax({
            url: "http://localhost:8000/user/all",
            type: "GET",
            success: function (response) {
                const tbody = $("tbody");
                tbody.empty();
                response.users.forEach(function (customer) {
                    const tr = $("<tr></tr>");
                    const idTd = $("<td></td>").text(customer.id_user);
                    const nameTd = $("<td></td>").text(customer.name);
                    const emailTd = $("<td></td>").text(customer.email);
                    const phoneTd = $("<td></td>").text(customer.phone_number);

                    const actionTd = $("<td></td>");
                    const actionDiv = $("<div class='action-buttons'></div>");

                    const editBtn = $("<button class='action-button edit-button' title='Chỉnh sửa'><i class='fas fa-edit'></i></button>");
                    editBtn.data("id", customer.id_user);

                    const deleteBtn = $("<button class='action-button delete-button' title='Xóa'><i class='fas fa-trash-alt'></i></button>");
                    deleteBtn.data("id", customer.id_user);

                    actionDiv.append(editBtn, deleteBtn);
                    actionTd.append(actionDiv);

                    tr.append(idTd, nameTd, emailTd, phoneTd, actionTd);
                    tbody.append(tr);
                });
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách khách hàng:", error);
                alert("Không thể tải danh sách khách hàng. Vui lòng thử lại!");
            }
        });
    }


    loadCustomers();


    $(".add-button").on("click", function () {
        $("#addCustomerModal").fadeIn();
    });


    $("#cancelAddCustomer").on("click", function () {
        $("#addCustomerModal").fadeOut();
    });


    $("#addCustomerForm").on("submit", function (e) {
        e.preventDefault();
        const data = {
            name: $("#customerName").val(),
            email: $("#customerEmail").val(),
            phone_number: $("#customerPhone").val(),
            password: $("#password").val()
        };

        $.ajax({
            url: "http://localhost:8000/user/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Thêm khách hàng thành công!");
                $("#addCustomerModal").fadeOut();
                setTimeout(() => location.reload(), 1000);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi thêm khách hàng:", error);
                alert("Không thể thêm khách hàng. Vui lòng thử lại!");
            }
        });
    });


    $(document).on("click", ".edit-button", function () {
        const customerId = $(this).data("id");
        $("#editCustomerModal").fadeIn();
    });

    // Close Edit Customer Modal
    $("#cancelEditCustomer").on("click", function () {
        $("#editCustomerModal").fadeOut();
    });


    $("#editCustomerForm").on("submit", function (e) {
        e.preventDefault();
        const customerId = $(".edit-button").data("id");
        const data = {
            name: $("#editCustomerName").val(),
            email: $("#editCustomerEmail").val(),
            phone_number: $("#editCustomerPhone").val()
        };

        $.ajax({
            url: `http://localhost:8000/user/${parseInt(customerId)}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Cập nhật thông tin khách hàng thành công!");
                $("#editCustomerModal").fadeOut();
                setTimeout(() => location.reload(), 1000);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi cập nhật khách hàng:", error);
                alert("Không thể cập nhật khách hàng. Vui lòng thử lại!");
            }
        });
    });
    $(document).on("click", ".delete-button", function () {
        const customerId = $(this).data("id");
        if (!confirm("Bạn có chắc chắn muốn xoá khách hàng này?")) return;
        $.ajax({
            url:`http://localhost:8000/user/${parseInt(customerId)}`,
            type:"DELETE",
            success: function () {
                alert("Đã xóa khách hàng thành công");
                setTimeout(() => location.reload(), 1000  )
            },
            error:function (xhr,status,error) {
                console.error("Lỗi xóa khách hàng:", error);
                alert("Không thể xóa hàng. Vui lòng thử lại!");
            }
        })
    });

});