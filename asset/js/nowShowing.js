
    // Script cho các slider phim
    document.addEventListener("DOMContentLoaded", function() {
      const sliderWrappers = document.querySelectorAll('.movie-slider-wrapper');

      sliderWrappers.forEach(wrapper => {
        const id = wrapper.id.split('-')[1]; // Lấy id của slider (ví dụ: tinhcam, hanhdong)
        const slider = wrapper.querySelector('.movie-slider');
        const cards = slider.querySelectorAll('.movie-card');
        const dotsContainer = document.getElementById(`dots-${id}`);

        // Số phim hiển thị cùng lúc
        const cardsToShow = window.innerWidth <= 768 ? 2 : 4;

        // Khởi tạo vị trí hiện tại và tổng số vị trí có thể di chuyển
        let currentPosition = 0;
        const maxPosition = Math.max(0, cards.length - cardsToShow);

        // Tạo dots cho slider
        const totalDots = maxPosition + 1;
        for (let i = 0; i < totalDots; i++) {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          if (i === 0) dot.classList.add('active');
          dot.dataset.position = i;
          dot.addEventListener('click', () => {
            moveToPosition(i);
          });
          dotsContainer.appendChild(dot);
        }

        // Hàm di chuyển slider
        function moveToPosition(position) {
          currentPosition = position;
          updateSlider();
        }

        // Cập nhật slider
        function updateSlider() {
          // Tính toán vị trí cần di chuyển
          const cardWidth = cards[0].offsetWidth;
          const translateX = -currentPosition * cardWidth;

          // Di chuyển slider
          slider.style.transform = `translateX(${translateX}px)`;

          // Cập nhật trạng thái active cho dots
          const dots = dotsContainer.querySelectorAll('.dot');
          dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPosition);
          });
        }

        // Xử lý nút Previous
        document.getElementById(`prev-${id}`).addEventListener('click', function() {
          if (currentPosition > 0) {
            currentPosition--;
            updateSlider();
          }
        });

        // Xử lý nút Next
        document.getElementById(`next-${id}`).addEventListener('click', function() {
          if (currentPosition < maxPosition) {
            currentPosition++;
            updateSlider();
          }
        });

        // Cập nhật khi resize cửa sổ
        window.addEventListener('resize', function() {
          // Cập nhật số lượng phim hiển thị dựa trên kích thước màn hình
          const newCardsToShow = window.innerWidth <= 768 ? 2 : 4;
          if (cardsToShow !== newCardsToShow) {
            // Nếu số lượng phim hiển thị thay đổi, cập nhật lại slider
            location.reload();
          }
          updateSlider();
        });

        // Khởi tạo ban đầu
        updateSlider();
      });
    });
