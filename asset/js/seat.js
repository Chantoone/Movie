//
// $(document).ready(function (){
//     const queryString= window.location.search;
//     const urlParams = new URLSearchParams(queryString)
//     const movieId = urlParams.get("id")
//      var cinemaId;
//     var date;
//     var time;
//     var showtimeId
//     $.ajax({
//         url:"http://localhost:8000/movie/"+movieId,
//         type: "GET",
//         data:{ id :movieId},
//         success: function (response) {
//             var movieTitle = $(".movie-title");
//             movieTitle.text(response.name);
//         }
//     });
//     $.ajax({
//         url: "http://localhost:8000/cinema/get_cinema/"+movieId,
//         type: "GET",
//         data:{
//             id_movie:movieId
//         },
//         success: function (response) {
//
//             var cinemaList=$(".cinema-buttons")
//             response.cinemas.forEach(function (cinema,index) {
//                 var button= $("<button></button>");
//                 button.text(cinema.name);
//                 button.attr("id",cinema.id_cinema);
//                 cinemaList.append(button);
//
//             })
//
//         }
//
//     })
//     $('.cinema-buttons').on('click', 'button', function() {
//         $('.cinema-buttons button').removeClass('active');
//         $(this).addClass('active');
//         cinemaId = $(this).attr("id")
//
//         $.ajax({
//             url: "http://localhost:8000/cinema/get_date/"+movieId+"/"+cinemaId,
//             type: "GET",
//             data:{
//                 id_movie: movieId,
//                 id_cinema: cinemaId
//             },
//             success: function (response) {
//                 console.log("Danh sách ngày chiếu:", response);
//                 var dateList = $("#dateButtons");
//                 dateList.empty(); // Xóa danh sách cũ trước khi cập nhật mới
//                 response.dates.forEach(function (date) {
//                     var button = $("<button></button>");
//                     button.text(date);
//                     button.attr("data-date", date);
//                     dateList.append(button);
//                 });
//             }
//     });
//          $('#dateButtons').on('click', 'button', function () {
//         $('#dateButtons button').removeClass('active');
//         $(this).addClass('active');
//
//         date = $(this).attr("data-date");
//
//
//         // Xóa danh sách giờ cũ trước khi cập nhật mới
//         $("#timeButtons").empty();
//
//         $.ajax({
//             url: "http://localhost:8000/cinema/get_time/" + movieId + "/" + cinemaId + "/" + date,
//             type: "GET",
//             success: function (response) {
//                 console.log("Danh sách giờ chiếu:", response);
//                 var timeList = $("#timeButtons");
//                 response.times.forEach(function (time) {
//                     var button = $("<button></button>");
//                     button.text(time);
//                     button.attr("data-time", time);
//                     button.attr("showtimeId",response.id_showtime);
//                     timeList.append(button);
//                 });
//             }
//         });
//     });
//           $('#timeButtons').on('click', 'button', function () {
//         $('#timeButtons button').removeClass('active');
//         $(this).addClass('active');
//
//          time = $(this).attr("data-time");
//          showtimeId=$(this).attr("showtimeId");
//          console.log()
//
//     });
//
//
//
//
// })
// })
$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get("id");

    let cinemaId, date, time, showtimeId;

    // 🟢 Gọi API lấy danh sách rạp
    $.ajax({
        url: "http://localhost:8000/cinema/get_cinema/" + movieId,
        type: "GET",
        success: function (response) {
            var cinemaList = $(".cinema-buttons");
            response.cinemas.forEach(function (cinema) {
                var button = $("<button></button>");
                button.text(cinema.name);
                button.attr("data-cinema-id", cinema.id_cinema);
                cinemaList.append(button);
            });
        }
    });

    // 🟡 Khi chọn rạp → Gọi API lấy danh sách ngày
    $(document).on('click', '.cinema-buttons button', function () {
        $('.cinema-buttons button').removeClass('active');
        $(this).addClass('active');

        cinemaId = $(this).attr("data-cinema-id");
        console.log("Rạp đã chọn:", cinemaId);

        // Xóa danh sách ngày & giờ cũ trước khi cập nhật mới
        $("#dateButtons").empty();
        $("#timeButtons").empty();

        $.ajax({
            url: "http://localhost:8000/cinema/get_date/" + movieId + "/" + cinemaId,
            type: "GET",
            success: function (response) {
                console.log("Danh sách ngày chiếu:", response);
                var dateList = $("#dateButtons");
                response.dates.forEach(function (d) {
                    var button = $("<button></button>");
                    button.text(d);
                    button.attr("data-date", d);
                    dateList.append(button);
                });
            }
        });
    });

    // 🟠 Khi chọn ngày → Gọi API lấy danh sách giờ
    $(document).on('click', '#dateButtons button', function () {
        $('#dateButtons button').removeClass('active');
        $(this).addClass('active');

        date = $(this).attr("data-date");
        console.log("Ngày đã chọn:", date);

        // Xóa danh sách giờ cũ trước khi cập nhật mới
        $("#timeButtons").empty();

        $.ajax({
            url: "http://localhost:8000/cinema/get_time/" + movieId + "/" + cinemaId + "/" + date,
            type: "GET",
            success: function (response) {
                console.log("Danh sách giờ chiếu:", response);
                var timeList = $("#timeButtons");
                response.times.forEach(function (t) {
                    var button = $("<button></button>");
                    button.text(t);
                    button.attr("data-time", t);
                    button.attr("data-showtime-id", response.id_showtime); // ✅ Lưu ID suất chiếu
                    timeList.append(button);
                });
            }
        });
    });

    // 🔵 Khi chọn giờ chiếu → Lưu thông tin suất chiếu
    $(document).on('click', '#timeButtons button', function () {
        $('#timeButtons button').removeClass('active');
        $(this).addClass('active');

        time = $(this).attr("data-time");
        showtimeId = $(this).attr("data-showtime-id");

        console.log("Giờ đã chọn:", time);
        console.log("ID Showtime đã chọn:", showtimeId);
    });
});
