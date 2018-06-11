var app = getApp();
var util = require("../../utils/util.js");

Page({
  data: {
    message: "",
    borrowBook: ""
  },
  onLoad: function (options) {
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
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_renewBook.st"
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
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        var id = res.result;
        //扫描借书机二维码
        // var id = '4028e4996349c2bb01634e85e53700a0';
        wx.navigateTo({
          url: '../machines/machine/machine?id=' + id + '&type=bookCase&caseType=return&borrowRecordId=' + borrowRecordId + '&delayMoney=' + delayMoney + '&overDay=' + overDay,
        })
      }, fail: (res) => {
      }
    })
  },
  onProblemTap: function (event) {
    wx.navigateTo({
      url: '../problem/problem?problemType=book&borrowRecordId='+this.data.id,
    })

  }
})