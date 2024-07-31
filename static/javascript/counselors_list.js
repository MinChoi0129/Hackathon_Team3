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

let pics = document.getElementsByClassName("counselorimg");
let names = document.getElementsByClassName("counselor-name")
let reviews = document.getElementsByClassName("review-number")
let stars = document.getElementsByClassName("stars")
let shortinfo = document.getElementsByClassName("counselor-intro")
let hashtags = document.getElementsByClassName("hashtags")
 // 도큐먼트랑 연결할게요 ~~ ~~~~~

fetch(`/api/counselors/`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    for (let i = 0; i < data.length; i++) {
      let counselor = data[i]; // counselor 배열에는 "각" 상담사 정보가 들어있음

      // 상담사 사진 
      pics[i].src = counselor.profile_img_path // "src" 추가
      // 상담사 이름
      names[i].innerHTML = counselor.counselor_name // >< 안에 추가
      // 상담사 후기 갯수
      reviews[i].innerHTML = counselor.num_of_reviews // >< 안에 추가
      // 상담사 별점 그림
      for (let j = 0; j < Math.floor(counselor.star_ratio); j++) {
        let star_img = document.createElement("img") // img 태그를 생성할게요~~~ 변수명은 star_img
        star_img.src = "/static/images/로고2svg.svg" // img 태그에 'src' 속성 추가
        stars[i].appendChild(star_img) // 별점 그림을 넣을 '횟수'를 정하는 메소드
                                       // 생성된 태그를 도큐먼트에 연결
      }
      // 상담사 별점
      let star_span = document.createElement("span")
      star_span.className = "star-rating" // 생성된 span 태그의 classname 부여(css와 동일한 이름)
      star_span.innerHTML = counselor.star_ratio.toFixed(2) //생성된 태그의 >< //소수 점 둘째 자리까지만
      stars[i].appendChild(star_span) // 생성된 태그를 도큐먼트에 연결

      
      // 상담사 소개
      let shortinfofo = document.createElement('p')
      shortinfofo.innerHTML = counselor.short_info
      shortinfo[i].appendChild(shortinfofo)

    // //   // 상담사 해쉬태그
    //   let phstg = document.createElement("span")
    //   phstg.innerHTML = counselor.hash_tags
    //   hashtags[i].appendChild(phstg)
    
      // 상담사 해쉬태그
      let split_hashtags = counselor.hash_tags.split(" "); // 해시태그 문자열을 공백을 기준으로 나눔
      for (let k = 0; k < split_hashtags.length; k++) { // 나눠진 조각 수만큼 반복
        let phstg = document.createElement("span"); // span 태그 생성
        let hashtag_text = document.createTextNode(split_hashtags[k] + " "); // 각 해시태그에 대한 텍스트 노드 생성
        phstg.appendChild(hashtag_text); // 텍스트 노드를 span 요소에 추가
        hashtags[i].appendChild(phstg); // 생성된 span 요소를 부모 요소에 추가
      }

      
    }

  })
  .catch((error) => {
    console.error("Error:", error);
  });