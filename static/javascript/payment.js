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
  radios.forEach((radio) => {
    if (radio.checked) {
      flag = true;
    }
  });

  if (!flag) {
    alert("결제 방식을 선택해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("paid_price", final_price);

  fetch(`/api/payment/${item_counselor_id}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  location.href = `/payment_over?counselor_item=${item_counselor_id}`;
}

// ========================= 변수 선언부 ========================= //

const couponField = document.querySelector(
  ".counselor_detail_sub_item > input"
);

const couponApplyButton = document.getElementById("apply_discount");

let detail_numbers = document.getElementsByClassName("price_sub_detail_number");
let more_discounts = document.getElementsByClassName("more_discount");

// ========================= 기능 적용부 ========================= //
couponField.addEventListener("input", applyCouponPrettier);
couponApplyButton.addEventListener("click", applyCouponCode);
applyCouponInHTML();
