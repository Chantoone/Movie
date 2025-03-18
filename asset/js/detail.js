  // const commentsData = [
  //     { text: "Phim siêu cuốn luôn mọi người oiwii.", author: "Nguyễn Văn A" },
  //     { text: "Bộ phim tuyệt vời và có nội dung ý nghĩa.", author: "Trần Thị B" },
  //     { text: "Đặc hiệu trong hoạt hình, cực kỳ ấn tượng!", author: "Lê Văn C" },
  //     { text: "Diễn xuất tuyệt vời, cốt truyện hấp dẫn.", author: "Nguyễn Thị D" },
  //     { text: "Tôi rất thích cách kể chuyện trong phim này.", author: "Phạm Văn E" },
  //     { text: "Hiệu ứng hình ảnh đỉnh cao!", author: "Đỗ Thị F" },
  //     { text: "Không thể chờ đợi xem phần tiếp theo.", author: "Hoàng Văn G" },
  //     { text: "Âm nhạc của phim rất hay và phù hợp.", author: "Nguyễn Văn H" },
  //     { text: "Cốt truyện độc đáo và sáng tạo.", author: "Trần Thị I" },
  //     { text: "Diễn viên thể hiện rất xuất sắc.", author: "Lê Văn K" },
  //     { text: "Một trải nghiệm điện ảnh tuyệt vời.", author: "Phạm Thị L" }
  //   ];
  //
  //   let commentsShown = 0;
  //   const commentsPerLoad = 5;
  //   const commentsContainer = document.getElementById('commentsContainer');
  //   const loadMoreBtn = document.getElementById('loadMoreBtn');
  //
  //   function loadComments() {
  //     const nextComments = commentsData.slice(commentsShown, commentsShown + commentsPerLoad);
  //     nextComments.forEach(comment => {
  //       const commentDiv = document.createElement('div');
  //       commentDiv.classList.add('comment');
  //       commentDiv.innerHTML = `
  //         <p class="comment-text">${comment.text}</p>
  //         <p class="comment-author">${comment.author}</p>
  //       `;
  //       commentsContainer.appendChild(commentDiv);
  //     });
  //     commentsShown += nextComments.length;
  //     if (commentsShown >= commentsData.length) {
  //       loadMoreBtn.style.display = 'none';
  //     }
  //   }
  //
  //   // Load bình luận ban đầu
  //   loadComments();
  //
  //   loadMoreBtn.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     loadComments();
  //   });
$(document).ready(function (){
        const queryString = window.location.search;
    // Tạo đối tượng URLSearchParams từ chuỗi query
    const urlParams = new URLSearchParams(queryString);
    // Lấy giá trị của tham số "id"
    const movieId = urlParams.get("id");
    console.log(movieId)
    $.ajax({
        url: "http://localhost:8000/movie/"+movieId,
        type: "GET",
        data: {id: movieId},
        success: function (response) {
    var poster = $(".movie-poster")  ;
    var imgsrc="../asset/images/"+response.poster;
    var img =$("<img>");
    img.attr("src",imgsrc);
    img.attr('alt',`poster phim ${response.id_movie}`);
    poster.prepend(img);

    var divTiltle =$(".movie-info-text")
    var h1 =$("<h1></h1>").text(response.name).attr('class',"movie-title").attr('id',response.id_movie)
    divTiltle.prepend(h1);

    var div = $(".movie-info");

    // Nội Dung
    var pOverview = $("<p></p>");
    var strongOverview = $("<strong></strong>").text("Nội Dung: ");
    pOverview.append(strongOverview);
    if (response.overview != null) {
        pOverview.append(response.overview);
    } else {
        pOverview.append("(Đang cập nhật)");
    }
    div.append(pOverview);

    // Diễn viên
    var pActor = $("<p></p>");
    var strongActor = $("<strong></strong>").text("Diễn viên: ");
    pActor.append(strongActor);
    if (response.actor != null && response.actor.trim() !== "") {
        pActor.append(response.actor);
    } else {
        pActor.append("(Đang cập nhật)");
    }
    div.append(pActor);

    // Đạo diễn
    var pDirector = $("<p></p>");
    var strongDirector = $("<strong></strong>").text("Đạo diễn: ");
    pDirector.append(strongDirector);
    if (response.director != null && response.director.trim() !== "") {
        pDirector.append(response.director);
    } else {
        pDirector.append("(Đang cập nhật)");
    }
    div.append(pDirector);

    // Thể loại
    var pType = $("<p></p>");
    var strongType = $("<strong></strong>").text("Thể loại: ");
    pType.append(strongType);
    if (response.type != null && response.type.length > 0) {
        // Nếu response.type là mảng, ghép các phần tử bằng dấu phẩy
        if (Array.isArray(response.type)) {
            pType.append(response.type.join(", "));
        } else {
            pType.append(response.type);
        }
    } else {
        pType.append("(Đang cập nhật)");
    }
    div.append(pType);

    // Thời lượng
    var pTime = $("<p></p>");
    var strongTime = $("<strong></strong>").text("Thời lượng: ");
    pTime.append(strongTime);
    if (response.time != null && response.time !== "") {
        // Giả sử thời lượng được tính bằng phút
        pTime.append(response.time + " phút");
    } else {
        pTime.append("(Đang cập nhật)");
    }
    div.append(pTime);
    var state =response.state;
    if (state=="NOW_SHOWING"){
        var tmp=$(".movie-actions");
        var button =$("<button></button>");
        button.text("Chọn Ghế");
        button.attr("class","choose-seat");
        tmp.append(button);
    }

},
        error: function(xhr, status, error) {
        console.error("Lỗi khi gọi API: ", error);}



    });


    })