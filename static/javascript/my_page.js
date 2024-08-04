// 요소들
const reviewModal = document.getElementById("reviewModal");
const closeModalBtn = reviewModal.querySelector(".close");
const reviewForm = document.getElementById("reviewForm");
const deleteAccountBtn = document.querySelector(".delete-account");
const editInfoBtn = document.querySelector(".edit-info");
const modifyReservationBtn = document.querySelector(".modify-reservation");
const historyList = document.querySelector(".history-list");
const reservationManagement = document.querySelector(
  ".reservation-management p"
);
const counselorNameInput = document.getElementById("counselorName");

// 이벤트 리스너
closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);
reviewForm.addEventListener("submit", submitReview);
deleteAccountBtn.addEventListener("click", deleteAccount); // 필요에 따라 주석 해제
editInfoBtn.addEventListener("click", editInfo); // 필요에 따라 주석 해제
modifyReservationBtn.addEventListener("click", modifyReservation); // 필요에 따라 주석 해제

// 함수들
function closeModal() {
  reviewModal.style.display = "none";
}

function outsideClick(e) {
  if (e.target == reviewModal) {
    reviewModal.style.display = "none";
  }
}

function openReviewModal(c_id) {
  reviewModal.style.display = "block";
  counselorNameInput.value = c_id; // 상담사 정보를 hidden input에 저장
}

function submitReview(e) {
  e.preventDefault();
  const reviewText = document.getElementById("reviewText").value;
  const counselor_id = counselorNameInput.value;
  const aa = document.getElementById("aa").value;
  const bb = document.getElementById("bb").value;
  const cc = document.getElementById("cc").value;
  const dd = document.getElementById("dd").value;
  const ee = document.getElementById("ee").value;

  if (reviewText.trim() && aa && bb && cc && dd && ee) {
    // 여기에서 후기를 제출하는 로직을 처리합니다

    // 서버에 후기 전송
    fetch(`/api/reviews/${counselor_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        review_text: reviewText,
        professionalism: aa,
        kindness: bb,
        personalized_feedback: cc,
        willingness_to_recounsel: dd,
        total_ratio: ee,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // 폼을 초기화하고 모달을 닫습니다
        alert("리뷰가 성공적으로 제출되었습니다.");
        reviewForm.reset();
        closeModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("모든 필드를 작성해주세요.");
  }
}

function deleteAccount() {
  if (confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
    fetch("/api/user_delete", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.detail);
        window.location.href = "/";
      })
      .catch((error) => console.error("Error:", error));
  }
}

function editInfo() {
  alert("현재 개발 중입니다!!");
}

function modifyReservation() {
  alert("현재 개발 중입니다!!");
}

function loadUserProfile() {
  // console.log("Loading user profile...");
  fetch("/api/user")
    .then((response) => response.json())
    .then((user) => {
      // console.log("User profile data:", user);
      if (user) {
        document.querySelector(
          ".greeting p"
        ).textContent = `${user.username}님 반갑습니다.`;
        document.querySelector(".profile-info-left").innerHTML = `
                <p>나이 : ${user.age}</p>
                <p>직업 : ${user.job}</p>
                <p>나의 목표 : ${user.goal}</p>
            `;
        document.querySelector(
          ".membership-date"
        ).textContent = `가입날짜 : ${new Date(
          user.signup_date
        ).toLocaleDateString()}`;
      }
    })
    .catch((error) => console.error("Error:", error));
}

function loadReservationManagement() {
  // console.log("Loading reservation management...");
  fetch("/api/payment")
    .then((response) => response.json())
    .then((payments) => {
      console.log(payments);
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];

        let ischeck = "";
        let reviewButton = "";
        if (payment.is_used) {
          ischeck = "paid";
          // "paid" 상태인 경우에만 후기 작성 버튼 추가
          reviewButton = `<button class="review-btn" c_id="${payment.counselor_id}" data-counselor="${payment.counselor_name}">후기 작성</button>`;
        }

        let new_html = `<div class="history-item ${ischeck}">
          <div class="history-header">
            <p class="consultant-name">${payment.counselor_name}</p>
            <p class="consultant-role">&nbsp;상담사</p>
          </div>
          <p><span class="amount">${payment.paid_price.toLocaleString()}원</span></p>
          <p>결제일 : ${payment.when_paid}</p>
          <p>상담일 : ${payment.counsel_date}</p>

          ${reviewButton}
      </div>`;
        historyList.innerHTML = historyList.innerHTML + new_html;
      }

      // 후기 작성 버튼에 이벤트 리스너 추가
      const reviewBtns = document.querySelectorAll(".review-btn");
      reviewBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          openReviewModal(btn.getAttribute("c_id"));
        });
      });
    })
    .catch((error) => console.error("Error:", error));
}

function loadPaymentHistory() {
  // console.log("Loading payment history...");
  fetch("/api/payment")
    .then((response) => response.json())
    .then((payments) => {
      console.log(payments);
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        if (payment.is_used === false) {
          document.querySelector(
            ".reservation-management p"
          ).innerHTML = `${payment.username}님은 ${payment.counsel_date}에 ${payment.counselor_name}와 상담예약이 되어있습니다!`;
        }
      }
    })
    .catch((error) => console.error("Error:", error));
}

loadUserProfile();
loadPaymentHistory();
loadReservationManagement();
