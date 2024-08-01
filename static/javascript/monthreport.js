// 최근 연도 네비게이션
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
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
document.getElementById("currentMonth").textContent = `${year}년 ${
  monthNames[month - 1]
}`;

// Chart.js 차트 업데이트 함수
function updateChart(labels, data) {
  const ctx = document.getElementById("myBarChart").getContext("2d");
  const myBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "비율",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
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
}

// 단어 및 비율 페치
fetch(`/api/report/month`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    // 모든 tableword 요소 가져오기
    const tablewords = document.getElementsByClassName("tableword");
    // 모든 tablepercent 요소 가져오기
    const tablepercents = document.getElementsByClassName("tablepercent");
    // 모든 pnimg 요소 가져오기
    const pnimgs = document.getElementsByClassName("pnimg");

    // 데이터를 순회하며 각 요소에 값 설정
    const dataForMonth = data["6"]; // 예시로 6월 데이터를 사용
    const words = [];
    const percentages = [];
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
        } else if (dataForMonth[i][1][1] === "N") {
          pnimgs[i].src = "/static/images/imgfolder/negative.svg";
          pnimgs[i].alt = "negative";
        }
      }
      words.push(dataForMonth[i][0]);
      percentages.push(dataForMonth[i][1][0]);
    }

    // Chart.js 업데이트
    updateChart(words, percentages);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
