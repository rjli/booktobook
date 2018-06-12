var app = getApp();
var util = require("../../../utils/util.js");
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
    this.requestBooklistDetail();
  },
  requestBooklistDetail: function () {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_findBookDetailById.st"
    var data = {
      "bookListId": this.data.bookListId,
    }
    util.http(url, data, "GET", this.processBookData, false);
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
    var data = {
      machineId: this.data.machineId,
      bookcaseId: this.data.bookCaseId,
      bookListId: this.data.book.id,
      bookId: this.data.bookId,
      memberId: wx.getStorageSync('userInfo').memberid
    }
    var url = app.globalData.zbtcBase + "/DPlatform//btb/bro/fbro0020_createTheBorrowingRecord.st";
    util.http(url, data, "POST", this.processResult, false);
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
      title: data.message,
      success: function () {
        if (data.message.indexOf("成功") > 0) {
          wx.redirectTo({
            url: '../../borrow/borrow',
          })
        }
      }
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