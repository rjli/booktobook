var requestData = require("../../utils/requestData.js");
Page({
  data: {
    message: "",
    borrowBook: ""
  },
  onLoad: function (options) {
    requestData.onGoingBorrowingRecord(this.processBorrowData);
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
    console.log(borrowRecordId);
    requestData.onRewBook(borrowRecordId, this.processReNewData);
  },
  processReNewData: function (data) {
    console.log(data);
    if (!data) {
      wx.showToast(data.message);
    }
  },
  onReturnTap: function (event) {
    var borrowRecordId = this.data.borrowBook.id;
    var delayMoney = this.data.borrowBook.delayMoney;
    var overDay = this.data.borrowBook.overDay;
    //扫描借书机二维码
    var id = '4028e4996349c2bb01634e85e53700a0';
    wx.navigateTo({
      url: '../machines/machine/machine?id=' + id + '&type=bookCase&caseType=return&borrowRecordId=' + borrowRecordId + '&delayMoney=' + delayMoney + '&overDay=' + overDay,
    })
  }
})