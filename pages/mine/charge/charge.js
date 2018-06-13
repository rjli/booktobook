var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    total: 0
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
  },
  // 存储输入的充值金额
  bindInput: function (event) {
    this.setData({
      total: event.detail.value
    })
  },
  doUndifiedOrder: function () {
    if (parseInt(this.data.total) <= 0 || isNaN(this.data.total)) {
      wx.showModal({
        title: "警告",
        content: "咱是不是还得给你钱？！！",
        showCancel: false,
        confirmText: "不不不不"
      })
    } else {
      var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0020_goToUnifiedOrder.st"
      var data = {
        "type": "账户充值",
        "openid": this.data.userInfo.openid,
        "totalMoney": this.data.total
      }
      util.http(url, data, "POST", this.processUndifiedOrder, false);
    }
  },
  processUndifiedOrder: function (data) {
    if (data.message.indexOf('成功') > 0) {
      wx.requestPayment(
        {
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': res => {
            console.log(res);
            wx.showToast({
              title: '操作成功',
            })
            this.charge(data.outTradeNo);
          },
          'fail': res => {
            console.log(res);
            wx.showToast({
              title: res.errMsg,
            })
          },
          'complete': res => { }
        })
    } else {
      wx.showToast({
        title: '支付请求失败，请稍候在试',
      })
    }
  },
  charge: function (outTradeNo) {
      var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_registerAccount.st";
      var data = {
        "userId": this.data.userInfo.userid,
        "memberId": this.data.userInfo.memberid,
        "total": this.data.total,
        "orderNum": outTradeNo,
        "type":"钱包"
      }
      util.http(url, data, "POST", this.processCharge, false);
  },
  processCharge: function (data) {
    wx.navigateBack({
      delta: 1,
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