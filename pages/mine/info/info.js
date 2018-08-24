var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    userInfo: "",
    change: false
  },

  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo,
      userName: userInfo.userName,
      phone: userInfo.phone
    })
  },
  onPhoneInputTap: function(event) {
    var change = false;
    if (this.data.phone != event.detail.value) {
      change = true;
    }
    this.setData({
      phone: event.detail.value,
      change: change
    })

  },

  onNameInputTap: function(event) {
    var change = false;
    if (this.data.userName != event.detail.value) {
      change = true;
    }
    this.setData({
      userName: event.detail.value,
      change: change
    })
  },
  updateUserInfo: function() {
    if (this.data.change) {
      var url = app.globalData.zbtcBase + "/DPlatform/btb/usr/fusr0020_updateTheWcMember.st";
      var data = {
        wcmemberId: this.data.userInfo.userid,
        userName: this.data.userName,
        phone: this.data.phone
      }
      util.http(url, data, "GET", this.processUserInfo, true);
    } else {
      wx.showToast({
        title: '您没有做修改噢',
      })
    }

  },
  processUserInfo: function(data) {
    if (data.message.indexOf("成功") > 0) {
      this.data.userInfo.userName = this.data.userName;
      this.data.userInfo.phone = this.data.phone;
      wx.setStorageSync("userInfo", this.data.userInfo)
    }
    wx.navigateBack({
      delta: 1,
      success: function() {
        wx.showToast({
          title: data.message,
          duration: 2000
        })
      }
    })

  }

})