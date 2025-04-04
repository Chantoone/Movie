export function checkToken(token) {
  return new Promise((resolve, reject) => {
    if (!token || token.trim() === "") {
      reject("Token rỗng");
    } else {
      resolve("Token hợp lệ");
    }
  });
}
