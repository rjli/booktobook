var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    returnBookList: [],
    message: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function(options) {
    this.getReturnBookList(this.data.totalCount);
  },
  onReachBottom: function(event) {
    this.getReturnBookList(this.data.totalCount);
  },
  onPullDownRefresh: function(event) {
    this.setData({
      returnBookList: [],
      message: "",
      totalCount: 0,
      isEmpty: true
    })
    this.getReturnBookList(this.data.totalCount);
  },
  getReturnBookList: function(start) {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_getUnreviewBookList.st";
    var data = {
      start: start,
      count: 4
    }
    util.http(url, data, "GET", this.processReturnBookList, true);
  },
  processReturnBookList: function(data) {
    if (data.length > 0) {
      var returnBookList = [];
      if (this.data.isEmpty) {
        returnBookList = data;
        this.setData({
          isEmpty: false
        })
      } else {
        returnBookList = this.data.returnBookList.contact(data);
      }
      this.setData({
        returnBookList: returnBookList,
        totalCount: this.data.totalCount + 4
      })
      wx.stopPullDownRefresh();
    } else {
      this.setData({
        message: "最近还没有人归还图书哦"
      })
    }
  },
  onReviewTap: function(event) {
    var borrowRecordId = event.currentTarget.dataset.borrowRecordId;
    wx.navigateTo({
      url: '../borrow/borrow?pageType=return&borrowRecordId=' + borrowRecordId,
    })
  }
})