const api_path = 'ken100';
const token = 'JAQDheFa4wNMdLunGZgewHpABK02';

const orderListBody = document.querySelector('.orderListBody');
let orderData = [];

// 取得訂單列表
function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      orderData = res.data.orders;
      renderOrderList(orderData);
      console.log(orderData);
    })
    .catch((err) => {
      console.log(err);
    });
}

// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
    type: 'pie',
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      'Louvre 雙人床架': '#DACBFF',
      'Antony 雙人床架': '#9D7FEA',
      'Anty 雙人床架': '#5434A7',
      其他: '#301E5F',
    },
  },
});

function renderOrderList(data) {
  let tbody = '';
  data.forEach((item) => {
    console.log(item);
    let productList = '';
    let status = '';
    if (item.paid === false) {
      status = '未處理';
    } else {
      status = '已處理';
    }
    item.products.forEach((productItem) => {
      productList += `
      <li>
        ${productItem.title} x ${productItem.quantity}
      </li>
      `;
    });
    tbody += `
    <tr>
      <td>10088377474</td>
      <td>
        <p>${item.user.name}</p>
        <p>${item.user.tel}</p>
      </td>
      <td>${item.user.address}</td>
      <td>${item.user.email}</td>
      <td>
        <ul>
          ${productList}  
        </ul>
        
      </td>
      <td>${timestampConvert(item.createdAt)}</td>
      <td class="orderStatus">
        <a href="#" data-status="${item.paid}">${status}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${
          item.id
        }">
      </td>
    </tr>

    `;
  });
  orderListBody.innerHTML = tbody;
}

function init() {
  getOrderList();
}
init();

// 時間小於 9 時前面補上0
function timePlusZero(time) {
  if (time <= 9) {
    time = `0${time}`;
  }
  return time;
}
// timestamp格式轉換
function timestampConvert(time) {
  const date = new Date(time * 1000);
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${timePlusZero(h)}:${timePlusZero(m)}:${timePlusZero(s)}`;
}
