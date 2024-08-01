// Function to update the chart
function updateChart() {
  var tableRows = document.querySelectorAll(".data table tr");
  var newLabels = [];
  var newData = [];
  tableRows.forEach((row, index) => {
    if (index > 0) {
      // skip header row
      var cells = row.querySelectorAll("td");
      newLabels.push(cells[1].textContent.trim());
      newData.push(parseInt(cells[2].textContent.replace("%", "").trim()));
    }
  });
  myBarChart.data.labels = newLabels;
  myBarChart.data.datasets[0].data = newData;
  myBarChart.update();
}

// 표 만들기
var ctx = document.getElementById("myBarChart").getContext("2d");
var chartData = {
  labels: ["개진상", "홈런", "팀장놈", "단디💙", "싫다싫어"],
  datasets: [
    {
      label: "단어 비율",
      data: [40, 40, 20, 15, 5],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// 차트 만들기
var myBarChart = new Chart(ctx, {
  type: "bar",
  data: chartData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Set up MutationObserver to watch for changes in the table cells
var tableCells = document.querySelectorAll(
  ".data table td[contenteditable='true']"
);
var observer = new MutationObserver(updateChart);

tableCells.forEach((cell) => {
  observer.observe(cell, {
    childList: true,
    subtree: true,
    characterData: true,
  });
});

// Set current month
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

let tablew = document.getElementsByClassName("tableword");

fetch(`/api/counselors`, {
  method: "GET",
  //   body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    let 단어 = data.counselor_name;
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
    }

    tableword.innerHTML = 단어;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

let tablep = document.getElementsByClassName("tablepercent");

fetch(`/api/counselors`, {
  method: "GET",
  //   body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    let 비율 = data.counselor_name;

    tablepercent.innerHTML = 비율;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
