console.log("정정현");

let counselor_id = 1;

let name_h1 = document.getElementsByTagName("h1")[0]; // 이름 바꾸기
let rn = document.getElementsByClassName("review-number")[0]; // 후기 수 바꾸기
let sr = document.getElementsByClassName("star-rating")[0]; // 별점 바꾸기
let starsFirst = document.getElementsByClassName("stars")[0]; // 별 그림 갯수 바꾸기
let starsSecond = document.getElementsByClassName("stars")[1];
let it = document.getElementsByTagName("p")[1]; // 소개 및 철학 바꾸기
let hashtags = document.getElementsByClassName("hashtags")[0]; // 해쉬태그 바꾸기
let meths = document.getElementsByClassName("method"); // 상담 방법 바꾸기
let summari = document.getElementsByClassName("detailed-review")[0]; //gemini 요약
let rvid = document.getElementsByClassName("reviewer-id"); //후기 쓴 사람 아이디 바꾸기
let fdbtxt = document.getElementsByClassName("feedback-text"); // 후기 내용 바꾸기
let price = document.getElementsByClassName("session")[0];
let li = document.getElementsByClassName("li")[0];

fetch(`/api/counselors/${counselor_id}`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:정현", data);

    let 상담사이름 = data.counselor_name;
    let 리뷰개수 = data.num_of_reviews;
    let 별개수 = data.star_ratio;
    let 상담사소개 = data.introduction;

    name_h1.innerHTML = data.counselor_name; // 상담사 이름
    rn.innerHTML = data.num_of_reviews;
    it.innerHTML = data.introduction;

    for (let j = 0; j < Math.floor(data.star_ratio); j++) {
      let star_img = document.createElement("img"); // img 태그를 생성할게요~~~ 변수명은 star_img
      star_img.src = "{{ url_for('static', path ='images/로고2svg.svg')}}"; // img 태그에 'src' 속성 추가
      starsFirst.appendChild(star_img); // 별점 그림을 넣을 '횟수'를 정하는 메소드
      starsSecond.appendChild(star_img); // 생성된 태그를 도큐먼트에 연결
    }

    let star_span = document.createElement("span");
    star_span.className = "star-rating"; // 생성된 span 태그의 classname 부여(css와 동일한 이름)
    star_span.id = "first";
    star_span.innerHTML = 별개수; //생성된 태그의 >< //소수 점 둘째 자리까지만
    starsFirst.appendChild(star_span); // 생성된 태그를 도큐먼트에 연결

    let starreview = 별개수 + " " + "(" + 리뷰개수 + ")";
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
    for (let k = 0; k < split_methods.length; k++) {
      // 나눠진 조각 수만큼 반복
      let methss = document.createElement("p"); // p 태그 생성
      let meths_text = document.createTextNode(split_methods[k].trim() + " "); // 각 해시태그에 대한 텍스트 노드 생성
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
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
    for (let idi = 0; idi < data.length; idi++) {
      const reviewdata = data[idi];
      let reviewerid = reviewdata.id;
      rvid[idi].innerHTML = reviewerid;

      let feedbacktxt = reviewdata.review_text;
      let fdbp = document.createElement("p");
      fdbp.innerHTML = feedbacktxt;
      fdbtxt[idi].appendChild(fdbp);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
