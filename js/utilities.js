// 確認訊息 彈窗
export function confirmDialog(msg, callback, params) {
  let check = confirm(msg);
  if (check) {
    callback(params);
  }
}

// loading callback
export function progress(res, callback) {
  if (res.status === 200) {
    callback(res);
    setTimeout(() => {
      loadingStatus(false);
    }, 500);
  }
}

// 讀取畫面與狀態
export function loadingStatus(isShow) {
  const loading = document.querySelector(".loading");
  if (isShow) {
    loading.classList.add("-show");
  } else {
    loading.classList.remove("-show");
  }
}

// 時間小於 9 時前面補上0
export function timePlusZero(time) {
  if (time <= 9) {
    time = `0${time}`;
  }
  return time;
}
// timestamp格式轉換
export function timestampConvert(time) {
  const date = new Date(time * 1000);
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${timePlusZero(h)}:${timePlusZero(m)}:${timePlusZero(s)}`;
}

// 金額千分位
export function toThousands(n) {
  let parts = n.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function taiwanPhoneCheck(str) {
  return /^09\d{2}-?\d{3}-?\d{3}$/.test(str);
}
