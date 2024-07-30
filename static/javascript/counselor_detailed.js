console.log("정정현");

let counselor_id = 1;

let name_h1 = document.getElementsByTagName("h1")[0];
let rn = document.getElementsByClassName("review-number")[0];
let sr = document.getElementsByClassName("star-rating")[0];
let it = document.getElementsByTagName("p")[1]

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


    name_h1.innerHTML = 상담사이름;
    rn.innerHTML = 리뷰개수;
    sr.innerHTML = 별개수;
    it.innerHTML = 상담사소개;
  })
  .catch((error) => {
    console.error("Error:", error);
  });