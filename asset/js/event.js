 function initSlider(wrapperId, sliderSelector, prevBtnId, nextBtnId, progressId) {
        const wrapper = document.getElementById(wrapperId);
        const slider = wrapper.querySelector(sliderSelector);
        const items = slider.children;
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const progressBar = document.getElementById(progressId).querySelector('.progress-bar');

        // Vị trí hiện tại
        let position = 0;
        // Số lượng card hiển thị cùng lúc
        const showCount = 3;
        // Tổng số lượng card
        const totalItems = items.length;
        // Số lượng card còn lại (không bao gồm 3 card đầu tiên)
        const remainingItems = totalItems - showCount;

        // Set up ban đầu: hiển thị 3 card đầu tiên
        for (let i = 0; i < items.length; i++) {
            if (i < showCount) {
                items[i].style.display = 'block';
            } else {
                items[i].style.display = 'none';
            }
        }

        // Cập nhật progress bar
        function updateProgress() {
            const progress = (position / remainingItems) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Xử lý click next
        nextBtn.addEventListener('click', function() {
            if (position < remainingItems) {
                // Ẩn card đầu tiên trong khung nhìn hiện tại
                items[position].style.display = 'none';
                // Hiển thị card tiếp theo (nằm ngoài khung nhìn hiện tại)
                items[position + showCount].style.display = 'block';
                // Tăng vị trí
                position++;
                updateProgress();
            }
        });

        // Xử lý click previous
        prevBtn.addEventListener('click', function() {
            if (position > 0) {
                // Giảm vị trí
                position--;
                // Hiển thị lại card trước đó (đã bị ẩn)
                items[position].style.display = 'block';
                // Ẩn card cuối cùng trong khung nhìn hiện tại
                items[position + showCount].style.display = 'none';
                updateProgress();
            }
        });

        // Khởi tạo progress bar
        updateProgress();
    }

    // Khởi tạo slider cho Khuyến mãi
    initSlider("slider-promo", ".slider", "prev-promo", "next-promo", "progress-promo");
    // Khởi tạo slider cho Tin tức
    initSlider("slider-news", ".slider", "prev-news", "next-news", "progress-news");
const promotions = [
    {
        id: 1,
        title: "CÓN BÁO SALE SIÊU KHỦNG TẠI BHD STAR",
        date: "20/12/2024",
        image: "../asset/image/pro1.jpg",
        content: `
            <h2>CÓN BÁO "SALE" SIÊU KHỦNG TẠI BHD STAR</h2>
            <p>ĐÓN NHẬN CƠN BÃO "SALE" SIÊU KHỦNG KHIẾP TẠI BHD STAR CINEPLEX.</p>
            <p>+ Tặng ngay 01 PEPSI (trị giá 36.000đ) khi mua 2 vé xem phim bất kì.</p>
            <p>+ Chỉ với 59.000đ có ngay COMBO "ĐÃ KHÁT ĐÃ THÈM" (1 Bắp + 1 nước).</p>
            <p>* Ưu đãi áp dụng từ: 04.01.2024 – 28.01.2025 (Không giới hạn số lần sử dụng).</p>
            <p>* Áp dụng cho tất cả các cụm rạp tại Hồ Chí Minh, Hà Nội và Huế.</p>
        `
    },
    {
        id: 2,
        title: "Khuyến mãi 2",
        date: "15/12/2024",
        image: "../asset/image/pro2.jpg",
        content: `
            <h2>Khuyến mãi 2</h2>
            <p>Mô tả chi tiết về khuyến mãi 2. Thông tin về ưu đãi, thời gian áp dụng và các điều kiện liên quan.</p>
            <p>Nội dung chi tiết sẽ được hiển thị tại đây.</p>
        `
    },
    {
        id: 3,
        title: "Khuyến mãi 3",
        date: "10/12/2024",
        image: "../asset/image/pro3.jpg",
        content: `
            <h2>Khuyến mãi 3</h2>
            <p>Mô tả chi tiết về khuyến mãi 3. Thông tin về ưu đãi, thời gian áp dụng và các điều kiện liên quan.</p>
            <p>Nội dung chi tiết sẽ được hiển thị tại đây.</p>
        `
    },
    {
        id: 4,
        title: "Khuyến mãi 4",
        date: "05/12/2024",
        image: "../asset/image/pro4.jpg",
        content: `
            <h2>Khuyến mãi 4</h2>
            <p>Mô tả chi tiết về khuyến mãi 4. Thông tin về ưu đãi, thời gian áp dụng và các điều kiện liên quan.</p>
            <p>Nội dung chi tiết sẽ được hiển thị tại đây.</p>
        `
    },
    {
        id: 5,
        title: "Khuyến mãi 5",
        date: "01/12/2024",
        image: "../asset/image/pro2.jpg",
        content: `
            <h2>Khuyến mãi 5</h2>
            <p>Mô tả chi tiết về khuyến mãi 5. Thông tin về ưu đãi, thời gian áp dụng và các điều kiện liên quan.</p>
            <p>Nội dung chi tiết sẽ được hiển thị tại đây.</p>
        `
    }
];

// Dữ liệu mẫu cho các tin tức
const news = [
    {
        id: 1,
        title: "Tin tức 1",
        date: "20/12/2024",
        image: "../asset/image/new2.jpg",
        content: `
            <h2>Tin tức 1</h2>
            <p>Nội dung chi tiết về tin tức 1.</p>
            <p>Thông tin cập nhật về sự kiện, phim mới, và các hoạt động của ZCINEMA.</p>
        `
    },
    {
        id: 2,
        title: "Tin tức 2",
        date: "15/12/2024",
        image: "../asset/image/new2.jpg",
        content: `
            <h2>Tin tức 2</h2>
            <p>Nội dung chi tiết về tin tức 2.</p>
            <p>Thông tin cập nhật về sự kiện, phim mới, và các hoạt động của ZCINEMA.</p>
        `
    },
    {
        id: 3,
        title: "Tin tức 3",
        date: "10/12/2024",
        image: "../asset/image/new2.jpg",
        content: `
            <h2>Tin tức 3</h2>
            <p>Nội dung chi tiết về tin tức 3.</p>
            <p>Thông tin cập nhật về sự kiện, phim mới, và các hoạt động của ZCINEMA.</p>
        `
    },
    {
        id: 4,
        title: "Tin tức 4",
        date: "05/12/2024",
        image: "../asset/image/new2.jpg",
        content: `
            <h2>Tin tức 4</h2>
            <p>Nội dung chi tiết về tin tức 4.</p>
            <p>Thông tin cập nhật về sự kiện, phim mới, và các hoạt động của ZCINEMA.</p>
        `
    },
    {
        id: 5,
        title: "Tin tức 5",
        date: "01/12/2024",
        image: "../asset/image/new2.jpg",
        content: `
            <h2>Tin tức 5</h2>
            <p>Nội dung chi tiết về tin tức 5.</p>
            <p>Thông tin cập nhật về sự kiện, phim mới, và các hoạt động của ZCINEMA.</p>
        `
    }
];

// Hàm để hiển thị popup với nội dung được chỉ định
function showPopup(contentHTML) {
    const popup = document.getElementById('popup-overlay');
    const popupContent = popup.querySelector('.popup-content');

    popupContent.innerHTML = contentHTML;
    popup.style.display = 'flex';

    // Ngăn cuộn trang khi popup đang mở
    document.body.style.overflow = 'hidden';
}

// Hàm để ẩn popup
function hidePopup() {
    const popup = document.getElementById('popup-overlay');
    popup.style.display = 'none';

    // Cho phép cuộn trang trở lại
    document.body.style.overflow = 'auto';
}

// Thêm sự kiện click cho nút đóng popup
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close-popup');
    closeBtn.addEventListener('click', hidePopup);

    // Đóng popup khi click vào overlay (ngoài vùng nội dung)
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });

    // Thêm sự kiện click cho tất cả các card khuyến mãi
    const promoCards = document.querySelectorAll('.promo-card');
    promoCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (index < promotions.length) {
                showPopup(promotions[index].content);
            }
        });
    });

    // Thêm sự kiện click cho tất cả các card tin tức
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (index < news.length) {
                showPopup(news[index].content);
            }
        });
    });
});
