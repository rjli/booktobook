var app = getApp();
var util = require("../../../utils/util.js");
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
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_createTheBookComment.st"
    var data = {
      "bookListId": this.data.booklistId,
      "userId": wx.getStorageSync('userInfo').userid,
      "type": "评论",
      "score": this.data.rate,
      "content": this.data.comment
    }
    util.http(url, data, "POST", this.processResultData, false);
  },
  processResultData: function (data) {
    if (data.message.indexOf("成功") > 0) {
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