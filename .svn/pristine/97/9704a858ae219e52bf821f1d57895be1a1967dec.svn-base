var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {
  },
  getUserInfo: function (event) {
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
      },
      fail: res=>{
        wx.showToast({
          title: res.errMsg,
        })
      }
    })

  },
  processLogin: function (data) {
    var userInfo = this.data.tempUser;
    userInfo.openid = data.openid;
    userInfo.userid = data.userid;
    userInfo.memberid = "";
    wx.setStorageSync("userInfo", userInfo);
    app.globalData.isBack = true;
    wx.navigateBack({
      delta: 1
    })
  },
})