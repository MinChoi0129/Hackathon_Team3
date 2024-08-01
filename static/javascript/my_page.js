console.log("페이지 로드됨");

let user_greeting = document.querySelector('.greeting p');
let profile_pic = document.querySelector('.profile-pic');
let profile_info_left = document.querySelector('.profile-info-left');
let membership_date = document.querySelector('.membership-date');

let reservation_info = document.querySelector('.reservation-management p');
let history_list = document.querySelector('.history-list');

let edit_info_btn = document.querySelector('.edit-info');
let modify_reservation_btn = document.querySelector('.modify-reservation');
let delete_account_btn = document.querySelector('.delete-account');

let review_modal = document.getElementById('reviewModal');
let close_modal_btn = document.querySelector('.close');
let review_form = document.getElementById('reviewForm');
let review_text = document.getElementById('reviewText');
let current_review_item = null;

document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  loadReservationData();
  loadConsultationHistory();
  setupEventListeners();
});

function loadUserData() {
  fetch('/api/user', {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
      console.log("User Data Success:", data);

      let 사용자이름 = data.username;
      let 프로필사진 = data.profilePic;
      let 나이 = data.age;
      let 직업 = data.job;
      let 목표 = data.goal;
      let 가입날짜 = data.membershipDate;

      user_greeting.innerHTML = `${사용자이름}님 반갑습니다.`;
      profile_pic.src = 프로필사진;
      profile_info_left.innerHTML = `
        <p>나이 : ${나이}</p>
        <p>직업 : ${직업}</p>
        <p>나의 목표 : ${목표}</p>
      `;
      membership_date.innerHTML = `가입날짜 : ${가입날짜}`;
    })
    .catch(error => {
      console.error("User Data Error:", error);
    });
}

function loadReservationData() {
  fetch('/api/reservation', {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
      console.log("Reservation Data Success:", data);

      let 사용자이름 = data.username;
      let 예약날짜 = data.reservationDate;
      let 상담사이름 = data.counselorName;

      reservation_info.innerHTML = `${사용자이름}님은 ${예약날짜}에 ${상담사이름} 상담사와 상담예약이 되어있습니다!`;
    })
    .catch(error => {
      console.error("Reservation Data Error:", error);
    });
}

function loadConsultationHistory() {
  fetch('/api/consultation-history', {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
      console.log("Consultation History Success:", data);

      history_list.innerHTML = ''; // Clear existing items
      data.history.forEach(item => {
        let 상담사이름 = item.counselorName;
        let 상담사직함 = item.counselorRole;
        let 회차 = item.sessionNumber;
        let 프로그램 = item.program;
        let 금액 = item.amount;
        let 상태 = item.status;
        let 날짜 = item.date;

        let history_item = document.createElement('div');
        history_item.classList.add('history-item');
        if (item.paid) {
          history_item.classList.add('paid');
        }
        history_item.innerHTML = `
          <div class="history-header">
            <p class="consultant-name">${상담사이름}</p>
            <p class="consultant-role">${상담사직함}</p>
          </div>
          <p>${회차}회차</p>
          <p>◎ ${프로그램}</p>
          <p>
            <span class="amount">${금액}원</span>
            <span class="status">${상태}</span>
          </p>
          <p>${날짜}</p>
          <button class="review-btn">후기 작성</button>
        `;
        history_list.appendChild(history_item);

        // Add event listener for review button
        history_item.querySelector('.review-btn').addEventListener('click', () => {
          current_review_item = item;
          openReviewModal();
        });
      });
    })
    .catch(error => {
      console.error("Consultation History Error:", error);
    });
}

function openReviewModal() {
  review_modal.style.display = "block";
}

function closeReviewModal() {
  review_modal.style.display = "none";
  review_text.value = ''; // Clear the textarea
  current_review_item = null;
}

function setupEventListeners() {
  edit_info_btn.addEventListener('click', () => {
    window.location.href = '/edit-profile';
  });

  modify_reservation_btn.addEventListener('click', () => {
    window.location.href = '/modify-reservation';
  });

  delete_account_btn.addEventListener('click', () => {
    if (confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      fetch('/api/delete-account', {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          alert('회원탈퇴가 완료되었습니다.');
          window.location.href = '/';
        } else {
          alert('회원탈퇴 중 오류가 발생했습니다.');
        }
      })
      .catch(error => console.error('Error deleting account:', error));
    }
  });

  close_modal_btn.addEventListener('click', closeReviewModal);

  window.addEventListener('click', (event) => {
    if (event.target == review_modal) {
      closeReviewModal();
    }
  });

  review_form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitReview();
  });
}

function submitReview() {
  if (!current_review_item) return;

  let reviewData = {
    reviewText: review_text.value,
    sessionId: current_review_item.sessionId,
  };

  fetch('/api/submit-review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Review Submission Success:', data);
    closeReviewModal();
    alert('후기가 성공적으로 제출되었습니다.');
  })
  .catch(error => {
    console.error('Review Submission Error:', error);
  });
}
