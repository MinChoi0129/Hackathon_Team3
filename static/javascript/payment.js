// ========================= 함수 선언부 ========================= //
function applyCouponInHTML() {
  let tmp = detail_numbers[0].innerHTML;

  let original_price = Number(tmp.slice(0, tmp.length - 1).replace(/,/g, "")); // 120000

  tmp = detail_numbers[1].innerHTML; // 5%
  let basic_discount = parseInt(tmp.slice(0, tmp.length - 1)); // 5
  more_discounts[0].innerHTML = `-${(
    original_price *
    (basic_discount / 100)
  ).toLocaleString()}원`;

  tmp = detail_numbers[2].innerHTML; // 15%
  let coupon_discount = parseInt(tmp.slice(0, tmp.length - 1)); // 15

  let final_price =
    original_price * (1 - basic_discount / 100) * (1 - coupon_discount / 100);

  more_discounts[1].innerHTML = `-${(
    original_price -
    final_price -
    original_price * (basic_discount / 100)
  ).toLocaleString()}원`;

  document.getElementById(
    "final_price"
  ).innerHTML = `${final_price.toLocaleString()}원`;
}

function applyCouponCode() {
  const couponCode = couponField.value;
  fetch("/api/check_coupon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ coupon_code: couponCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.valid) {
        alert("쿠폰이 적용되었습니다!");
        detail_numbers[2].innerHTML = "20%";
        applyCouponInHTML();
      } else {
        alert("쿠폰 코드가 올바르지 않습니다.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error validating coupon code.");
    });
}

function applyCouponPrettier(event) {
  let value = event.target.value.replace(/-/g, ""); // '-' 제거
  value = value.replace(/\D/g, ""); // 숫자만 남김

  let formattedValue = "";
  for (let i = 0; i < value.length; i += 5) {
    if (i > 0) formattedValue += "-";
    formattedValue += value.substring(i, i + 5);
  }
  event.target.value = formattedValue.substring(0, 23); // 최대 길이 23
}

function start_payment() {
  let tmp = document.getElementById("final_price").innerHTML;
  let final_price = Number(tmp.slice(0, tmp.length - 1).replace(/,/g, ""));
  let item_counselor_id = parseInt(counselor_item);

  const radioGroup = document.querySelector(".radio-group");
  const radios = radioGroup.querySelectorAll('input[type="radio"]');

  let flag = false;
  let pay_type = -1;
  for (let i = 0; i < radios.length; i++) {
    const radio = radios[i];
    if (radio.checked) {
      flag = true;
      pay_type = i;
      break;
    }
  }

  if (!flag) {
    alert("결제 방식을 선택해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("paid_price", final_price);
  formData.append("pay_type", pay_type);

  fetch(`/api/payment/${item_counselor_id}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      location.href = `/payment_over?payment_id=${data.id}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function applyCounselorInfoInHTML(counselor_id) {
  fetch(`/api/counselors/${counselor_id}`)
    .then((response) => response.json())
    .then((data) => {
      let first_price = data.counsel_price;
      let second_price = parseInt(first_price * 0.05);
      detail_numbers[0].innerHTML = first_price.toLocaleString() + "원";
      more_discounts[0].innerHTML = second_price.toLocaleString() + "원";
      final_price.innerHTML =
        (first_price - second_price).toLocaleString() + "원";
      counselor_info_name.innerHTML = data.counselor_name;
      counselor_info_date.innerHTML = data.counsel_date;
      counselor_info_type.innerHTML = data.counsel_type;
      counselor_info_address.innerHTML = data.address;
      counselor_img_tag.src = data.profile_img_path + ".png";
    })
    .catch((error) => {
      console.error(error);
    });
}

// ========================= 변수 선언부 ========================= //

// 할인부
const couponField = document.querySelector(
  ".counselor_detail_sub_item > input"
);
const couponApplyButton = document.getElementById("apply_discount");

let detail_numbers = document.getElementsByClassName("price_sub_detail_number");
let more_discounts = document.getElementsByClassName("more_discount");

// 상담사 정보부
let counselor_info_name = document.getElementsByTagName("p")[1];
let counselor_info_date = document.getElementsByTagName("p")[3];
let counselor_info_type = document.getElementsByTagName("p")[5];
let counselor_info_address = document.getElementsByTagName("p")[7];
let counselor_img_tag = document.getElementById("counselor_img");

// ========================= 기능 적용부 ========================= //
couponField.addEventListener("input", applyCouponPrettier);
couponApplyButton.addEventListener("click", applyCouponCode);
applyCounselorInfoInHTML(counselor_item);
applyCouponInHTML();
alert("For 심사위원: 쿠폰 코드는 12345-12345-12345-12345 입니다.");
