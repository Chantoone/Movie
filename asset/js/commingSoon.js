function initSlider() {
    let slides = document.querySelectorAll('.slide');
    // Nếu không có slide nào, thoát sớm
    if (!slides.length) return;

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

    // Gắn sự kiện cho nút
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    // Slide đầu tiên active
    slides[0].classList.add('active');

    // Tự động chuyển slide
    if (slides.length > 1) {
      setInterval(nextSlide, 3000);
    }
  }

  // Hàm để kiểm tra và xử lý ảnh
  function handleImageFallback(img, localSrc, backendSrc) {
    img.onerror = function() {
      console.log("Không tìm thấy ảnh trong assets, đang tải từ backend: " + backendSrc);
      img.src = backendSrc;
      
      // Nếu ảnh từ backend cũng không tải được, hiển thị ảnh mặc định
      img.onerror = function() {
        console.error("Không thể tải ảnh từ cả hai nguồn");
        img.src = "../asset/image/post (1).jpg"; // Ảnh mặc định
      };
    };
    img.src = localSrc;
  }

  // Khi DOM đã sẵn sàng
  $(document).ready(function() {
    // Gọi AJAX để lấy danh sách banner
    $.ajax({
      url: "http://localhost:8000/movie/banner/", // Backend API
      type: "GET",
      data: { state: "COMING_SOON" },
      success: function(response) {
        var arrowRight = $("#nextBtn");
        // Thêm slide vào DOM
        $.each(response.movies, function(index, movie) {
          var localBannerSrc = "../asset/images/" + movie.banner;
          // Fix double slash issue by checking if the banner starts with a slash
          var backendBannerSrc;
          if (movie.banner && movie.banner.startsWith('/static')) {
            backendBannerSrc = "http://localhost:8000" + movie.banner;
          } else {
            backendBannerSrc = "http://localhost:8000/images/" + movie.banner;
          }
          
          var slide = $('<div class="slide"></div>');
          var img = $('<img>').attr("alt", "Banner " + (index + 1));
          
          // Áp dụng cơ chế fallback cho ảnh
          handleImageFallback(img[0], localBannerSrc, backendBannerSrc);
          
          slide.append(img);
          // Chèn trước nút mũi tên phải
          slide.insertBefore(arrowRight);
        });
        // Gọi hàm khởi tạo slider sau khi đã thêm slide
        initSlider();
      },
      error: function(xhr, status, error) {
        console.error("Lỗi khi gọi API: ", error);
      }
    });
    $.ajax({
        url: "http://localhost:8000/movie/",
        type: "GET",
        data: { state: "COMING_SOON"},
        success: function (response){
            var h2 =$(".movie-grid");
            response.movies.forEach( function (movie,index) {
                var localImgSrc = "../asset/images/" + movie.poster;
                // Fix double slash issue by checking if the poster starts with a slash
                var backendImgSrc;
                if (movie.poster && movie.poster.startsWith('/static')) {
                    backendImgSrc = "http://localhost:8000" + movie.poster;
                } else {
                    backendImgSrc = "http://localhost:8000/images/" + movie.poster;
                }
                
                var card = $('<div class ="movie-card"></div>');
                var img = $('<img>').attr("alt", "phim" + (index+1));
                
                // Áp dụng cơ chế fallback cho ảnh
                handleImageFallback(img[0], localImgSrc, backendImgSrc);
                
                var overlay = $('<div class="overlay">Chi tiết</div>').attr('id',movie.id_movie);
                var h3 = $('<h3>').text(movie.name)
                overlay.on("click", function (){
                    window.location.href="detail.html?id=" + movie.id_movie
                    // window.location.href="detail.html"
                })
                card.append(img)
                card.append(overlay)
                card.append(h3)
                h2.append(card)
            })
        },
        error: function(xhr, status, error) {
        console.error("Lỗi khi gọi API: ", error);
      }
    })
  });