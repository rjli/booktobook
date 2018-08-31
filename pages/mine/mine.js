var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    // 用户信息
    userInfo: {},
    hasUserInfo: false
  },
  // 页面加载
  onLoad: function() {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
    })
    this.updateUserInfo();

  },
  onShow: function(options) {
    if (app.globalData.isBack) {
      this.updateUserInfo();
    }
  },
  updateUserInfo: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_judgeMember.st";
    var data = {
      "userId": this.data.userInfo.userid
    }
    util.http(url, data, "POST", this.processUpdateUserInfo, true);
  },
  processUpdateUserInfo: function(data) {
    if (data) {
      var tempUserInfo = this.data.userInfo;
      tempUserInfo.binduserid = data.binduserid ? data.binduserid : "";
      tempUserInfo.memberid = data.memberid ? data.memberid : "";
      tempUserInfo.memberType = data.memberType ? data.memberType : "";
      tempUserInfo.memberStartDate = data.memberStartDate ? data.memberStartDate : "";
      tempUserInfo.memberExpirationDate = data.memberExpirationDate ? data.memberExpirationDate : "";
      tempUserInfo.userName = data.userName ? data.userName : "";
      tempUserInfo.phone = data.phone ? data.phone : "";
      this.setData({
        userInfo: tempUserInfo
      })
      wx.setStorageSync('userInfo', tempUserInfo);
    }
  },
  // 跳转至钱包
  movetoWallet: util.throttle(function(event) {
    wx.navigateTo({
      url: 'wallet/wallet'
    })
  }),
  movetoAbout: util.throttle(function(event) {
    wx.navigateTo({
      url: 'about/about'
    })
  }),
  moveToRegisterMember: util.throttle(function(event) {
    wx.navigateTo({
      url: '../member/member',
    })
  }),
  /**
   * 获取正在借阅的书籍
   */
  onBorrowTap: util.throttle(function(event) {
    wx.navigateTo({
      url: '../borrow/borrow?pageType=borrow',
    })
  }),
  /**
   * 已经归还的图书
   */
  onHistoryTap: util.throttle(function(event) {
    wx.navigateTo({
      url: '../borrows/borrows',
    })
  }),
  // 图书上架
  onShalveTap: util.throttle(function(event) {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        var id = res.result;
    // var id ="4028e4996349c2bb01634e85e53700a0";
        wx.navigateTo({
          url: '../machines/machine/machine?id=' + id + '&type=all&caseType=shalve',
        })
      },
      fail: (res) => {}
    })
  }),
  //跳转到还书审核页面
  onReturnTap: util.throttle(function(event) {
    wx.navigateTo({
      url: '../reviews/reviews',
    })
  }),
  onInfoTap: util.throttle(function(event) {
    wx.navigateTo({
      url: 'info/info',
    })
  }),
  onWantTap: util.throttle(function(event) {
    wx.navigateTo({
      url: '../problem/problem?problemType=want',
    })
  }),
  moveToUserGuide: util.throttle(function (event) {
     wx.navigateTo({
       url: '../user-guide/user-guide',
     })
  })
})