var app = getApp();
var util = require("../../utils/util.js");

Page({
  data: {
    message: "",
    borrowBook: ""
  },
  onLoad: function (options) {
    this.setData({
      wallet: wx.getStorageSync('wallet') ? wx.getStorageSync('wallet') : 0,
      redpacket: wx.getStorageSync('redpacket') ? wx.getStorageSync('redpacket') : 0
    }
    )
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_onGoingBorrowingRecord.st"
    var data = {
      "memberId": wx.getStorageSync('userInfo').memberId
    }
    util.http(url, data, "GET", this.processBorrowData, false);
  },

  processBorrowData: function (data) {
    if (data.length > 0) {
      this.setData({
        borrowBook: data[0]
      });
    } else {
      this.setData({
        message: "哎呦，您还没有借阅图书呢"
      })
    }
  },
  onRenewTap: function (event) {
    var borrowRecordId = event.currentTarget.dataset.borrowRecordId;
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_renewBook.st"
    var data = {
      "borrowRecordId": borrowRecordId
    }
    util.http(url, data, "GET", this.processReNewData, false);
  },
  processReNewData: function (data) {
    console.log(data);
    if (!!data) {
      wx.showToast({
        title: data.message,
      })
      this.setData({
        borrowBook: data
      }
      )
    }
  },
  onReturnTap: function (event) {
    var borrowRecordId = this.data.borrowBook.id;
    var delayMoney = this.data.borrowBook.delayMoney;
    var overDay = this.data.borrowBook.overDay;
    this.setData({
      purpose: "图书逾期",
      total: delayMoney
    })
    if (delayMoney <= 0) {
      this.goToReturn();
    } else {
      if (this.data.redpacket > parseInt(delayMoney)) {
        wx.showModal({
          title: '通知',
          content: '借阅超过规定日期，你将支付' + delayMoney + '元，否则无法借书',
          success: res => {
            if (res.confirm) {
              this.setData({
                payMethod: "红包",
                orderNum: ""
              })
              this.createConsume();
            }
          }
        })
      } else if (this.data.wallet > parseInt(delayMoney)) {
        wx.showModal({
          title: '通知',
          content: '你将支付' + delayMoney + '元',
          success: res => {
            if (res.confirm) {
              this.setData({
                payMethod: "钱包",
                orderNum: ""
              })
              this.createConsume();
            }
          }
        })
      } else {
        this.doUndifiedOrder(delayMoney);
      }
    }

  },
  doUndifiedOrder: util.throttle(function (delayMoney) {
    var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0020_goToUnifiedOrder.st"
    var data = {
      "type": "账户充值",
      "openid": this.data.userInfo.openid,
      "totalMoney": delayMoney
    }
    util.http(url, data, "POST", this.processUndifiedOrder, false);
  }),
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
            this.setData({
              payMethod: "微信支付",
              orderNum: data.outTradeNo
            })
            this.createConsume(data.outTradeNo);
          },
          'fail': res => {
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
  goToReturn: function () {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        var id = res.result;
        //扫描借书机二维码
        wx.navigateTo({
          url: '../machines/machine/machine?id=' + id + '&type=bookCase&caseType=return&borrowRecordId=' + borrowRecordId + '&delayMoney=' + delayMoney + '&overDay=' + overDay,
        })
      }, fail: (res) => {
      }
    })
  },
  onProblemTap: function (event) {
    wx.navigateTo({
      url: '../problem/problem?problemType=book&borrowRecordId=' + this.data.borrowBook.id,
    })

  },
  createConsume: function () {
    var borrowRecordId = event.currentTarget.dataset.borrowRecordId;
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_expensecost.st"
    var data = {
      "memberId": wx.getStorageSync('userInfo').memberid,
      "total": this.data.total,
      "purpose": this.data.purpose,
      "payMethod": this.data.payMethod,
      "orderNum": this.data.orderNum
    }
    util.http(url, data, "POST", this.processCreateConsumeData, false);
  },
  processCreateConsumeData: function (data) {
    wx.showToast({
      title: data.message,
      success: res => {
        if (data.message.indexOf('成功') > 0) {
          this.goToReturn();
        }
      }
    })
  }
})