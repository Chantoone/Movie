let type_room ;
let basePrice = 0;
let cinemaId, date, time, showtimeId,roomId;
let totalbill =0;
function loadSeats(id_showtime) {
  $.ajax({
    url: "http://localhost:8000/seat/" + id_showtime,
    method: 'GET',
    success: function (data) {
      const seats = data.seats;
      const seatMap = $('#seatMap');
      roomId=data.id_room;
      // Clear existing seats
      seatMap.empty();

      // Sort seats by name for proper display
      seats.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));

      // Group seats by row (first character of seat name)
      const rows = {};
      seats.forEach(seat => {
        const rowName = seat.name.charAt(0);
        if (!rows[rowName]) {
          rows[rowName] = [];
        }
        rows[rowName].push(seat);
      });

      // Generate seats by row
      Object.keys(rows).sort().forEach(rowName => {
        const rowSeats = rows[rowName];

        // Add a row container for better styling
        const rowDiv = $('<div class="seat-row"></div>');
        rowDiv.append(`<div class="row-label">${rowName}</div>`);

        // Add seats to this row
        rowSeats.forEach(seat => {
          const seatDiv = $('<div></div>');
          seatDiv.addClass('seat');
          seatDiv.attr('data-seat', seat.name);
          seatDiv.attr('id', seat.id_seat); // Add id attribute using id_seat from API
          seatDiv.text(seat.name);

          // Add class based on seat type
          if (seat.type === 'VIP') {
            seatDiv.addClass('vip');
          } else {
            seatDiv.addClass('regular');
          }

          // Add class based on seat state
          if (seat.state === 'BOOKED') {
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


  if (type_room === "2D") {
    basePrice = 50000;
  } else {
    basePrice = 80000;
  }

  $('.seat.selected').each(function () {
    let seatType = $(this).hasClass('vip') ? 'VIP' : 'regular';
    if (seatType === 'VIP') {
      total += basePrice + 70000;
    } else {
      total += basePrice + 50000;
    }
  });

  $('.food-item').each(function () {
    let quantity = parseInt($(this).find('.quantity').text());
    let price = parseInt($(this).attr('data-price'));
    total += quantity * price;
  });
    totalbill=total;

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

    let amount = totalbill;
  console.log(amount);

  let qrurl = `https://img.vietqr.io/image/TPB-61398625980-compact2.png?amount=${amount}&addInfo=thanh%20toan%20&accountName=ZCINEMA`;
  qr=$("#qr");
  qr.attr("src",qrurl)
  $('#confirmBox').fadeIn();
  let checkInterval = setInterval(function () {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      $.ajax({
            url: "http://localhost:8000/receipt/check-transaction/",
            method: "GET",
            data:{
                "transaction_date_min":formattedDate,
                "amount_in":totalbill
            },
            success: function (response) {
              if (response.messages?.success && response.transactions?.length > 0) {
                  let $toast = $('#paymentToastCenter');
                  $toast.addClass('show');
                  $('#confirmBox').fadeOut();
                  const receiptData = {
                  id_user: localStorage.getItem("id_user"), // hoặc cách bạn lấy user hiện tại
                      method_pay: "VNPAY",
                  tickets: [],
                  foods: []
                    };
                  $('.seat.selected').each(function () {

                  receiptData.tickets.push({
                    id_seat: parseInt($(this).attr('id')),
                    id_room: parseInt(roomId), // cần set data-room-id cho mỗi row
                    id_showtime: parseInt(showtimeId),
                    price: $(this).hasClass('vip') ? 70000+ basePrice : 50000 +basePrice // hoặc tính theo room/type_room
                  });
                });
                  $('.food-item').each(function () {
                  let quantity = parseInt($(this).find('.quantity').text());
                  if (quantity > 0) {
                    receiptData.foods.push({
                      id_food: parseInt($(this).data("id")),
                      quantity: quantity
                    });
                  }
                });
                  $.ajax({
                  url: "http://localhost:8000/receipt/", // endpoint đã viết bằng FastAPI
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify(receiptData),
                  success: function (response) {

                  },
                  error: function () {
                    alert("Đã xảy ra lỗi khi tạo hóa đơn!");
                  }
                });

                  // 4. Tự ẩn sau 3 giây
                  setTimeout(function () {
                    $toast.removeClass('show');
                  }, 2000);
                  setTimeout(function () {
                      window.location.href="home.html"
                  },1000)
                  clearInterval(checkInterval);
                } else {
                  console.log("⏳ Chưa thấy giao dịch hợp lệ, tiếp tục kiểm tra...");
                }
            },
            error: function (xhr) {
              console.error("Lỗi khi gọi API:", xhr.responseText);

            }
      });
  },5000)

});

$(document).ready(function () {
    $.ajax({
        url:"http://localhost:8000/food/",
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
$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get("id");



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
                    button.attr("data-showtime-id", response.id_showtime);
                    timeList.append(button);
                });
            }
        });
    });


    $(document).on('click', '#timeButtons button', function () {
        $('#timeButtons button').removeClass('active');
        $(this).addClass('active');

        time = $(this).attr("data-time");
        showtimeId = $(this).attr("data-showtime-id");

        console.log("Giờ đã chọn:", time);
        console.log("ID Showtime đã chọn:", showtimeId);
        $.ajax({
        url:"http://localhost:8000/room/",
        type: "GET",
        data:{"id_showtime":showtimeId},
        success: function (response) {
            type_room=response.type;
            console.log(type_room)
            loadSeats(showtimeId);
            $(document).off('click', '.seat.available');
            $(document).on('click', '.seat.available', function() {
            $(this).toggleClass('selected');
            calculateTotal();

        });
        }
        })



    });


});
$(document).on("click", "#closeConfirmBox", function () {
  $('#confirmBox').fadeOut();
});

