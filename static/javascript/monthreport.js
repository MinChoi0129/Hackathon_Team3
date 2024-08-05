// ********************************* 변수 선언부 ********************************* //
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const currentparam = window.location.search;
const monthNames = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

let cm = -1;

// ********************************* 변수 적용부 ********************************* //

document.getElementById("currentMonth").textContent = `${year}년 ${
  monthNames[parseInt(currentMonth) - 1]
}`;

if (!currentparam) {
  cm = parseInt(currentMonth);
} else {
  cm = parseInt(currentparam.substring(14, currentparam.length));
}

document.getElementById("getBeforeMonthBtn").addEventListener("click", () => {
  window.location.href = `/monthreport?currentMonth=${cm - 1}`;
});

document.getElementById("getAfterMonthBtn").addEventListener("click", () => {
  window.location.href = `/monthreport?currentMonth=${cm + 1}`;
});

// ********************************* 함수 선언부 ********************************* //

// Chart.js 차트 업데이트 함수
function updateChart(labels, data, colors) {
  const ctx = document.getElementById("myBarChart").getContext("2d");
  const myBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "비율",
          data: data,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // 차트에 포커스 방지 및 백스페이스 키 입력 방지
  document
    .getElementById("myBarChart")
    .addEventListener("keydown", function (e) {
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    });
}

// ********************************* 함수 실행부 ********************************* //

// 단어 및 비율 페치
fetch(`/api/report/month/${cm}`)
  .then((response) => response.json())
  .then((data) => {
    const tablewords = document.getElementsByClassName("tableword");
    const tablepercents = document.getElementsByClassName("tablepercent");
    const pnimgs = document.getElementsByClassName("pnimg");

    const dataForMonth = data[currentMonth];
    const words = [];
    const percentages = [];
    const colors = {
      backgroundColor: [],
      borderColor: [],
    };

    for (let i = 0; i < dataForMonth.length; i++) {
      if (i < tablewords.length) {
        tablewords[i].innerHTML = dataForMonth[i][0]; // 단어 설정
      }
      if (i < tablepercents.length) {
        tablepercents[i].innerHTML = `${dataForMonth[i][1][0]}`; // 비율 설정
      }
      if (i < pnimgs.length) {
        if (dataForMonth[i][1][1] === "P") {
          pnimgs[i].src = "/static/images/imgfolder/positive.svg";
          pnimgs[i].alt = "positive";
          colors.backgroundColor.push("rgba(54, 162, 235, 0.2)");
          colors.borderColor.push("rgba(54, 162, 235, 1)");
        } else if (dataForMonth[i][1][1] === "N") {
          pnimgs[i].src = "/static/images/imgfolder/negative.svg";
          pnimgs[i].alt = "negative";
          colors.backgroundColor.push("rgba(255, 99, 132, 0.2)");
          colors.borderColor.push("rgba(255, 99, 132, 1)");
        }
      }
      words.push(dataForMonth[i][0]);
      percentages.push(dataForMonth[i][1][0]);
    }

    // Chart.js 업데이트
    updateChart(words, percentages, colors);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
