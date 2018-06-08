var app = getApp();
var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    book: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      machineId: options.machineId,
      bookCaseId: options.bookCaseId,
      bookId: options.bookId,
      bookCaseNumber: options.bookCaseNumber,
      bookListId: options.bookListId
    });
    this.requestBooklistDetail();
  },
  requestBooklistDetail: function () {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_findBookDetailById.st"
    var data = {
      "rkspAutoComplete": true,
      "bookListId": this.data.bookListId,
    }
    util.http(url, data, "GET", this.processBookData);
  },
  onShow: function (options) {
    if (app.globalData.isBack) {
      this.requestBooklistDetail();
      app.globalData.isBack = false;
    }
  },
  /**
   * 请求服务器，实现结束的打开柜门的操作
   */
  onBorrowTap: function (event) {
    var userInfo = wx.getStorageSync("userInfo");
    console.log(this.data.book.id);
    var data = {
      machineId: this.data.machineId,
      bookcaseId: this.data.bookCaseId,
      bookListId: this.data.book.id,
      bookId: this.data.bookId,
      memberId: userInfo.userid
    }
    var url = app.globalData.zbtcBase + "/DPlatform//btb/bro/fbro0020_createTheBorrowingRecord.st?rkspAutoComplete=true";
    util.http(url, data, "GET", this.processResult);
  },
  /**
   * 预览图片信息
   */
  viewBookPostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  /**
   * 显示图书的信息
   */
  processBookData: function (data) {
    data.average = data.rating.average
    this.setData({
      book: data
    });
    wx.setNavigationBarTitle({
      title: data.title
    })
  },
  /**
   * 处理服务器返回的打开借书单元的结果
   */
  processResult: function (data) {
    wx.showToast({
      title: data.message
    })
  },
  goToMoreComments: function (event) {
    wx.navigateTo({
      url: '../comments/comments?boolistId=' + this.data.book.id
    })
  },
  goToComment: function (event) {
    wx.navigateTo({
      url: '../create-comment/create-comment?boolistId=' + this.data.book.id
    })
  }

})