var app= getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    userInfo: ""
  },

  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    console.log(this.data.userInfo)
  },
  onPhoneBlurTap:function(event){
     this.setData({
       phone: event.detail.value
     })
  },
  onNameBlurTap:function(event){
    this.setData({
      name: event.detail.value
    })
  },
  updateUserInfo: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/usr/fusr0020_updateTheWcMember.st";
    var data = {
      wcmemberId: this.data.userInfo.userid,
      userName: this.data.name,
      phone: this.data.phone
    }
    console.log(data);
    util.http(url, data, "GET", this.processUserInfo, true);
  },
  processUserInfo: function(data) {
    if(data.message.indexOf("成功") > 0){
      this.data.userInfo.name = this.data.name;
      this.data.userInfo.phone = this.data.phone;
      wx.setStorageSync("userInfo", this.data.userInfo)
    }
    wx.showToast({
      title: data.message
    })
  }

})