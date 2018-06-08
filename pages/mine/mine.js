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
    }
    else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo: function (event) {
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0010_createUserFromMiniProgram.st?rkspAutoComplete=true";
        var data = {
          "code": code,
          "userInfo": JSON.stringify(event.detail.userInfo)
        }
        this.setData({
          tempUser: event.detail.userInfo
        });
        util.http(url, data, "GET", this.processLogin);
      }
    })

  },
  processLogin: function (data) {
    console.log(data);
    var userInfo = this.data.tempUser;
    userInfo.openid = data.openid;
    userInfo.userid = data.userid;
    userInfo.memberid = "";
    app.globalData.userInfo = userInfo;
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
    //扫描借书机二维码
    var id = '4028e4996349c2bb01634e85e53700a0';
    //弹出借书机信息
    wx.navigateTo({
      url: '../machines/machine/machine?id=' + id + '&type=all&caseType=shalve',
    })
  }
})