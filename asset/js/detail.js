  const commentsData = [
      { text: "Phim siêu cuốn luôn mọi người oiwii.", author: "Nguyễn Văn A" },
      { text: "Bộ phim tuyệt vời và có nội dung ý nghĩa.", author: "Trần Thị B" },
      { text: "Đặc hiệu trong hoạt hình, cực kỳ ấn tượng!", author: "Lê Văn C" },
      { text: "Diễn xuất tuyệt vời, cốt truyện hấp dẫn.", author: "Nguyễn Thị D" },
      { text: "Tôi rất thích cách kể chuyện trong phim này.", author: "Phạm Văn E" },
      { text: "Hiệu ứng hình ảnh đỉnh cao!", author: "Đỗ Thị F" },
      { text: "Không thể chờ đợi xem phần tiếp theo.", author: "Hoàng Văn G" },
      { text: "Âm nhạc của phim rất hay và phù hợp.", author: "Nguyễn Văn H" },
      { text: "Cốt truyện độc đáo và sáng tạo.", author: "Trần Thị I" },
      { text: "Diễn viên thể hiện rất xuất sắc.", author: "Lê Văn K" },
      { text: "Một trải nghiệm điện ảnh tuyệt vời.", author: "Phạm Thị L" }
    ];

    let commentsShown = 0;
    const commentsPerLoad = 5;
    const commentsContainer = document.getElementById('commentsContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    function loadComments() {
      const nextComments = commentsData.slice(commentsShown, commentsShown + commentsPerLoad);
      nextComments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `
          <p class="comment-text">${comment.text}</p>
          <p class="comment-author">${comment.author}</p>
        `;
        commentsContainer.appendChild(commentDiv);
      });
      commentsShown += nextComments.length;
      if (commentsShown >= commentsData.length) {
        loadMoreBtn.style.display = 'none';
      }
    }

    // Load bình luận ban đầu
    loadComments();

    loadMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loadComments();
    });