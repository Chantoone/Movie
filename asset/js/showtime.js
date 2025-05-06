$(document).ready(function () {
    // Biến phân trang
    let currentPage = 1;
    let pageSize = 10;
    let totalShowtimes = 0;
    let allShowtimes = [];

    // Khởi tạo phân trang
    function initPagination() {
        // Đặt kích thước trang mặc định từ dropdown
        pageSize = parseInt($('#pageSize').val());
        
        // Cập nhật phân trang khi kích thước trang thay đổi
        $('#pageSize').on('change', function() {
            pageSize = parseInt($(this).val());
            currentPage = 1; // Đặt lại về trang đầu tiên khi thay đổi kích thước trang
            renderShowtimes();
            updatePaginationControls();
        });

        // Nút trang trước
        $('.prev-page').on('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderShowtimes();
                updatePaginationControls();
            }
        });

        // Nút trang sau
        $('.next-page').on('click', function() {
            const totalPages = Math.ceil(totalShowtimes / pageSize);
            if (currentPage < totalPages) {
                currentPage++;
                renderShowtimes();
                updatePaginationControls();
            }
        });
    }

    // Cập nhật điều khiển phân trang (số trang và nút)
    function updatePaginationControls() {
        const totalPages = Math.ceil(totalShowtimes / pageSize);
        
        // Bật/tắt nút trang trước/sau
        $('.prev-page').prop('disabled', currentPage === 1);
        $('.next-page').prop('disabled', currentPage === totalPages);
        
        // Tạo số trang
        const $paginationNumbers = $('#pagination-numbers');
        $paginationNumbers.empty();
        
        // Tính toán phạm vi trang hiển thị
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Trang đầu tiên
        if (startPage > 1) {
            $paginationNumbers.append(`<button class="page-number" data-page="1">1</button>`);
            if (startPage > 2) {
                $paginationNumbers.append(`<span>...</span>`);
            }
        }
        
        // Số trang
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            $paginationNumbers.append(`<button class="page-number ${activeClass}" data-page="${i}">${i}</button>`);
        }
        
        // Trang cuối cùng
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                $paginationNumbers.append(`<span>...</span>`);
            }
            $paginationNumbers.append(`<button class="page-number" data-page="${totalPages}">${totalPages}</button>`);
        }
        
        // Thêm sự kiện click cho số trang
        $('.page-number').on('click', function() {
            currentPage = parseInt($(this).data('page'));
            renderShowtimes();
            updatePaginationControls();
        });
        
        // Cập nhật thông tin tóm tắt trang
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalShowtimes);
        $('#page-summary').text(`Hiển thị ${start}-${end} của ${totalShowtimes} xuất chiếu`);
    }

    // Hiển thị xuất chiếu cho trang hiện tại
    function renderShowtimes() {
        const tbody = $("tbody");
        tbody.empty();
        
        // Tính toán chỉ số bắt đầu và kết thúc cho trang hiện tại
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, allShowtimes.length);
        
        // Lấy xuất chiếu cho trang hiện tại
        const showtimesToShow = allShowtimes.slice(startIndex, endIndex);
        
        // Hiển thị xuất chiếu
        showtimesToShow.forEach(function (showtime) {
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
    }

    function loadShowtimes() {
        $.ajax({
            url: "http://localhost:8000/showtime/all",
            type: "GET",
            success: function (response) {
                // Lưu tất cả xuất chiếu
                allShowtimes = response;
                totalShowtimes = allShowtimes.length;
                
                // Khởi tạo phân trang
                initPagination();
                
                // Hiển thị trang đầu tiên
                renderShowtimes();
                updatePaginationControls();
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách suất chiếu:", error);
                alert("Không thể tải danh sách suất chiếu. Vui lòng thử lại!");
            }
        });
    }

    // Tải danh sách xuất chiếu ban đầu
    loadShowtimes();

    // Sự kiện tìm kiếm xuất chiếu
    $('.search-container button').click(function() {
        const searchTerm = $('.search-container input').val().toLowerCase();
        
        if (searchTerm) {
            const filteredShowtimes = allShowtimes.filter(showtime => 
                showtime.movie_name.toLowerCase().includes(searchTerm) || 
                showtime.cinema_name.toLowerCase().includes(searchTerm) ||
                showtime.room_name.toLowerCase().includes(searchTerm)
            );
            
            const tbody = $("tbody");
            tbody.empty();
            
            filteredShowtimes.forEach(function (showtime) {
                // Đoạn code hiển thị xuất chiếu đã lọc (giống như trong renderShowtimes)
                const tr = $("<tr></tr>");
                const idTd = $("<td></td>").text(showtime.id_showtime);
                const movieNameTd = $("<td></td>").text(showtime.movie_name);

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
            
            // Cập nhật thông tin phân trang cho kết quả tìm kiếm
            $('#page-summary').text(`Hiển thị ${filteredShowtimes.length} kết quả tìm kiếm`);
            $('#pagination-numbers').empty();
            $('.prev-page, .next-page').prop('disabled', true);
        } else {
            // Nếu không có từ khóa, hiển thị lại toàn bộ danh sách có phân trang
            renderShowtimes();
            updatePaginationControls();
        }
    });

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
            url:"http://localhost:8000/cinema/all",
            type:"GET",

            success:function (response) {

                let cinemaName=$("#cinemaName")
                response.cinemas.forEach(function (cinema) {
                    let op=$("<option></option>").text(cinema.name);
                    op.attr("value",cinema.id_cinema)
                    cinemaName.append(op)

                })
            }
        })
        $.ajax({
            url:"http://localhost:8000/room/by_cinema/",
            type:"GET",
            data:{
                "id_cinema":parseInt($("#cinemaName").val())
            },
            success:function (response) {

                let roomName=$("#roomName")
                response.rooms.forEach(function (room) {
                    let op=$("<option></option>").text(room.name);
                    op.attr("value",room.id_cinema)
                    roomName.append(op)

                })
            }
        })

    });

    $("#cinemaName").on("change", function () {
        const selectedCinemaId = $(this).val();

        if (selectedCinemaId) {
            $.ajax({
                url: "http://localhost:8000/room/by_cinema/",
                type: "GET",
                data: { id_cinema: parseInt(selectedCinemaId) },
                success: function (response) {
                    const roomName = $("#roomName");
                    roomName.empty(); // Clear previous options

                    response.rooms.forEach(function (room) {
                        const option = $("<option></option>").text(room.name).val(room.id_room);
                        roomName.append(option);
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Lỗi khi tải danh sách phòng:", error);
                    alert("Không thể tải danh sách phòng. Vui lòng thử lại!");
                }
            });
        }
    });

    $("#cancelAddShowtime").on("click", function () {
        $("#addShowtimeModal").fadeOut();
    });

    // Submit Add Showtime Form
    $("#addShowtimeForm").on("submit", function (e) {
        e.preventDefault();
        const data = {
            "id_movie": parseInt($("#addMovie").val()),
            "time_begin": new Date($("#startTime").val()).toISOString(),

            "id_room": parseInt($("#roomName").val()),
        };

        $.ajax({
            url: "http://localhost:8000/showtime/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Thêm suất chiếu thành công!");
                $("#addShowtimeModal").fadeOut();
                
                // Tải lại dữ liệu thay vì làm mới trang
                loadShowtimes();
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
        
        // Tìm thông tin xuất chiếu từ danh sách đã có
        const showtime = allShowtimes.find(s => s.id_showtime === showtimeId);
        
        if (showtime) {
            $("#editMovieName").val(showtime.movie_name);
            
            // Format datetime-local input
            const startTime = new Date(showtime.time_begin);
            const formattedDate = startTime.toISOString().slice(0, 16);
            $("#editStartTime").val(formattedDate);
            
            $("#editCinemaName").val(showtime.cinema_name);
            $("#editRoomName").val(showtime.room_name);
            
            // Lưu ID xuất chiếu đang chỉnh sửa
            $("#editShowtimeForm").data("id", showtimeId);
        }
        
        $("#editShowtimeModal").fadeIn();

        // Load movies for the dropdown
        $.ajax({
            url: "http://localhost:8000/movie/",
            type: "GET",
            data: { state: "NOW_SHOWING" },
            success: function (response) {
                const movieDropdown = $("#editMovieName");
                movieDropdown.empty();
                response.movies.forEach(function (movie) {
                    const option = $("<option></option>").text(movie.name).val(movie.id_movie);
                    movieDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách phim:", error);
            }
        });

        // Load cinemas for the dropdown
        $.ajax({
            url: "http://localhost:8000/cinema/all",
            type: "GET",
            success: function (response) {
                const cinemaDropdown = $("#editCinemaName");
                cinemaDropdown.empty();
                response.cinemas.forEach(function (cinema) {
                    const option = $("<option></option>").text(cinema.name).val(cinema.id_cinema);
                    cinemaDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách rạp:", error);
            }
        });

        // Load rooms based on selected cinema
        $("#editCinemaName").on("change", function () {
            const selectedCinemaId = $(this).val();

            if (selectedCinemaId) {
                $.ajax({
                    url: "http://localhost:8000/room/by_cinema/",
                    type: "GET",
                    data: { id_cinema: parseInt(selectedCinemaId) },
                    success: function (response) {
                        const roomDropdown = $("#editRoomName");
                        roomDropdown.empty();
                        response.rooms.forEach(function (room) {
                            const option = $("<option></option>").text(room.name).val(room.id_room);
                            roomDropdown.append(option);
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error("Lỗi khi tải danh sách phòng:", error);
                    }
                });
            }
        });
    });

    // Close Edit Showtime Modal
    $("#cancelEditShowtime").on("click", function () {
        $("#editShowtimeModal").fadeOut();
    });

    // Submit Edit Showtime Form
    $("#editShowtimeForm").on("submit", function (e) {
        e.preventDefault();
        const showtimeId = $(this).data("id");
        const data = {
            "id_movie": parseInt($("#editMovieName").val()),
            "time_begin": new Date($("#editStartTime").val()).toISOString(),
            "id_room": parseInt($("#editRoomName").val()),
        };

        $.ajax({
            url: `http://localhost:8000/showtime/${showtimeId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                alert("Cập nhật thông tin suất chiếu thành công!");
                $("#editShowtimeModal").fadeOut();
                
                // Tải lại dữ liệu thay vì làm mới trang
                loadShowtimes();
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
                
                // Cập nhật lại dữ liệu trong danh sách thay vì tải lại trang
                allShowtimes = allShowtimes.filter(s => s.id_showtime !== showtimeId);
                totalShowtimes = allShowtimes.length;
                
                // Kiểm tra nếu trang hiện tại không còn dữ liệu thì quay về trang trước đó
                const totalPages = Math.ceil(totalShowtimes / pageSize);
                if (currentPage > totalPages && currentPage > 1) {
                    currentPage--;
                }
                
                renderShowtimes();
                updatePaginationControls();
            },
            error: function (xhr, status, error) {
                console.error("Lỗi xóa suất chiếu:", error);
                alert("Không thể xóa suất chiếu. Vui lòng thử lại!");
            }
        });
    });

    $("#editCinemaName").on("change", function () {
        const selectedCinemaId = $(this).val();

        if (selectedCinemaId) {
            $.ajax({
                url: "http://localhost:8000/room/by_cinema/",
                type: "GET",
                data: { id_cinema: parseInt(selectedCinemaId) },
                success: function (response) {
                    const roomName = $("#editRoomName");
                    roomName.empty(); // Clear previous options

                    response.rooms.forEach(function (room) {
                        const option = $("<option></option>").text(room.name).val(room.id_room);
                        roomName.append(option);
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Lỗi khi tải danh sách phòng:", error);
                    alert("Không thể tải danh sách phòng. Vui lòng thử lại!");
                }
            });
        }
    });

    $("#editShowtimeModal").on("show", function () {
        // Load movies for the dropdown
        $.ajax({
            url: "http://localhost:8000/movie/",
            type: "GET",
            data: { state: "NOW_SHOWING" },
            success: function (response) {
                const movieDropdown = $("#editMovieName");
                movieDropdown.empty();
                response.movies.forEach(function (movie) {
                    const option = $("<option></option>").text(movie.name).val(movie.id_movie);
                    movieDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách phim:", error);
            }
        });

        // Load cinemas for the dropdown
        $.ajax({
            url: "http://localhost:8000/cinema/all",
            type: "GET",
            success: function (response) {
                const cinemaDropdown = $("#editCinemaName");
                cinemaDropdown.empty();
                response.cinemas.forEach(function (cinema) {
                    const option = $("<option></option>").text(cinema.name).val(cinema.id_cinema);
                    cinemaDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi tải danh sách rạp:", error);
            }
        });
    });
});