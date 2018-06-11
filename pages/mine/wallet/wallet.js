var requestData = require("../../../utils/requestData.js");
Page({
  data: {
    wallet: 0,
    redpacket: 0
  },
  // 页面加载
  onLoad: function (options) {
    requestData.getAccountInfo(this.processWallet);
  },
  onShow: function (options) {
    requestData.getAccountInfo(this.processWallet);
  },
  onWalletDescTap: function (event) {
    wx.showModal({
      title: "",
      content: "余额可用于会员费，购买图书等",
      showCancel: false,
      confirmText: "我知道了",
    })
  },
  processWallet: function (data) {
    this.setData({
      wallet: data.wallet ? data.wallet : 0,
      redpacket: data.redpacket ? data.redpacket : 0
    })
  },
  // 跳转到充值页面
  movetoCharge: function () {
    wx.navigateTo({
      url: '../charge/charge'
    })
  }

})