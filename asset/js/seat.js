// Hiển thị danh sách rạp khi bấm vào nút "Trọn rạp"
    const toggleCinemaListBtn = document.getElementById('toggleCinemaList');
    const cinemaList = document.getElementById('cinemaList');
    toggleCinemaListBtn.addEventListener('click', function() {
      cinemaList.style.display = (cinemaList.style.display === 'block') ? 'none' : 'block';
    });

    // Xử lý chọn rạp: Khi bấm vào nút trong danh sách rạp, ô đó chuyển sang màu xanh
    const cinemaButtons = cinemaList.querySelectorAll('button');
    cinemaButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        cinemaButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Chọn ngày
    const dateButtons = document.getElementById('dateButtons').querySelectorAll('button');
    dateButtons.forEach(button => {
      button.addEventListener('click', function() {
        dateButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Chọn giờ
    const timeButtons = document.getElementById('timeButtons').querySelectorAll('button');
    timeButtons.forEach(button => {
      button.addEventListener('click', function() {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Xử lý chọn ghế: Chỉ cho phép chọn ghế chưa được đặt (booked)
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
      seat.addEventListener('click', function() {
        if (this.classList.contains('booked')) return;
        this.classList.toggle('selected');
      });
    });
 document.querySelectorAll('.plus').forEach(btn => {
      btn.addEventListener('click', function() {
        const quantityElem = this.parentElement.querySelector('.quantity');
        let quantity = parseInt(quantityElem.innerText);
        quantity++;
        quantityElem.innerText = quantity;
        updateTotal();
      });
    });
    // Lắng nghe sự kiện cho các nút trừ
    document.querySelectorAll('.minus').forEach(btn => {
      btn.addEventListener('click', function() {
        const quantityElem = this.parentElement.querySelector('.quantity');
        let quantity = parseInt(quantityElem.innerText);
        if (quantity > 0) {
          quantity--;
          quantityElem.innerText = quantity;
          updateTotal();
        }
      });
    });
    // Hàm cập nhật tổng tiền
    function updateTotal() {
      let total = 0;
      document.querySelectorAll('.food-item').forEach(item => {
        const price = parseInt(item.getAttribute('data-price'));
        const quantity = parseInt(item.querySelector('.quantity').innerText);
        total += price * quantity;
      });
      document.querySelector('.total-price').innerText = `THANH TOÁN: ${total.toLocaleString()} VND`;
    }