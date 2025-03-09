 document.addEventListener("DOMContentLoaded", function() {
    // ========== SLIDER BANNER TRÊN CÙNG ==========
    let slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    function prevSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    setInterval(nextSlide, 3000);


    let newSlider = document.querySelector('.new-slider');
    let newCards = document.querySelectorAll('.new-slider .movie-card');
    let currentNewIndex = 0;

    function updateNewSlider() {
      let totalCards = newCards.length;
      let maxIndex = totalCards - 4;
      if (maxIndex < 0) maxIndex = 0;

      if (currentNewIndex < 0) currentNewIndex = maxIndex;
      if (currentNewIndex > maxIndex) currentNewIndex = 0;

      let cardWidth = newCards[0].offsetWidth;
      let shift = currentNewIndex * cardWidth;
      newSlider.style.transform = `translateX(-${shift}px)`;
    }

    document.getElementById('nextMovie').addEventListener('click', function() {
      currentNewIndex++;
      updateNewSlider();
    });
    document.getElementById('prevMovie').addEventListener('click', function() {
      currentNewIndex--;
      updateNewSlider();
    });




    // ========== SLIDER "PHIM ĐANG HOT" ==========
    let hotSlider = document.querySelector('.hot-slider');
    let hotCards = document.querySelectorAll('.hot-slider .movie-card');
    let currentHotIndex = 0;

    function updateHotSlider() {
      let totalCards = hotCards.length;
      let maxIndex = totalCards - 4;
      if (maxIndex < 0) maxIndex = 0;

      if (currentHotIndex < 0) currentHotIndex = maxIndex;
      if (currentHotIndex > maxIndex) currentHotIndex = 0;

      let cardWidth = hotCards[0].offsetWidth;
      let shift = currentHotIndex * cardWidth;
      hotSlider.style.transform = `translateX(-${shift}px)`;
    }

    document.getElementById('nextHot').addEventListener('click', function() {
      currentHotIndex++;
      updateHotSlider();
    });
    document.getElementById('prevHot').addEventListener('click', function() {
      currentHotIndex--;
      updateHotSlider();
    });

    // Khởi tạo vị trí ban đầu (tránh lỗi hiển thị ngay khi load)
    updateMovieSlider();
    updateHotSlider();

    // Nếu muốn tự cập nhật khi thay đổi kích thước cửa sổ:
    window.addEventListener('resize', function() {
      updateMovieSlider();
      updateHotSlider();
    });
  });