$(document).ready(function() {
            // Toggle sidebar
            $('.brand i').click(function() {
                $('body').toggleClass('sidebar-collapsed');
                $('.sidebar').toggleClass('collapsed');
            });



            // Home button functionality
            $('.home-button').click(function() {
                window.location.href="./home.html"
            });

        });
$(document).ready(function () {
    let selectedCinema =null;
    let selectedCinemaId =null;
    let selectedRoom=null;
    $.ajax({
        url:"http://localhost:8000/cinema/all",
        type:"GET",
        success: function (response) {
            let tbody = $("#tbody");
            response.cinemas.forEach(function (cinema) {
                let tr = $("<tr></tr>").attr("data-id", cinema.id_cinema);
                let id = $("<td></td>").text(cinema.id_cinema);
                let name = $("<td></td>").text(cinema.name);
                let address = $("<td></td>").text(cinema.address);
                let actionTd = $("<td></td>");
                let actionDiv = $("<div class='action-buttons'></div>");
                let viewBtn = $("<button class='action-button view-button' title='Xem'><i class='fas fa-eye'></i></button>");
                viewBtn.on("click",function () {
                    selectedCinemaId=cinema.id_cinema;
                    $.ajax({
                        url: `http://localhost:8000/room/by_cinema`,
                        type: "GET",
                        data:{
                            id_cinema:cinema.id_cinema
                        },
                        success: function (response) {
                            const tbody = $("#roomTableBody");
                            tbody.empty()
                            response.rooms.forEach(function (room) {
                                const tr = $("<tr></tr>");
                                const nameTd = $("<td></td>").text(room.name);
                                const seatTd = $("<td></td>").text(room.total_seat);
                                const typeTd = $("<td></td>").text(room.type);
                                let deleteRoomBtn = $("<button class='action-button delete-button room' title='Xóa'><i class='fas fa-trash-alt'></i></button>");
                                deleteRoomBtn.attr("data-id", room.id_room);
                                tr.append(nameTd, seatTd, typeTd,deleteRoomBtn);
                                tbody.append(tr);
                            });

                            $("#cinemaDetailModal").fadeIn();
                        },
                        error: function (xhr, status, error) {
                            const tbody = $("#roomTableBody");
                            tbody.empty()
                            // console.error("Lỗi khi lấy danh sách phòng:", error);
                            // alert("Không thể lấy danh sách phòng. Vui lòng thử lại.");

                            $("#cinemaDetailModal").fadeIn();
                        }
                    });
                });
                $("#closeCinemaDetail").click(function () {
                    $("#cinemaDetailModal").fadeOut();
                });
                let editBtn = $("<button class='action-button edit-button' title='Chỉnh sửa'><i class='fas fa-edit'></i></button>");
                editBtn.on("click",function () {
                    selectedCinema=cinema.id_cinema;
                    $("#editCinemaName").val(cinema.name);
                    $("#editCinemaAddress").val(cinema.address);
                    $("#editCinemaModal").fadeIn();
                })
                let deleteBtn = $("<button class='action-button delete-button' title='Xóa'><i class='fas fa-trash-alt'></i></button>");
                deleteBtn.on("click",function () {
                    if (!confirm("Bạn có chắc chắn muốn xoá Rạp này?")) return;
                    $.ajax({
                        url:`http://localhost:8000/cinema/${cinema.id_cinema}`,
                        type:"DELETE",
                        success:function () {
                            alert("Rạp đã được xoá thành công!");
                            location.reload();
                        },
                        error: function (xhr, status, error) {
                            console.error("Lỗi xoá phim:", error);
                            alert("Không thể xoá phim. Vui lòng thử lại!");
                        }

                    })
                })

                $("#cancelEdit").on("click",function () {
                    $("#editCinemaModal").fadeOut();
                })
                actionDiv.append(viewBtn, editBtn, deleteBtn);
                actionTd.append(actionDiv);
                tr.append(id,name,address,actionTd);
                tbody.append(tr);
                $("#addRoom").on("click",function () {
                    $("#addRoomModal").fadeIn();
                })


                $("#cancelAddRoom").on("click",function () {
                    $("#addRoomModal").fadeOut();
                })
            });
            $("#editCinemaForm").on("submit",function () {
                    const data={
                        name:$("#editCinemaName").val(),
                        address:$("#editCinemaAddress").val()
                    }
                    $.ajax({
                        url:`http://localhost:8000/cinema/${selectedCinema}`,
                        type:"PUT",
                        contentType: "application/json",
                        data:JSON.stringify(data),
                        success:function () {
                            $("#editCinemaModal").fadeOut();
                            setTimeout(() => location.reload(), 2000);
                        }
                    })
            });
            $("#addRoomForm").on("submit",function () {
                    $.ajax({
                        url:"http://localhost:8000/room/create",
                        type:"POST",
                        contentType:"application/json",
                        data:JSON.stringify({
                            "name":$("#RoomName").val(),
                            "type":$("#RoomType").val(),
                            "id_cinema":selectedCinemaId,
                            "numbers_seat":$("#RoomNumber").val()
                        }),
                        success:function () {

                            alert("Thêm mới phòng thành công !!")
                            $("#addRoomModal").fadeOut();
                             setTimeout(() => location.reload(), 2000);
                        }
                    })
            })





        }
    });


    
})
$(document).on("click", ".delete-button.room", function () {
    const idRoom = $(this).attr("data-id");
    if (!confirm("Bạn có chắc chắn muốn xoá phòng này?")) return;

    $.ajax({
        url: `http://localhost:8000/room/${idRoom}`,
        type: "DELETE",
        success: function () {
            alert("Phòng đã được xoá thành công!");
            setTimeout(() => location.reload(), 1000);
        },
        error: function (xhr, status, error) {
            console.error("Lỗi xoá phòng:", error);
            alert("Không thể xoá phòng. Vui lòng thử lại!");
        }
    });
});
$(document).ready(function () {
    $(".add-button").on("click",function () {
        $("#addCinemaModal").fadeIn();



    });
    $("#cancelAdd").on("click",function () {
            $("#addCinemaModal").fadeOut();
        });
    $("#addCinemaForm").on("submit",function () {

            const data={
                name:$("#cinemaName").val(),
                address:$("#cinemaAddress").val()
            }

            $.ajax({
                url:"http://localhost:8000/cinema/",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify(data),
                success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công!',
                    text: 'Đã hoàn thành thêm mới rạp chiếu phim!!',
                    showConfirmButton: false,
                    timer: 2000
                });
                $("#addCinemaModal").fadeOut();
                setTimeout(() => location.reload(), 2000);
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi cập nhật!',
                    text: 'Vui lòng kiểm tra lại dữ liệu và thử lại.',
                });
                console.error("Lỗi khi cập nhật phim:", error);
            }
            })
        })

})
