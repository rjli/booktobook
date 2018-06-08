var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    total: 0
  },
  // 页面加载
  onLoad: function (options) {
  },
  // 存储输入的充值金额
  bindInput: (res) => {
    this.setData({
      total: res.detail.value
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
      var userInfo = wx.getStorageSync('userInfo');
      var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_registerAccount.st";
      var data = {
        "rkspAutoComplete": true,
        "userid": userInfo.userid,
        "memberid": userInfo.memberid,
        "total": this.data.total
      }
      util.http(url, data, "GET", this.processCharge);
    }
  },
  processCharge: (data) => {
    var that = this;
    wx.navigateBack({
      delta: 2,
      success: (res) => {
        wx.setStorage({
          key: 'wallet',
          data: parseInt(that.data.total)
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