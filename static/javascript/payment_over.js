let black_infos = document.getElementsByClassName("black_info");

fetch(`/api/payment/`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    let counselor_id = null;
    let when_paid = null;
    let paid_price = null;
    let pay_type = null;

    for (let i = 0; i < data.length; i++) {
      const payment = data[i];
      if (payment.id == payment_id) {
        counselor_id = payment.counselor_id;
        when_paid = payment.when_paid;
        paid_price = payment.paid_price;
        pay_type = payment.pay_type;
        break;
      }
    }

    fetch(`/api/counselors/${counselor_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementsByClassName("gray_info")[0].innerHTML =
          when_paid.replace("-", "").replace("-", "") +
          data.id +
          paid_price +
          counselor_id +
          pay_type;
        black_infos[1].innerHTML = data.counselor_name;
        black_infos[2].innerHTML = data.counsel_date;
        black_infos[3].innerHTML = data.counsel_type;
        black_infos[4].innerHTML = data.address;
        black_infos[5].innerHTML = `${paid_price.toLocaleString()}` + "원";
        black_infos[7].innerHTML = when_paid;
        if (pay_type == 0) {
          black_infos[6].src = "/static/images/k-pay.svg";
        } else if (pay_type == 1) {
          black_infos[6].src = "/static/images/n-pay.svg";
        } else {
          black_infos[6].src = "/static/images/toss-pay.svg";
        }
      });
  });
