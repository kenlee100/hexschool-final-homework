import {
  confirmDialog,
  progress,
  loadingStatus,
  toThousands,
} from "./utilities.js";
const api_path = "ken100";

let productData = [];
let cartData = [];
let errors;
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");

const cartLisBody = document.querySelector(".cartLisBody");
const cartListFoot = document.querySelector(".cartListFoot");
const shoppingCartTable = document.querySelector(".shoppingCart-table");

const orderInfoForm = document.querySelector(".orderInfo-form");
const inputs = orderInfoForm.querySelectorAll(
  'input[type="text"],input[type="tel"],input[type="email"],select'
);
const orderInfoBtn = document.querySelector(".orderInfo-btn");

const loading = document.querySelector(".loading");

const constraints = {
  姓名: {
    presence: {
      message: "必填",
    },
  },
  電話: {
    presence: {
      message: "必填",
    },
    length: {
      minimum: 10,
      message: "號碼至少10碼",
    },
  },
  Email: {
    presence: {
      message: "必填",
    },
    email: {
      message: "請輸入正確格式",
    },
  },
  寄送地址: {
    presence: {
      message: "必填",
    },
  },
};

// 取得產品列表
function getProductList() {
  loadingStatus(true);
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then((res) => {
      progress(res, () => {
        productData = res.data.products;
        renderProductList(productData);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 加入購物車
function addCartItem(productId, count, productTitle) {
  loadingStatus(true);
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: productId,
          quantity: count,
        },
      }
    )
    .then((res) => {
      progress(res, () => {
        cartData = res.data;
        renderCartList(cartData);
        alert(`${productTitle} 已加入購物車`, res.data);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 取得購物車列表
function getCartList() {
  loadingStatus(true);
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then((res) => {
      progress(res, () => {
        cartData = res.data;
        renderCartList(cartData);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 編輯購物車產品數量
function editCartList(cartId, count) {
  loadingStatus(true);
  axios
    .patch(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          id: cartId,
          quantity: count,
        },
      }
    )
    .then((res) => {
      progress(res, () => {
        cartData = res.data;
        renderCartList(cartData);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 清除購物車內全部產品
function deleteAllCartList() {
  loadingStatus(true);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then((res) => {
      progress(res, () => {
        cartData = res.data;
        renderCartList(cartData);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  loadingStatus(true);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then((res) => {
      progress(res, () => {
        cartData = res.data;
        renderCartList(cartData);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 送出購買訂單
function createOrder(data) {
  loadingStatus(true);
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: data.customerName,
            tel: data.customerPhone,
            email: data.customerEmail,
            address: data.customerAddress,
            payment: data.tradeWay,
          },
        },
      }
    )
    .then((res) => {
      progress(res, () => {
        orderInfoForm.reset();
        getCartList();
        alert("訂單已送出");
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 顯示商品
function renderProductList(data) {
  let str = "";
  data.forEach((item) => {
    str += `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt="">
      <a href="#" class="addCardBtn" data-id="${item.id}" data-title="${
      item.title
    }">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
      <p class="nowPrice">NT$${toThousands(item.price)}</p>
    </li>
    `;
  });
  productWrap.innerHTML = str;
}
function renderCartList(data) {
  let tbody = "";
  let tfoot = "";
  data.carts.forEach((item) => {
    tbody += `
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="https://i.imgur.com/HvT3zlU.png" alt="">
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${item.product.price}</td>
      <td>
        <input type="number" class="input-step" value="${
          item.quantity
        }" step="1" min="1" max="10" data-id="${item.id}" />
      </td>
      <td>NT$${toThousands(item.quantity * item.product.price)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}" data-title="${
      item.product.title
    }">
          clear
        </a>
      </td>
    </tr>
    `;
  });

  if (data.carts.length === 0) {
    cartListFoot.innerHTML = "";
  } else {
    tfoot = `
      <tr>
        <td>
          <a href="#" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
          <p>總金額</p>
        </td>
        <td>NT$ ${toThousands(data.finalTotal)}</td>
      </tr>`;
    cartListFoot.innerHTML = tfoot.trim();
  }

  cartLisBody.innerHTML = `${tbody}`;
}

cartLisBody.addEventListener("change", (e) => {
  const cartId = e.target.getAttribute("data-id");
  if (!e.target.classList.contains("input-step")) {
    return;
  }
  editCartList(cartId, parseInt(e.target.value));
});

// 篩選分類
productSelect.addEventListener("change", (e) => {
  const selectItem = e.target.value;
  const filterData = productData.filter((item) => {
    if (selectItem === "全部") {
      return item;
    } else if (selectItem === item.category) {
      return selectItem === item.category;
    }
  });

  renderProductList(filterData);
});

// 加入購物車
productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  const productId = e.target.getAttribute("data-id");
  if (!e.target.classList.contains("addCardBtn")) {
    return;
  }

  let count = 1;
  cartData.carts.forEach((item) => {
    if (productId === item.product.id) {
      count = item.quantity += 1;
    }
  });
  addCartItem(productId, count, e.target.getAttribute("data-title"));
});

// 清除購物車
shoppingCartTable.addEventListener("click", (e) => {
  e.preventDefault();
  const productId = e.target.getAttribute("data-id");
  const productTitle = e.target.getAttribute("data-title");
  if (e.target.classList.contains("material-icons")) {
    confirmDialog(`要將 ${productTitle} 從購物車中移除？`, () => {
      deleteCartItem(productId);
    });
    return;
  }
  if (e.target.classList.contains("discardAllBtn")) {
    confirmDialog(`確定清除購物車？`, () => {
      deleteAllCartList();
    });
  }
});

// 表單驗證訊息顯示開閉
function inputValidToggle(el) {
  if (errors[el.getAttribute("data-message")] === undefined) {
    el.classList.remove("-show");
    el.textContent = "";
  } else {
    el.classList.add("-show");
    el.textContent = errors[el.getAttribute("data-message")];
  }
}
inputs.forEach((item) => {
  item.addEventListener("input", (e) => {
    if (e.target.nodeName === "SELECT") return;
    const validMsg = e.target.nextElementSibling;
    errors = validate(orderInfoForm, constraints) || "";
    inputValidToggle(validMsg);
  });
});

// 送出資料
orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cartData.carts.length === 0) {
    alert("請將商品加入購物車");
    return;
  }
  let obj = {};
  inputs.forEach((item) => {
    if (obj[item.id] === undefined) {
      obj[item.id] = item.value.trim();
    }
    const validMsg = item.nextElementSibling;
    if (validMsg === null) {
      return;
    }
    errors = validate(orderInfoForm, constraints) || "";
    inputValidToggle(validMsg);
  });

  const inputCheck = Object.values(obj).every((item) => {
    return item !== "";
  });
  if (inputCheck && errors === "") {
    createOrder(obj);
    obj = {};
  }
});

// 初始化
function init() {
  getProductList();
  getCartList();
}
init();
