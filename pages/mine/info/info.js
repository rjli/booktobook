var app= getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    userInfo: "",
    change:false
  },

  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    console.log(this.data.userInfo)
  },
  onPhoneBlurTap:function(event){
     this.setData({
       phone: event.detail.value,
       change:true
     })
  },
  onNameBlurTap:function(event){
    this.setData({
      name: event.detail.value,
      change:true
    })
  },
  updateUserInfo: function() {
    if(this.data.change){
      var url = app.globalData.zbtcBase + "/DPlatform/btb/usr/fusr0020_updateTheWcMember.st";
      var data = {
        wcmemberId: this.data.userInfo.userid,
        userName: this.data.name,
        phone: this.data.phone
      }
      util.http(url, data, "GET", this.processUserInfo, true);
    }else{
      wx.showToast({
        title: '您没有做修改噢',
      })
    }
   
  },
  processUserInfo: function(data) {
    if(data.message.indexOf("成功") > 0){
      this.data.userInfo.userName = this.data.userName;
      this.data.userInfo.phone = this.data.phone;
      wx.setStorageSync("userInfo", this.data.userInfo)
    }
    wx.navigateBack({
      delta:1,
      success: function(){
        wx.showToast({
          title: data.message,
          duration: 2000
        })
      }
    })
   
  }

})