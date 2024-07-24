// ========================= 함수 선언부 ========================= //

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

// ========================= 변수 선언부 ========================= //

const couponField = document.querySelector(
  ".counselor_detail_sub_item > input"
);

const couponApplyButton = document.getElementById("apply_discount");

// ========================= 기능 적용부 ========================= //
couponField.addEventListener("input", applyCouponPrettier);
couponApplyButton.addEventListener("click", applyCouponCode);
