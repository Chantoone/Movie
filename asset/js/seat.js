let type_room ;

// function loadSeats(id_showtime) {
//   $.ajax({
//     url: "http://localhost:8000/seats/all" + id_showtime,
//     method: 'GET',
//     success: function (data) {
//       const seats = data.seats;
//       const seatMap = $('#seatMap');
//
//       // Clear existing seats
//       seatMap.empty();
//
//       // Sort seats by name for proper display
//       seats.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
//
//       // Group seats by row (first character of seat name)
//       const rows = {};
//       seats.forEach(seat => {
//         const rowName = seat.name.charAt(0);
//         if (!rows[rowName]) {
//           rows[rowName] = [];
//         }
//         rows[rowName].push(seat);
//       });
//
//       // Generate seats by row
//       Object.keys(rows).sort().forEach(rowName => {
//         const rowSeats = rows[rowName];
//
//         // Add a row container for better styling
//         const rowDiv = $('<div class="seat-row"></div>');
//         rowDiv.append(`<div class="row-label">${rowName}</div>`);
//
//         // Add seats to this row
//         rowSeats.forEach(seat => {
//           const seatDiv = $('<div></div>');
//           seatDiv.addClass('seat');
//           seatDiv.attr('data-seat', seat.name);
//           seatDiv.attr('id', seat.id_seat); // Add id attribute using id_seat from API
//           seatDiv.text(seat.name);
//
//           // Add class based on seat type
//           if (seat.type === 'VIP') {
//             seatDiv.addClass('vip');
//           } else {
//             seatDiv.addClass('regular');
//           }
//
//           // Add class based on seat state
//           if (seat.state === 'BOOKED') {
//             seatDiv.addClass('booked');
//           } else {
//             seatDiv.addClass('available');
//           }
//
//           rowDiv.append(seatDiv);
//         });
//
//         seatMap.append(rowDiv);
//       });
//     },
//     error: function (xhr) {
//       console.error("Lỗi khi tải ghế:", xhr.responseText);
//       alert("Không thể tải danh sách ghế. Vui lòng thử lại sau.");
//     }
//   });
// }
function loadSeats(id_showtime) {
  $.ajax({
    url: `http://localhost:8000/showtimes/${id_showtime}/seats`,  // ✅ đúng với route API
    method: 'GET',
    success: function (data) {
      const seatMap = $('#seatMap');
      seatMap.empty(); // Xoá sơ đồ ghế cũ

      const seatRows = data.rows; // ✅ API trả về rows là mảng các hàng

      seatRows.forEach(rowData => {
        const rowDiv = $('<div class="seat-row"></div>');
        rowDiv.append(`<div class="row-label">${rowData.row}</div>`);

        rowData.seats.forEach(seat => {
          const seatDiv = $('<div></div>')
            .addClass('seat')
            .attr('data-seat', seat.id)
            .attr('id', seat.id)
            .text(seat.id);

          // Thêm class 'vip' nếu muốn phân biệt theo hàng
          if (['D', 'E'].includes(seat.row)) {
            seatDiv.addClass('vip');
          } else {
            seatDiv.addClass('regular');
          }

          if (seat.is_booked) {
            seatDiv.addClass('booked');
          } else {
            seatDiv.addClass('available');
          }

          rowDiv.append(seatDiv);
        });

        seatMap.append(rowDiv);
      });
    },
    error: function (xhr) {
      console.error("Lỗi khi tải ghế:", xhr.responseText);
      alert("Không thể tải danh sách ghế. Vui lòng thử lại sau.");
    }
  });
}

function calculateTotal() {
  let total = 0;

  let basePrice = 0;
  if (type_room === "2D") {
    basePrice = 50000;
  } else {
    basePrice = 80000;
  }

  $('.seat.selected').each(function () {
    let seatType = $(this).hasClass('vip') ? 'VIP' : 'regular';
    if (seatType === 'VIP') {
      total += basePrice + 30000;
    } else {
      total += basePrice + 0;
    }
  });

  $('.food-item').each(function () {
    let quantity = parseInt($(this).find('.quantity').text());
    let price = parseInt($(this).attr('data-price'));
    total += quantity * price;
  });


  $('.total-price').text(`THANH TOÁN: ${total.toLocaleString('vi-VN')} VND`);
}
$(".payment-button").on("click", function () {
const seats = $('.seat.selected');

  if (seats.length === 0) {
    alert("Vui lòng chọn ít nhất 1 ghế để thanh toán!");
    return;
  }

  // 🪑 Danh sách ghế đã chọn
  const seatList = [];
  seats.each(function () {
    const name = $(this).attr('data-seat');
    const type = $(this).hasClass('vip') ? 'VIP' : 'Thường';
    seatList.push(`${name} (${type})`);
  });

  // 🍿 Đồ ăn
  const foods = [];
  $('.food-item').each(function () {
    const name = $(this).find('.food-name').text();
    const quantity = parseInt($(this).find('.quantity').text());
    const price = parseInt($(this).attr('data-price'));
    if (quantity > 0) {
      foods.push(`${name} x ${quantity} = ${(quantity * price).toLocaleString('vi-VN')} VND`);
    }
  });

  // 💰 Tổng tiền
  const totalText = $('.total-price').text();

  // 🧾 Gắn nội dung vào khung
  $('#confirmSeats').html(`<p><strong>Ghế đã chọn:</strong><br>${seatList.join(", ")}</p>`);
  $('#confirmFoods').html(`<p><strong>Đồ ăn đã chọn:</strong><br>${foods.join("<br>") || 'Không có'}</p>`);
  $('#confirmTotal').text(totalText);


  $('#confirmBox').fadeIn();
  $(document).on("click", "#confirmPaymentBtn", function () {


  // 4. Có thể ẩn confirmBox nếu cần
  $('#confirmBox').fadeOut();
});
});

$(document).ready(function () {
    $.ajax({
        url:"http://localhost:8000/food/all",
        type:"GET",
        success: function (data) {
        $(".food-items").empty(); // Xóa nội dung cũ (nếu có)
        data.foods.forEach(function (food) {
          const foodHtml = `
            <div class="food-item" data-price="${food.price}" data-id="${food.id_food}">
              <div class="food-name">${food.name}</div>
              <div class="quantity-selector">
                <button class="minus">-</button>
                <span class="quantity">0</span>
                <button class="plus">+</button>
              </div>
            </div>
          `;
          $(".food-items").append(foodHtml);
        });
      }

    });
     $(".food-order").on("click", ".plus", function () {
      const quantitySpan = $(this).siblings(".quantity");
      let quantity = parseInt(quantitySpan.text());
      quantitySpan.text(quantity + 1);
      calculateTotal();
    });

    $(".food-order").on("click", ".minus", function () {
      const quantitySpan = $(this).siblings(".quantity");
      let quantity = parseInt(quantitySpan.text());
      if (quantity > 0) quantitySpan.text(quantity - 1);
      calculateTotal();
    });
})
// $(document).ready(function () {
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const movieId = urlParams.get("id");
//
//     let cinemaId, date, time, showtimeId;
//
//     // 🟢 Gọi API lấy danh sách rạp
//     $.ajax({
//   url: "http://localhost:8000/cinema/by-film/" + movieId,
//   type: "GET",
//   success: function (response) {
//     const cinemaList = $(".cinema-buttons");
//     cinemaList.empty(); // Xóa các button cũ (nếu có)
//
//     response.forEach(function (cinema) {
//       const button = $("<button></button>")
//         .text(cinema.name)
//         .attr("data-cinema-id", cinema.id)
//         .addClass("cinema-button");
//       cinemaList.append(button);
//     });
//   },
//   error: function (xhr) {
//     if (xhr.status === 404) {
//       $(".cinema-buttons").html("<p>Không có rạp nào đang chiếu phim này.</p>");
//     } else {
//       console.error("Lỗi khi lấy danh sách rạp:", xhr.responseText);
//     }
//   }
// });
//
//     // 🟡 Khi chọn rạp → Gọi API lấy danh sách ngày
//     $(document).on('click', '.cinema-buttons button', function () {
//         $('.cinema-buttons button').removeClass('active');
//         $(this).addClass('active');
//
//         cinemaId = $(this).attr("data-cinema-id");
//         console.log("Rạp đã chọn:", cinemaId);
//
//         // Xóa danh sách ngày & giờ cũ trước khi cập nhật mới
//         $("#dateButtons").empty();
//         $("#timeButtons").empty();
//
//         $.ajax({
//             url: "http://localhost:8000/cinema/get_date/" + movieId + "/" + cinemaId,
//             type: "GET",
//             success: function (response) {
//                 console.log("Danh sách ngày chiếu:", response);
//                 var dateList = $("#dateButtons");
//                 response.dates.forEach(function (d) {
//                     var button = $("<button></button>");
//                     button.text(d);
//                     button.attr("data-date", d);
//                     dateList.append(button);
//                 });
//             }
//         });
//     });
//
//
//     $(document).on('click', '#dateButtons button', function () {
//         $('#dateButtons button').removeClass('active');
//         $(this).addClass('active');
//
//         date = $(this).attr("data-date");
//         console.log("Ngày đã chọn:", date);
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
//                 response.times.forEach(function (t) {
//                     var button = $("<button></button>");
//                     button.text(t);
//                     button.attr("data-time", t);
//                     button.attr("data-showtime-id", response.id_showtime);
//                     timeList.append(button);
//                 });
//             }
//         });
//     });
//
//
//     $(document).on('click', '#timeButtons button', function () {
//         $('#timeButtons button').removeClass('active');
//         $(this).addClass('active');
//
//         time = $(this).attr("data-time");
//         showtimeId = $(this).attr("data-showtime-id");
//
//         console.log("Giờ đã chọn:", time);
//         console.log("ID Showtime đã chọn:", showtimeId);
//         $.ajax({
//         url:"http://localhost:8000/room/",
//         type: "GET",
//         data:{"id_showtime":showtimeId},
//         success: function (response) {
//             type_room=response.type;
//             console.log(type_room)
//             loadSeats(showtimeId);
//             $(document).off('click', '.seat.available');
//             $(document).on('click', '.seat.available', function() {
//             $(this).toggleClass('selected');
//             calculateTotal();
//
//         });
//         }
//         })
//
//
//
//     });
//
//
// });
$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const movieId = urlParams.get("id");

  let cinemaId, date, time, showtimeId;

  // 🟢 Gọi API lấy danh sách rạp chiếu phim
  $.ajax({
    url: `http://localhost:8000/cinema/by-film/${movieId}`,
    type: "GET",
    success: function (response) {
      const cinemaList = $(".cinema-buttons").empty();
      response.forEach(function (cinema) {
        const button = $("<button></button>")
          .text(cinema.name)
          .attr("data-cinema-id", cinema.id)
          .addClass("cinema-button");
        cinemaList.append(button);
      });
    },
    error: function () {
      $(".cinema-buttons").html("<p>Không có rạp nào đang chiếu phim này.</p>");
    }
  });

  // 🟡 Khi chọn rạp → Gọi API lấy danh sách ngày chiếu
  $(document).on('click', '.cinema-button', function () {
    $('.cinema-button').removeClass('active');
    $(this).addClass('active');

    cinemaId = $(this).data("cinema-id");

    $("#dateButtons").empty();
    $("#timeButtons").empty();

    $.ajax({
      url: `http://localhost:8000/showtimes/available-dates`,
      type: "GET",
      data: {
        film_id: movieId,
        cinema_id: cinemaId
      },
      success: function (response) {
        const dateList = $("#dateButtons").empty();
        response.forEach(function (d) {
          const button = $("<button></button>")
            .text(d.date_formatted)
            .attr("data-date", d.date);
          dateList.append(button);
        });
      },
      error: function () {
        $("#dateButtons").html("<p>Không có ngày chiếu phù hợp.</p>");
      }
    });
  });

  // 🔵 Khi chọn ngày → Gọi API lấy danh sách giờ chiếu
  $(document).on('click', '#dateButtons button', function () {
    $('#dateButtons button').removeClass('active');
    $(this).addClass('active');

    date = $(this).data("date");
    $("#timeButtons").empty();

    $.ajax({
      url: `http://localhost:8000/showtimes/available-times`,
      type: "GET",
      data: {
        film_id: movieId,
        cinema_id: cinemaId,
        show_date: date
      },
      success: function (response) {
        const timeList = $("#timeButtons").empty();
        response.forEach(function (t) {
          const button = $("<button></button>")
            .text(t.time_formatted)
            .attr("data-time", t.time_formatted)
            .attr("data-showtime-id", t.id);
          timeList.append(button);
        });
      },
      error: function () {
        $("#timeButtons").html("<p>Không có suất chiếu nào.</p>");
      }
    });
  });

  // 🔴 Khi chọn giờ → Gọi loadSeats(showtimeId)
  $(document).on('click', '#timeButtons button', function () {
    $('#timeButtons button').removeClass('active');
    $(this).addClass('active');

    time = $(this).data("time");
    showtimeId = $(this).data("showtime-id");

    console.log("Showtime đã chọn:", showtimeId);

    // Gọi hàm sẵn có của bạn
    loadSeats(showtimeId);

    // Gắn lại sự kiện click cho ghế
    $(document).off('click', '.seat.available');
    $(document).on('click', '.seat.available', function () {
      $(this).toggleClass('selected');
      calculateTotal(); // Hàm tính tổng giá vé
    });
  });
});

$(document).on("click", "#closeConfirmBox", function () {
  $('#confirmBox').fadeOut();
});

