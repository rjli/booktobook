var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    comments: [],
    totalCount: 0,
    isEmpty: true,
    defaultCount: 8
  },
  onLoad: function(options) {
    var booklistId = options.boolistId;
    this.setData({
      booklistId: booklistId
    })
    this.requestComments(0);
  },
  onPullDownRefresh: function(event) {
    this.setData({
      isEmpty: true,
      totalCount: 0,
      comments: []
    })
    this.requestComments(0);

  },
  onReachBottom: function(event) {
    this.requestComments(this.data.totalCount);
  },
  requestComments: function(start) {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_findBookCommentById.st"
    var data = {
      "bookListId": this.data.booklistId,
      "start": start,
      "count": this.data.defaultCount
    }
    util.http(url, data, "GET", this.processCommentsData, false);
  },
  processCommentsData: function(data) {
    var comments = data;
    var totalComments = [];
    if (this.data.isEmpty) {
      totalComments = comments;
      this.setData({
        isEmpty: false
      });
    } else {
      totalComments = this.data.comments.concat(comments);
    }
    this.setData({
      comments: totalComments,
      totalCount: this.data.totalCount + this.data.defaultCount
    })
    wx.stopPullDownRefresh();
  },
  goToComment: function(event) {
    wx.navigateTo({
      url: '../create-comment/create-comment?boolistId=' + this.data.booklistId
    })
  },
})