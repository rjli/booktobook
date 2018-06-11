var app = getApp();
var requestData = require("../../../utils/util.js");
Page({
  data: {
    total: 0
  },
  onLoad: function (options) {
  },
  // 存储输入的充值金额
  bindInput: function (event) {
    this.setData({
      total: event.detail.value
    })
  },
  charge: function () {
    // 充值金额必须大于0
    if (parseInt(this.data.total) <= 0 || isNaN(this.data.total)) {
      wx.showModal({
        title: "警告",
        content: "咱是不是还得给你钱？！！",
        showCancel: false,
        confirmText: "不不不不"
      })
    } else {
      var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_registerAccount.st";
      var data = {
        "userid": wx.getStorageSync('userInfo').userid,
        "memberid": userInfo.memberid,
        "total": this.data.total
      }
      util.http(url, data, "POST", this.processCharge, false);
    }
  },
  processCharge: function (data) {
    wx.navigateBack({
      delta: 2,
      success: (res) => {
        wx.setStorage({
          key: 'wallet',
          data: parseInt(this.data.total)
        })
        wx.showToast({
          title: "充值成功",
          icon: "success",
          duration: 2000
        })
      }
    })
  }
})