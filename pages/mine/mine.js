var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    // 用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 页面加载
  onLoad: function () {
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
      this.updateUserInfo();
    }
    else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  onShow: function (options) {
    if (app.globalData.isBack) {
      this.updateUserInfo();
    }
  },
  updateUserInfo: function () {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_judgeMember.st";
    var data = {
      "userId": this.data.userInfo.userid
    }
    util.http(url, data, "POST", this.processUpdateUserInfo, true);
  },
  processUpdateUserInfo: function (data) {
    if (data) {
      this.data.userInfo.bindUserId = data.banduserid ? data.banduserid : "";
      this.data.userInfo.memberid = data.memberid ? data.memberid : "";
      this.data.userInfo.memberStartDate = data.memberStartDate ? data.memberStartDate : "";
      this.data.userInfo.memberExpirationDate = data.memberExpirationDate ? data.memberExpirationDate : "";
      wx.setStorageSync('userInfo', this.data.userInfo);
    }
  },
  getUserInfo: function (event) {
    var that = this;
    wx.login({
      success: res => {
        this.setData({
          tempUser: event.detail.userInfo
        });
        var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0010_createUserFromMiniProgram.st";
        var data = {
          "code": res.code,
          "userInfo": JSON.stringify(event.detail.userInfo)
        }
        util.http(url, data, "POST", this.processLogin, false);
      }
    })

  },
  processLogin: function (data) {
    var userInfo = this.data.tempUser;
    userInfo.openid = data.openid;
    userInfo.userid = data.userid;
    userInfo.memberid = "";
    wx.setStorageSync("userInfo", userInfo);
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
  },
  // 跳转至钱包
  movetoWallet: function (event) {
    wx.navigateTo({
      url: 'wallet/wallet'
    })
  },
  movetoAbout: function (event) {
    wx.navigateTo({
      url: 'about/about'
    })
  },
  moveToRegisterMember: function (event) {
    wx.navigateTo({
      url: '../member/member',
    })
  },
  /**
   * 获取正在借阅的书籍
   */
  onBorrowTap: function (event) {
    wx.navigateTo({
      url: '../borrow/borrow',
    })
  },
  // 图书上架
  onShalveTap: function (event) {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        var id = res.result;
        wx.navigateTo({
          url: '../machines/machine/machine?id=' + id + '&type=all&caseType=shalve',
        })
      }, fail: (res) => {
      }
    })
  }
})