var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    book: ""
  },
  onLoad: function(options) {
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
  requestBooklistDetail: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_findBookDetailById.st"
    var data = {
      "bookListId": this.data.bookListId,
    }
    util.http(url, data, "GET", this.processBookData, false);
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow: function(options) {
    if (app.globalData.isBack) {
      this.requestBooklistDetail();
      app.globalData.isBack = false;
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  /**
   * 请求服务器，实现结束的打开柜门的操作
   */
  onBorrowTap: function(event) {
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
  viewBookPostImg: function(event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  /**
   * 显示图书的信息
   */
  processBookData: function(data) {
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
  processResult: function(data) {
    if (data.message.indexOf("成功") > 0) {
      wx.navigateBack({
        delta: 2,
        success: function() {
          wx.showToast({
            title: data.message,
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: data.message,
      })
    }

  },
  goToMoreComments: function(event) {
    wx.navigateTo({
      url: '../comments/comments?boolistId=' + this.data.book.id
    })
  },
  goToComment: function(event) {
    wx.navigateTo({
      url: '../create-comment/create-comment?boolistId=' + this.data.book.id
    })
  },
  onShareTap:function(){
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈"
    ];
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        switch(res.tapIndex){
          case 0: that.onShareAppMessage();
                 break;
          case 1: break;
        }
      }
    })
  },
  /*
   * 右上角转发功能 
   * */
  onShareAppMessage: function(res) {
    var that = this;
    console.log(res);
    // if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res.target)
    // }
    return {
      title: that.data.book.title+  '一句话，一辈子',
      path: '/pages/booklists/booklist-detail?machineId=' + that.data.machineId + '&bookCaseId=' + that.data.bookCaseId + '&bookId=' + that.data.bookId + '&bookCaseNumber=' + that.data.bookCaseNumber + '&bookListId=' + that.data.bookListId + '&btnType=' + that.data.btnType,
      // imageUrl: that.data.book.image,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }

})