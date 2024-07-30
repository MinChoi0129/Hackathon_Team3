// Position coordinates for displaying the words
let leaf = [
  [380, 400],
  [300, 420],
  [280, 460],
  [200, 480],
  [750, 250],
  [750, 200],
  [740, 230],
  [760, 200],
];

// Coordinates for displaying the months
let signwhere = [
  [503, 45],
  [740, 225],
  [391, 410],
];

let monthdata = {
  1: ["1월"],
  2: ["2월"],
  3: ["3월"],
  4: ["4월"],
  5: ["5월"],
  6: ["6월"],
  7: ["7월"],
  8: ["8월"],
  9: ["9월"],
  10: ["10월"],
  11: ["11월"],
  12: ["12월"],
};

// Calculate the recent three months
let today = new Date();
let currentMonth = today.getMonth() + 1; // getMonth() is 0-based, so add 1
let recentMonths = [];

// Calculate recent 3 months
for (let i = 0; i < 3; i++) {
  let month = currentMonth - i;
  if (month <= 0) {
    month += 12;
  }
  recentMonths.push(month);
}

fetch(`/api/monthreport_by_user`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    let picture = document.getElementsByClassName("pictures")[0];
    let index = 0;

    // Process positive words
    if (data[7] && data[7].Positive) {
      let positiveWords = data[7].Positive;
      for (let word of positiveWords) {
        let div = document.createElement("div");
        div.innerText = word;
        div.style.color = "blue";

        if (index < leaf.length) {
          let x = leaf[index][0];
          let y = leaf[index][1];
          div.style.transform = `translate(${x}px, ${y}px)`;
          index++;
        }
        picture.appendChild(div);
      }
    }

    // Process negative words
    if (data[7] && data[7].Negative) {
      let negativeWords = data[7].Negative;
      for (let word of negativeWords) {
        let div = document.createElement("div");
        div.innerText = word;
        div.style.color = "red";

        if (index < leaf.length) {
          let x = leaf[index][0];
          let y = leaf[index][1];
          div.style.transform = `translate(${x}px, ${y}px)`;
          index++;
        }
        picture.appendChild(div);
      }
    }

    // Display recent 3 months
    let monthsigns = document.getElementsByClassName("months")[0];
    let signindex = 0;
    for (let month of recentMonths) {
      let sign = monthdata[month][0];
      let signdiv = document.createElement("div");
      signdiv.innerText = sign;

      if (signindex < signwhere.length) {
        let x = signwhere[signindex][0];
        let y = signwhere[signindex][1];
        signdiv.style.transform = `translate(${x}px, ${y}px)`;
        signindex++;
      }
      signdiv.style.color = "black";
      monthsigns.appendChild(signdiv);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
