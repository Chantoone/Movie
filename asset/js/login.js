function signup()
{
    document.querySelector(".login-form-container").style.cssText = "display: none;";
    document.querySelector(".signup-form-container").style.cssText = "display: block;";
    document.querySelector(".container").style.cssText = "background: linear-gradient(to bottom, rgb(56, 189, 149), rgb(28, 139, 106)); min-height: 100vh;";
    document.querySelector(".button-1").style.cssText = "display: none";
    document.querySelector(".button-2").style.cssText = "display: block";
};

function login()
{
    document.querySelector(".signup-form-container").style.cssText = "display: none;";
    document.querySelector(".login-form-container").style.cssText = "display: block;";
    document.querySelector(".container").style.cssText = "background: linear-gradient(to bottom, rgb(6, 108, 224), rgb(14, 48, 122)); min-height: 100vh;";
    document.querySelector(".button-2").style.cssText = "display: none";
    document.querySelector(".button-1").style.cssText = "display: block";
}

$(document).ready(function () {
    // $(".signup-button").click(function () {
    //     var name = $("#signupName").val();
    //     var phone = $("#signupPhone").val();
    //     var email = $("#signupEmail").val();
    //     var username = $("#signupUsername").val();
    //     var birthdate = $("#signupBirthdate").val();
    //     var address = $("#signupAddress").val();
    //     var pass = $("#signupPassword").val();
    //     var repass = $("#resignupPassword").val();
    //
    //     if (!name || !phone || !email || !username || !birthdate || !address || !pass) {
    //         alert("Vui lòng nhập đầy đủ thông tin!");
    //         return;
    //     }
    //     if (pass != repass) {
    //         alert("Mật khẩu không trùng nhau");
    //         return;
    //     }
    //     var phoneRegex = /^[0-9]{10,11}$/;
    //     if (!phoneRegex.test(phone)) {
    //         alert("Số điện thoại không hợp lệ!");
    //         return;
    //     }
    //     $.ajax({
    //         url: "http://localhost:8000/user/register",
    //         type: "POST",
    //         contentType: "application/json",
    //         data: JSON.stringify({
    //             full_name: name,
    //             email: email,
    //             phone_number: phone,
    //             birthdate: birthdate,
    //             address: address,
    //             username: username,
    //             password: pass
    //         }),
    //         success: function (response) {
    //             $("#signupMessage").text("Đăng ký thành công! Hãy đăng nhập.").css("color", "green");
    //             login();
    //         },
    //         error: function (xhr) {
    //             if (xhr.status == 400) {
    //                 $("#signupMessage").text("Email đã tồn tại!").css("color", "red");
    //             } else {
    //                 $("#signupMessage").text("Lỗi hệ thống, vui lòng thử lại sau.").css("color", "red");
    //             }
    //         }
    //     });
    // });
    $(".signup-button").click(function () {
  const name = $("#signupName").val().trim();
  const phone = $("#signupPhone").val().trim();
  const email = $("#signupEmail").val().trim();
  const username = $("#signupUsername").val().trim();
  const birthdate = $("#signupBirthdate").val().trim();
  const address = $("#signupAddress").val().trim();
  const pass = $("#signupPassword").val();
  const repass = $("#resignupPassword").val();

  // Kiểm tra dữ liệu
  if (!name || !phone || !email || !username || !birthdate || !address || !pass || !repass) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (pass !== repass) {
    alert("Mật khẩu không trùng nhau!");
    return;
  }

  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone)) {
    alert("Số điện thoại không hợp lệ!");
    return;
  }

  // Gửi dữ liệu lên API
  $.ajax({
    url: "http://localhost:8000/user/register",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      full_name: name,
      email: email,
      phone_number: phone,
      birthdate: birthdate,
      address: address,
      username: username,
      password: pass
    }),
    success: function (response) {
      $("#signupMessage")
        .text("Đăng ký thành công! Vui lòng đăng nhập.")
        .css("color", "green");

      // Lưu sẵn username để hỗ trợ auto-fill khi đăng nhập
      localStorage.setItem("last_username", username);

      // Chuyển về form đăng nhập
      login();
    },
    error: function (xhr) {
      if (xhr.status === 403) {
        $("#signupMessage").text("Tên đăng nhập đã tồn tại!").css("color", "red");
      } else {
        $("#signupMessage")
          .text("Lỗi hệ thống, vui lòng thử lại sau.")
          .css("color", "red");
      }
    }
  });
});

    // $(".login-button").click(function() {
    //     var username = $("#loginForm input[type='text']").val();
    //     var password = $("#loginForm input[type='password']").val();
    //
    //     if (!username || !password) {
    //         alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
    //         return;
    //     }
    //
    //     $.ajax({
    //         url: "http://localhost:8000/login",
    //         type: "POST",
    //         contentType: "application/x-www-form-urlencoded",
    //         data: {
    //             username: username,
    //             password: password
    //         },
    //         success: function(response) {
    //             localStorage.setItem("access_token", response.access_token); // Lưu token
    //
    //             window.location.href = "home.html"; // Chuyển hướng sau khi đăng nhập thành công
    //         },
    //         error: function(xhr) {
    //             if (xhr.status === 403) {
    //                 $("#loginMessage").text("Tên đăng nhập hoặc mật khẩu không đúng!").css("color", "red");
    //             } else {
    //                 $("#loginMessage").text("Lỗi hệ thống, vui lòng thử lại sau.").css("color", "red");
    //             }
    //         }
    //     });
    // });
    $(".login-button").click(function() {
  var username = $("#loginForm input[type='text']").val();
  var password = $("#loginForm input[type='password']").val();

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
    return;
  }

  $.ajax({
    url: "http://localhost:8000/login",
    type: "POST",
    contentType: "application/x-www-form-urlencoded",
    data: {
      username: username,
      password: password
    },
    success: function(response) {
      // ✅ Lưu token và roles vào localStorage
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("role", JSON.stringify(response.user.roles[0]));


      // ✅ Điều hướng sau khi đăng nhập
      window.location.href = "home.html";
    },
    error: function(xhr) {
      if (xhr.status === 406) {
        $("#loginMessage").text("Tên đăng nhập hoặc mật khẩu không đúng!").css("color", "red");
      } else {
        $("#loginMessage").text("Lỗi hệ thống, vui lòng thử lại sau.").css("color", "red");
      }
    }
  });
});


})