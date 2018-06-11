var util = require("../../utils/util.js");
var app = getApp();
var requestData = require("../../utils/requestData.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    console.log("用户信息");
    console.log(userInfo);
    this.setData({
      userInfo: userInfo
    })
  },
  powerDrawer: function (event) {
    var currentStatu = event.currentTarget.dataset.statu;
    this.controlPower(currentStatu)
  },
  controlPower: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;
    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  registerMember: function (data) {
    requestData.registerMember(this.processRegisterMember);
  },
  processRegisterMember: function (data) {
    var userInfo = this.data.userInfo;
    userInfo.memberid = data.memberid;
    userInfo.memberExpirationDate = data.memberExpirationDate;
    userInfo.memberStartTime = data.memberStartTime;
    wx.setStorageSync("userInfo", userInfo);
    this.setData({
      userInfo: userInfo,
    })
    this.controlPower("close");
    wx.showToast({
      title: '会员申请成功',
    })
    app.globalData.isBack = true;
  }
})