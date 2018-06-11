var app = getApp();
var util = require("../../../utils/util.js");
var requestData = require("../../../utils/requestData.js");
Page({
  data: {
    book: ""
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      machineId: options.machineId,
      bookCaseId: options.bookCaseId,
      bookId: options.bookId,
      bookCaseNumber: options.bookCaseNumber,
      bookListId: options.bookListId,
      btnType: options.btnType
    });
    console.log(this.data)
    this.requestBooklistDetail();
  },
  requestBooklistDetail: function () {
    requestData.getBookListDetailById(this.data.bookListId, this.processBookData);
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
    requestData.createTheBorrowingRecord(this.data.machineId, this.data.bookCaseId, this.data.book.id, this.data.bookId, this.processResult);
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
    if (data.message.indexOf("success") > 0) {
      wx.redirectTo({
        url: '../../borrow/borrow',
      })
    }
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