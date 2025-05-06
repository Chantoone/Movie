$(document).ready(function () {

    function loadShowtimes() {
        $.ajax({
            url: "http://localhost:8000/showtime/all",
            type: "GET",
            success: function (response) {
                const tbody = $("tbody");
                tbody.empty();
                response.forEach(function (showtime) {
                    const tr = $("<tr></tr>");
                    const idTd = $("<td></td>").text(showtime.id_showtime);
                    const movieNameTd = $("<td></td>").text(showtime.movie_name);

                    // Format start_time to display date and time
                    const startTime = new Date(showtime.time_begin);
                    const formattedStartTime = startTime.toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    const startTimeTd = $("<td></td>").text(formattedStartTime);

                    const cinemaNameTd = $("<td></td>").text(showtime.cinema_name);
                    const roomNameTd = $("<td></td>").text(showtime.room_name);

                    const actionTd = $("<td></td>");
                    const actionDiv = $("<div class='action-buttons'></div>");

                    const editBtn = $("<button class='action-button edit-button' title='Chỉnh sửa'><i class='fas fa-edit'></i></button>");
                    editBtn.data("id", showtime.id_showtime);

                    const deleteBtn = $("<button class='action-button delete-button' title='Xóa'><i class='fas fa-trash-alt'></i></button>");
                    deleteBtn.data("id", showtime.id_showtime);

                    actionDiv.append(editBtn, deleteBtn);
                    actionTd.append(actionDiv);

                    tr.append(idTd, movieNameTd, startTimeTd, cinemaNameTd, roomNameTd, actionTd);
                    tbody.append(tr);
                });
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách suất chiếu:", error);
                alert("Không thể tải danh sách suất chiếu. Vui lòng thử lại!");
            }
        });
    }

    loadShowtimes();

    $(".add-button").on("click", function () {
        $("#addShowtimeModal").fadeIn();

        $.ajax({
            url:"http://localhost:8000/movie/",
            type:"GET",
            data:{
                state:"NOW_SHOWING"
            },
            success:function (response) {
                let addMovie=$("#addMovie")
                response.movies.forEach(function (movie) {
                    let op=$("<option></option>").text(movie.name);
                    op.attr("value",movie.id_movie)
                    addMovie.append(op)

                })
            }
        })
        $.ajax({
            url:"http://localhost:8000/movie/",
            type:"GET",
            data:{
                state:"NOW_SHOWING"
            },
            success:function (response) {

                let cinemaName=$("#cinemaName")
                response.movies.forEach(function (movie) {
                    let op=$("<option></option>").text(movie.name);
                    op.attr("value",movie.id_movie)
                    addMovie.append(op)

                })
            }
        })
    });

    $("#cancelAddShowtime").on("click", function () {
        $("#addShowtimeModal").fadeOut();
    });

    // Submit Add Showtime Form
    $("#addShowtimeForm").on("submit", function (e) {
        e.preventDefault();
        const data = {
            movie_name: $("#movieName").val(),
            start_time: $("#startTime").val(),
            cinema_name: $("#cinemaName").val(),
            room_name: $("#roomName").val()
        };

        $.ajax({
            url: "http://localhost:8000/showtime/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Thêm suất chiếu thành công!");
                $("#addShowtimeModal").fadeOut();
                setTimeout(() => location.reload(), 1000);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi thêm suất chiếu:", error);
                alert("Không thể thêm suất chiếu. Vui lòng thử lại!");
            }
        });
    });

    // Open Edit Showtime Modal
    $(document).on("click", ".edit-button", function () {
        const showtimeId = $(this).data("id");
        $("#editShowtimeModal").fadeIn();
    });

    // Close Edit Showtime Modal
    $("#cancelEditShowtime").on("click", function () {
        $("#editShowtimeModal").fadeOut();
    });

    // Submit Edit Showtime Form
    $("#editShowtimeForm").on("submit", function (e) {
        e.preventDefault();
        const showtimeId = $(".edit-button").data("id");
        const data = {
            movie_name: $("#editMovieName").val(),
            start_time: $("#editStartTime").val(),
            cinema_name: $("#editCinemaName").val(),
            room_name: $("#editRoomName").val()
        };

        $.ajax({
            url: `http://localhost:8000/showtime/${showtimeId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Cập nhật thông tin suất chiếu thành công!");
                $("#editShowtimeModal").fadeOut();
                setTimeout(() => location.reload(), 1000);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi cập nhật suất chiếu:", error);
                alert("Không thể cập nhật suất chiếu. Vui lòng thử lại!");
            }
        });
    });

    // Delete Showtime
    $(document).on("click", ".delete-button", function () {
        const showtimeId = $(this).data("id");
        if (!confirm("Bạn có chắc chắn muốn xoá suất chiếu này?")) return;

        $.ajax({
            url: `http://localhost:8000/showtime/${showtimeId}`,
            type: "DELETE",
            success: function () {
                alert("Đã xóa suất chiếu thành công");
                setTimeout(() => location.reload(), 1000);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi xóa suất chiếu:", error);
                alert("Không thể xóa suất chiếu. Vui lòng thử lại!");
            }
        });
    });
});