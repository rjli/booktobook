var app = getApp();
var requestData = require("../../../utils/requestData.js");
Page({
  data: {
    rate: 0,
    comment: "",
    focus: false
  },
  onLoad: function (options) {
    var booklistId = options.boolistId;
    this.setData({
      booklistId: booklistId
    })
  },
  handleChange: function (event) {
    this.setData({
      rate: event.detail.value
    })
  },
  onCommentBlur: function (event) {
    this.setData({
      comment: event.detail.value
    });
  },
  onSureTap: function (event) {
    this.setData({
      focus: false
    });
    requestData.createComment(this.data.booklistId, "评论", this.data.rate, this.data.comment, this.processResultData);
  },
  processResultData: function (data) {
    if (data.message.indexOf("成功")>0) {
      app.globalData.isBack = true
    }
    wx.navigateBack({
      delta: 1,
      success: function (res) {
        wx.showToast({
          title: data.message,
          duration: 2000
        })
      }
    })
  }
})