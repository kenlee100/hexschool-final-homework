import {
  confirmDialog,
  progress,
  loadingStatus,
  timestampConvert,
} from "./utilities.js";
import { config } from "./config.js";

const api_path = "ken100";
const orderListBody = document.querySelector(".orderListBody");
const discardAllBtn = document.querySelector(".discardAllBtn");

let orderData = [];

// 取得訂單列表
function getOrderList() {
  loadingStatus(true);
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      config
    )
    .then((res) => {
      progress(res, () => {
        orderData = res.data.orders;
        renderOrderList(orderData);
        renderC3_LV2();
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function renderC3_LV2() {
  const obj = {};

  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if (obj[productItem.title] === undefined) {
        obj[productItem.title] = productItem.quantity * productItem.price;
      } else {
        obj[productItem.title] += productItem.quantity * productItem.price;
      }
    });
  });

  let newData = [];
  let unSort = Object.keys(obj);

  unSort.forEach((item) => {
    let arr = [];
    arr.push(item);
    arr.push(obj[item]);
    newData.push(arr);
  });
  newData.sort((a, b) => {
    return b[1] - a[1];
  });

  if (newData.length > 3) {
    let otherTotal = 0;
    newData.forEach((item, index) => {
      if (index > 2) {
        otherTotal += item[1];
      }
    });
    newData.splice(3);
    newData.push(["其他", otherTotal]);
  }
  console.log(newData);
  const chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData,
    },
  });
}

// 修改訂單狀態
function editOrderList(orderId, status) {
  loadingStatus(true);
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: orderId,
          paid: payStatus(status),
        },
      },
      config
    )
    .then((res) => {
      getOrderList();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  loadingStatus(true);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
      config
    )
    .then((res) => {
      getOrderList();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 刪除全部訂單
function deleteAllOrder() {
  loadingStatus(true);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      config
    )
    .then((res) => {
      getOrderList();
    })
    .catch((err) => {
      console.log(err);
    });
}
function renderOrderList(data) {
  let tbody = "";
  if (data.length === 0) {
    discardAllBtn.classList.remove("-show");
  } else {
    discardAllBtn.classList.add("-show");
  }
  data.forEach((item) => {
    let productList = "";
    let status = item.paid ? "已處理" : "未處理";
    item.products.forEach((productItem, index) => {
      if (item.products.length > 1) {
        productList += `
        <li>
          ${index + 1}. ${productItem.title} x ${productItem.quantity}
        </li>
        `;
      } else {
        productList += `
        <li>
          ${productItem.title} x ${productItem.quantity}
        </li>
        `;
      }
    });
    tbody += `
    <tr>
      <td>${item.createdAt * 10}</td>
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
        <a href="#" data-status="${item.paid}" data-id="${
      item.id
    }">${status}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${
          item.id
        }" data-createdAt="${item.createdAt * 10}">
      </td>
    </tr>
    `;
  });
  orderListBody.innerHTML = tbody;
}

// 訂單狀態
function payStatus(status) {
  let newStatus = "";
  if (status === "false") {
    newStatus = true;
  } else {
    newStatus = false;
  }
  return newStatus;
}

orderListBody.addEventListener("click", (e) => {
  e.preventDefault();
  const status = e.target.getAttribute("data-status");
  const orderId = e.target.getAttribute("data-id");
  const createdAt = e.target.getAttribute("data-createdAt");
  if (e.target.hasAttribute("data-status")) {
    editOrderList(orderId, status);
  }

  if (e.target.classList.contains("delSingleOrder-Btn")) {
    confirmDialog(`確定刪除 ${createdAt} 訂單？`, () => {
      deleteOrderItem(orderId);
    });
  }
});
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  confirmDialog("確定清除全部訂單？", deleteAllOrder);
});

function init() {
  getOrderList();
}
init();
