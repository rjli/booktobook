var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    depositDisabled: false,
    memberTypeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMemberInfo();
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    var depositDisabled = this.data.depositDisabled;
    if (userInfo.memberType == '押金用户') {
      depositDisabled = true;
    }
    this.setData({
      userInfo: userInfo,
      depositDisabled: depositDisabled
    })
  },
  powerDrawer: function(event) {
    var currentStatu = event.currentTarget.dataset.statu;
    var memberType = event.currentTarget.dataset.memberType;
    console.log("memberType:" + memberType);
    this.setData({
      memberType: memberType
    })
    if (this.data.userInfo.memberType == '押金用户') {
      wx.showToast({
        title: '您已缴纳押金',
      })
    } else {
      this.controlPower(currentStatu);
    }

  },
  controlPower: function(currentStatu) {
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
    setTimeout(function() {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  getMemberInfo: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_memberMessage.st"
    util.http(url, {}, "POST", this.processMemberInfo, false);
  },
  processMemberInfo: function(data) {
    console.log(data);
    this.setData({
      depositUser: data[1],
      member: data[0],
      memberTypeList: data
    })
  },
  doUndifiedOrder: function() {
    console.log(this.data.userInfo.openid);
    var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0020_goToUnifiedOrder.st"
    var data = {
      "type": "会员费充值",
      "openid": this.data.userInfo.openid,
      "totalMoney": "0.01"
    }
    util.http(url, data, "POST", this.processUndifiedOrder, false);

  },
  processUndifiedOrder: function(data) {
    console.log(data);
    if (data.message.indexOf('成功') > 0) {
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        'success': res => {
          console.log(res);
          wx.showToast({
            title: '操作成功',
          })
          this.registerMember(data.outTradeNo);
        },
        'fail': res => {
          console.log(res);
          wx.showToast({
            title: res.errMsg,
          })
        },
        'complete': res => {}
      })
    } else {
      wx.showToast({
        title: '支付请求失败，请稍候在试',
      })
    }
  },
  registerMember: function(outTradeNo) {
    wx.showToast({
      title: '开始更新会员信息',
    })
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_registerMember.st"
    var data = {
      "userId": this.data.userInfo.userid,
      "orderNum": outTradeNo,
      "memberType": this.data.memberType,
      "total": this.data.total
    }
    util.http(url, data, "POST", this.processRegisterMember, false)
  },
  processRegisterMember: function(data) {
    console.log(data);
    var userInfo = this.data.userInfo;
    userInfo.memberid = data.memberid;
    userInfo.memberExpirationDate = data.memberExpirationDate;
    userInfo.memberStartTime = data.memberStartTime;
    userInfo.memberType = data.memberType;
    wx.setStorageSync("userInfo", userInfo);
    if (userInfo.memberType == '押金用户') {
      this.setData({
        depositDisabled: true
      })
    }
    this.setData({
      userInfo: userInfo,
    })
    this.controlPower("close");
    wx.showToast({
      title: '会员申请成功',
    })
    app.globalData.isBack = true;
  },
  onDepositTap: function(event) {
    var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0020_refundMemberFee.st"
    var data = {
      "memberId": this.data.userInfo.memberid
    }
    util.http(url, data, "POST", this.processDeposit, false)
  },
  processDeposit: function(data) {
    console.log(data);
    var message = data.message;
    var userInfo = this.data.userInfo;
    userInfo.memberid = "";
    userInfo.memberExpirationDate = "";
    userInfo.memberStartTime = "";
    userInfo.memberType = "";
    wx.setStorageSync("userInfo", userInfo);
    this.setData({
      userInfo: userInfo,
    })
    app.globalData.isBack = true;
    wx.showToast({
      title: message,
    })
  }
})