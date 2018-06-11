var requestData = require("../../../utils/requestData.js");
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
      requestData.registerAccount(this.data.total,"钱包", this.processCharge);
    }
  },
  processCharge: function (data) {
    wx.navigateBack({
      delta: 1,
      success: (res) => {
        wx.showToast({
          title: "充值成功",
          icon: "success",
          duration: 2000
        })
      }
    })
  }
})