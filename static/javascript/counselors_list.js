// Script for future functionalities, e.g., search filtering
document.getElementById("search-input").addEventListener("input", function () {
  // Implement search functionality
});

// script.js

document.getElementById("sort-button").addEventListener("click", function () {
  // 추천순 정렬 기능 구현
  // 현재는 기본 템플릿이므로 추후 데이터와 함께 기능 구현 필요
});
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
console.log("정정현");

let counselor_id = 1;

let pics = document.getElementsByClassName("image-wrapper");
let names = document.getElementsByClassName("counselor-name")
let reviews = document.getElementsByClassName("review-number")
let stars = document.getElementsByClassName("stars")
// let rn = document.getElementsByClassName("review-number")[0];
// let sr = document.getElementsByClassName("star-rating")[0];
// let it = document.getElementsByTagName("p")[1]

// const formData = new FormData();
// formData.append("name", name);
// formData.append("email", email);

fetch(`/api/counselors/`, {
  method: "GET",
  //   body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    for (let i = 0; i < data.length; i++) {
      let counselor = data[i];
      pics[2 + 6 * i].src = counselor.profile_img_path
      names[i].innerHTML = counselor.counselor_name
      reviews[i].innerHTML = counselor.num_of_reviews

      for (let j = 0; j < Math.floor(counselor.star_ratio); j++) {
        let star_img = document.createElement("img")
        star_img.src = "/static/images/로고2svg.svg"
        stars[i].appendChild(star_img)
      }

      let star_span = document.createElement("span")
      star_span.className = "star-rating"
      star_span.innerHTML = counselor.star_ratio
      stars[i].appendChild(star_span)
    }
    // let 상담사이름 = data.counselor_name;
    // let 리뷰개수 = data.num_of_reviews;
    // let 별개수 = data.star_ratio;
    // let 상담사소개 = data.introduction;


    // name_h1.innerHTML = 상담사이름;
    // rn.innerHTML = 리뷰개수;
    // sr.innerHTML = 별개수;
    // it.innerHTML = 상담사소개;
  })
  .catch((error) => {
    console.error("Error:", error);
  });