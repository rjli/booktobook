var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    booklists: [],
    totalCount: 0,
    isEmpty: true,
    defaultCount: 20
  },
  onLoad: function (options) {
    this.setData({
      machineId: options.machineId,
      bookcaseId: options.bookcaseId,
      bookkindId: options.bookkindId
    });
    // 初始化数据
    this.requestBookListData(0);
  },
  onPullDownRefresh: function () {
    this.setData({
      booklists: [],
      totalCount: 0,
      isEmpty: true
    });
    this.requestBookListData(0);
  },
  onReachBottom: function () {
    this.requestBookListData(this.data.totalCount);
  },
  requestBookListData: function (start) {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_getBookListsBykindId.st"
    var data = {
      "bookkindId": this.data.bookkindId,
      "start": start,
      "count": this.data.defaultCount
    }
    util.http(url, data, "GET", this.processBooksData, false);
  },
  processBooksData: function (data) {
    var booklists = data
    var totalBoollists = [];
    if (booklists.length > 0) {
      for (var idx in data) {
        var booklist = booklists[idx];
        if (booklist.name.length >= 6) {
          booklist.name = booklist.name.substring(0, 6) + "...";
        }
      }
      if (this.data.isEmpty) {
        totalBoollists = booklists;
        this.setData({
          isEmpty: false
        })
      } else {
        totalBoollists = this.data.booklists.concat(booklists);
      }
      this.setData({
        booklists: totalBoollists,
        totalCount: this.data.totalCount + this.data.defaultCount
      })
    } else {
      this.setData({ message: '书单还未及时上架，敬请期待' });
    }
    wx.stopPullDownRefresh();
  },
  onBookTap: function (event) {
    var booklistId = event.currentTarget.dataset.booklistId;
    var name = event.currentTarget.dataset.booklistName;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要上架《' + name + '》这本图书吗？',
      success: function (res) {
        if (res.confirm) {
          that.shalveData(booklistId)
        }
      }
    })
  },
  shalveData: function (booklistId) {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_shelfBook.st"
    var data = {
      "machineId": this.data.machineId,
      "bookcaseId": this.data.bookcaseId,
      "bookListId": booklistId,
      "userId": wx.getStorageSync('userInfo').userid
    }
    util.http(url, data, "POST", this.processShalveData, false);

  },
  processShalveData: function (data) {
    if (data.message.indexOf("成功") > 0) {
      app.globalData.isBack = true
    }
    wx.navigateBack({
      delta: 2,
      success: function () {
        wx.showToast({
          title: data.message,
          duration: 2000
        })
      }
    })
  }
})