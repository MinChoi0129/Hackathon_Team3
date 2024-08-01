console.log("정정현");

let counselor_id = 1;

let name_h1 = document.getElementsByTagName("h1")[0];
let rn = document.getElementsByClassName("review-number")[0];
let sr = document.getElementsByClassName("star-rating")[0];
let it = document.getElementsByTagName("p")[1]
let hashtags = document.getElementsByClassName("hashtags")[0]
let meths = document.getElementsByClassName("method")
let summari = document.getElementsByClassName("detailed-review")[0]
let rvid = document.getElementsByClassName("reviewer-id")
let fdbtxt = document.getElementsByClassName("feedback-text")

// const formData = new FormData();
// formData.append("name", name);
// formData.append("email", email);

fetch(`/api/counselors/${counselor_id}`, {
  method: "GET",
  //   body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    let 상담사이름 = data.counselor_name;
    let 리뷰개수 = data.num_of_reviews;
    let 별개수 = data.star_ratio;
    let 상담사소개 = data.introduction;
    // 상담사 해쉬태그
    let split_hashtags = data.hash_tags.split(" "); // 해시태그 문자열을 공백을 기준으로 나눔
    for (let k = 0; k < split_hashtags.length; k++) { // 나눠진 조각 수만큼 반복
    let phstg = document.createElement("span"); // span 태그 생성
    let hashtag_text = document.createTextNode(split_hashtags[k].trim() + " "); // 각 해시태그에 대한 텍스트 노드 생성
    phstg.appendChild(hashtag_text); // 텍스트 노드를 span 요소에 추가
    hashtags.appendChild(phstg); // 생성된 span 요소를 부모 요소에 추가
    }
    // 상담사 해쉬태그
    let split_methods = data.counsel_info.split("\n⦁"); // 해시태그 문자열을 공백을 기준으로 나눔
    split_methods.shift()
    for (let k = 0; k < split_methods.length; k++) { // 나눠진 조각 수만큼 반복
    let methss = document.createElement("p"); // span 태그 생성
    let meths_text = document.createTextNode(split_methods[k].trim() + " "); // 각 해시태그에 대한 텍스트 노드 생성
    methss.appendChild(meths_text); // 텍스트 노드를 span 요소에 추가
    meths[k].appendChild(methss); // 생성된 span 요소를 부모 요소에 추가
    }
    

    name_h1.innerHTML = 상담사이름;
    rn.innerHTML = 리뷰개수;
    sr.innerHTML = 별개수;
    it.innerHTML = 상담사소개;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const formData = new FormData();
formData.append("counselor_id", counselor_id);

fetch(`/api/summarize_reviews/${counselor_id}`, {  // 리뷰 요약하는 Fetch
    method: "post",
      body: formData,
  })

  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
    summari.innerHTML = data.summary
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
    let reviewerid = reviewdata.id
    rvid[idi].innerHTML = reviewerid

    let feedbacktxt = reviewdata.review_text
    fdbp = document.createElement('p')
    fdbp.innerHTML = feedbacktxt
    fdbtxt[idi].appendChild(fdbp)
    }

  })
.catch((error) => {
    console.error("Error:", error);
  });
