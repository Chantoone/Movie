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

     document.getElementById('nextMovie').addEventListener('click', function () {
         currentNewIndex++;
         updateNewSlider();
     });
     document.getElementById('prevMovie').addEventListener('click', function () {
         currentNewIndex--;
         updateNewSlider();
     });
 });

