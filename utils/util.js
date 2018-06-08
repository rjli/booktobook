const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 *处理http请求
 */
function http(url, data, type, callBack, isNavBarLoading) {
  url = url + '?rkspAutoComplete=true';
  console.log("isNavBarLoading:" + isNavBarLoading);
  if (isNavBarLoading) {
    wx.showNavigationBarLoading();
  } else {
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
  }
  let contenttype = "json";
  if (type == "POST") {
    contenttype = "application/x-www-form-urlencoded";
  }
  wx.request({
    url: url,
    data: data,
    method: type,
    header: {
      "Content-Type": contenttype
    },
    success: function (res) {
      if (isNavBarLoading) {
        wx.hideNavigationBarLoading();
      } else {
        wx.hideLoading();
      }
      if ("success" == res.data.status) {
        callBack(res.data.result);
      } else {
        console.log(res.data.result);
        if (res.data.result.message != '') {
          wx.showToast({
            title: res.data.result.message,
          })
        } else {
          wx.showToast({
            title: '系统维护中',
          })
        }
      }
    },
    fail: function (error) {
      wx.showToast({
        title: '网络错误',
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  http: http
}
