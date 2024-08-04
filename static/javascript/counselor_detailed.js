const reserveButton = document.querySelector(".btn-reserve");
reserveButton.addEventListener("click", function () {
  // 링크로 이동합니다.
  window.location.href = `/payment?counselor_item=${current_counselor_id}`;
});

// 모든 "상세보기" 링크를 선택합니다.
const detailButtons = document.querySelectorAll(".details-btn");

// 각 링크에 대해 href 속성을 설정합니다.
detailButtons.forEach((button, index) => {
  // 상담사 ID를 인덱스에 따라 설정합니다.
  const counselorId = index + 1;
  // href 속성을 설정합니다.
  button.href = `/counselor_detailed/${counselorId}`;
});

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
console.log("정정현");

let counselor_id = current_counselor_id;

let name_h1 = document.getElementsByTagName("h1")[0]; // 이름 바꾸기
let rn = document.getElementsByClassName("review-number")[0]; // 후기 수 바꾸기
let sr = document.getElementsByClassName("star-rating")[0]; // 별점 바꾸기
let starsFirst = document.getElementsByClassName("stars")[0]; // 별 그림 갯수 바꾸기
let starsSecond = document.getElementsByClassName("stars")[1];
let it = document.getElementsByTagName("p")[1]; // 소개 및 철학 바꾸기
let hashtags = document.getElementsByClassName("hashtags")[0]; // 해쉬태그 바꾸기
let meths = document.getElementsByClassName("method"); // 상담 방법 바꾸기
let summari = document.getElementsByClassName("detailed-review")[0]; //gemini 요약
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// let rvid = document.getElementsByClassName("reviewer-id"); //후기 쓴 사람 아이디 바꾸기
// let fdbtxt = document.getElementsByClassName("feedback-text"); // 후기 내용 바꾸기
// let starsthird = document.getElementsByClassName("stars")[2]
let bottom = document.getElementsByClassName("bottome");

let price = document.getElementsByClassName("session")[0];
let li = document.getElementsByClassName("li")[0];
let picpath = document.getElementsByClassName("counselorpicture")[0];
let rn_2 = document.getElementsByClassName("feedback-review")[0];

let p = document.getElementsByClassName("p")
let f = document.getElementsByClassName("f")
let r = document.getElementsByClassName("r")
let k = document.getElementsByClassName("k")


fetch(`/api/counselors/${current_counselor_id}`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:정현", data);

    // let counselor_id = data.id;

    let 상담사이름 = data.counselor_name;
    let 리뷰개수 = data.num_of_reviews;
    let 별개수 = data.star_ratio;
    let 상담사소개 = data.introduction;

    name_h1.innerHTML = data.counselor_name; // 상담사 이름
    name_title = document.createElement("span");
    name_title.className = "title";
    name_title.innerHTML = "심리 상담사";
    name_h1.appendChild(name_title);
    rn.innerHTML = data.num_of_reviews;
    it.innerHTML = data.introduction;
    rn_2_text = document.createElement("h2");
    rn_2_text.innerHTML = "상담 후기 " + "(" + 리뷰개수 + "건)";
    rn_2.appendChild(rn_2_text);

    let picpth = document.createElement("img");
    picpth.src = data.profile_img_path + ".png";
    picpath.appendChild(picpth); // 상담사 사진

    for (let j = 0; j < Math.floor(data.star_ratio); j++) {
      let star_img1 = document.createElement("img"); // img 태그를 생성할게요~~~ 변수명은 star_img
      star_img1.src = "/static/images/counselor/star.svg"; // img 태그에 'src' 속성 추가
      let star_img2 = document.createElement("img"); // img 태그를 생성할게요~~~ 변수명은 star_img
      star_img2.src = "/static/images/counselor/star.svg"; // img 태그에 'src' 속성 추가

      starsFirst.appendChild(star_img1); // 별점 그림을 넣을 '횟수'를 정하는 메소드
      starsSecond.appendChild(star_img2); // 생성된 태그를 도큐먼트에 연결
    }

    let star_span = document.createElement("span");
    star_span.className = "star-rating"; // 생성된 span 태그의 classname 부여(css와 동일한 이름)
    star_span.id = "first";
    star_span.innerHTML = 별개수; //생성된 태그의 >< //소수 점 둘째 자리까지만
    starsFirst.appendChild(star_span); // 생성된 태그를 도큐먼트에 연결

    let starreview = "리뷰 " + 리뷰개수 + "건";
    let span2 = document.createElement("span");
    span2.innerHTML = starreview;
    sr.appendChild(span2);

    // 상담사 해쉬태그
    let split_hashtags = data.hash_tags.split(" "); // 해시태그 문자열을 공백을 기준으로 나눔
    for (let k = 0; k < split_hashtags.length; k++) {
      // 나눠진 조각 수만큼 반복
      let phstg = document.createElement("span"); // span 태그 생성
      let hashtag_text = document.createTextNode(
        split_hashtags[k].trim() + " "
      ); // 각 해시태그에 대한 텍스트 노드 생성
      phstg.appendChild(hashtag_text); // 텍스트 노드를 span 요소에 추가
      hashtags.appendChild(phstg); // 생성된 span 요소를 부모 요소에 추가
    }

    //가격
    // P 태그 생성 후 변수 할당 > 그 안에 "30분 세션: " + counsel_price 집어넣기
    // documentget에 연결된 해당 변수에 innerhttp
    let priceP = document.createElement("p");
    priceP.innerHTML = "30분 세션: " + data.counsel_price + "원";
    price.innerHTML = ""; // 기존의 내용을 지우고
    price.appendChild(priceP); // 새로운 내용을 추가합니다.

    // 상담사 상담 방법
    let split_methods = data.counsel_info.split("\n⦁"); // 문자열을 공백을 기준으로 나눔
    split_methods.shift();
    for (let k = 0; k < 3; k++) {
      // 나눠진 조각 수만큼 반복
      let methss = document.createElement("p"); // p 태그 생성
      let meths_text = document.createTextNode(split_methods[k].trim() + " "); // 각 상담 방법에 대한 텍스트 노드 생성
      methss.appendChild(meths_text); // 텍스트 노드를 span 요소에 추가
      meths[k].appendChild(methss); // 생성된 span 요소를 부모 요소에 추가
    }
    // 상담사 경력
    li.innerHTML = "";
    let split_history = data.counselor_history.split("\n✔");
    split_history.shift(); // 첫 번째 요소 제거
    for (let h = 0; h < split_history.length; h++) {
      // 나눠진 조각 수만큼 반복
      let history_li = document.createElement("li"); // li 태그 생성
      let history_li_text = document.createTextNode(
        "✔ " + split_history[h].trim()
      ); // 각 항목에 대한 텍스트 노드 생성
      history_li.appendChild(history_li_text); // 텍스트 노드를 li 요소에 추가
      li.appendChild(history_li); // li 요소를 liDiv에 추가
    }
  })

  // li.innerHTML= data.counselor_history

  // })
  .catch((error) => {
    console.error("Error:", error);
  });

const formData = new FormData();
formData.append("counselor_id", counselor_id);

fetch(`/api/summarize_reviews/${counselor_id}`, {
  // 리뷰 요약하는 Fetch
  method: "post",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
    summari.innerHTML = data.summary;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch(`/api/reviews/${counselor_id}`, {
  method: "GET",
}) // 특정 상담사의 리뷰 가져오기.
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ후기 작성

    data.forEach((review, index) => {
      let bottomSection = document.createElement("div");
      bottomSection.className = "bottom-section";

      let ratingId = document.createElement("div");
      ratingId.className = "rating-id";

      let bottomStarRating = document.createElement("div");
      bottomStarRating.className = "bottom-star-rating";
      bottomStarRating.id = "four";

      for (let i = 0; i < review.total_ratio; i++) {
        let starsFeedback = document.createElement("div");
        starsFeedback.className = "stars";
        starsFeedback.id = "feedback";
        let star = document.createElement("img");
        star.src = "/static/images/counselor/star.svg";
        star.alt = "star";
        starsFeedback.appendChild(star);
        bottomStarRating.appendChild(starsFeedback);
      }

      let reviewerId = document.createElement("div");
      reviewerId.className = "reviewer-id";
      reviewerId.textContent = review.id;

      let feedbackText = document.createElement("div");
      feedbackText.className = "feedback-text";

      feedbackText.innerText = review.review_text;

      ratingId.appendChild(bottomStarRating);
      ratingId.appendChild(reviewerId);

      bottomSection.appendChild(ratingId);
      bottomSection.appendChild(feedbackText);

      let feedbackContainer = document.querySelector(".feedback-four");
      if (feedbackContainer) {
        feedbackContainer.appendChild(bottomSection);
      } else {
        console.error(".feedback-four element not found.");
      }
    });

    // 각 바의 퍼센트 값을 설정 (예시 데이터)
    let tlp = data.length / 100;
    let p3 = 0,
      p2 = 0,
      p1 = 0,
      k3 = 0,
      k2 = 0,
      k1 = 0,
      f3 = 0,
      f2 = 0,
      f1 = 0,
      r3 = 0,
      r2 = 0,
      r1 = 0;

    for (let i = 0; i < data.length; i++) {
      const review = data[i];
      if (review.professionalism == 3) {
        p3 += 1;
      } else if (review.professionalism == 2) {
        p2 += 1;
      } else {
        // 1
        p1 += 1;
      }

      if (review.personalized_feedback == 3) {
        f3 += 1;
      } else if (review.personalized_feedback == 2) {
        f2 += 1;
      } else {
        // 1
        f1 += 1;
      }

      if (review.willingness_to_recounsel == 3) {
        r3 += 1;
      } else if (review.willingness_to_recounsel == 2) {
        r2 += 1;
      } else {
        // 1
        r1 += 1;
      }

      if (review.kindness == 3) {
        k3 += 1;
      } else if (review.kindness == 2) {
        k2 += 1;
      } else {
        // 1
        k1 += 1;
      }
    }

    console.log(
      `${p3}, ${p2}, ${p1}, ${f3}, ${f2}, ${f1}, ${r3}, ${r2}, ${r1}, ${k3}, ${k2}, ${k1}`
    );

    const percentages = [
      p3 / tlp,
      p2 / tlp,
      p1 / tlp,
      k3 / tlp,
      k2 / tlp,
      k1 / tlp,
      f3 / tlp,
      f2 / tlp,
      f1 / tlp,
      r3 / tlp,
      r2 / tlp,
      r1 / tlp,
    ];

    const bars = document.querySelectorAll(".bar");


    // 텍스트 수정
    p[0].innerHTML = "높아요 (" + p1 + ") " + Math.round(p3 / tlp), + "%"
    p[1].innerHTML = "보통이에요 (" + p2 + ") " + Math.round(p2 / tlp), + "%"
    p[2].innerHTML = "부족해요 (" + p3 + ") " + Math.round(p1 / tlp), + "%"
    k[0].innerHTML = "친절해요 (" + k1 + ") " + Math.round(k3 / tlp), + "%"
    k[1].innerHTML = "보통이에요 (" + k2 + ") " + Math.round(k2 / tlp), + "%"
    k[2].innerHTML = "아쉬워요 (" + k3 + ") " + Math.round(k1 / tlp), + "%"
    f[0].innerHTML = "도움이 되었어요 (" + f1 + ") " + Math.round(f3 / tlp), + "%"
    f[1].innerHTML = "보통이에요 (" + f2 + ") " + Math.round(f2 / tlp), + "%"
    f[2].innerHTML = "별로에요 (" + f3 + ") " + Math.round(f1 / tlp), + "%"
    r[0].innerHTML = "재상담 원해요 (" + r1 + ") " + Math.round(r3 / tlp), + "%"
    r[1].innerHTML = "보통이에요 (" + r2 + ") " + Math.round(r2 / tlp), + "%"
    r[2].innerHTML = "그저 그래요 (" + r3 + ") " + Math.round(r1 / tlp), + "%"

    // 각 바의 너비를 퍼센트 값으로 설정
    bars.forEach((bar, index) => {
      const percentage = percentages[index];
      bar.style.width = `${percentage}%`;
    });
    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 바 퍼센트 표시하는 코드
  })
  .catch((error) => {
    console.error("Error:", error);
  });
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
