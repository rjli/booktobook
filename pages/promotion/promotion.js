var app = getApp();
var util = require("../../utils/util.js");
Page({

  data: {
    show: false,
    total: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var promotionStr = options.promotionStr;
    var promotion = JSON.parse(promotionStr);
    console.log(promotion);
    this.setData({
      promotion: promotion,
    })
    this.countTotal();
  },
  // 计算红包金额
  countTotal: function() {
    var total = this.data.promotion.packetsQuotient;
    var type = this.data.promotion.packetsQuotient;
    if (!!total) {
      var packetsTotal = this.data.promotion.packetsTotal;
      var packetsNumber = this.data.promotion.packetsNumber;
      var GetAmount = this.data.promotion.GetAmount;
      var GetNumber = this.data.promotion.GetNumber;
      var packetsTotalNow = packetsTotal - GetAmount;
      var number = packetsNumber - GetNumber;
      total = packetsTotalNow / number;
      if (number != 1) {
        total = this.randAlloc(packetsTotalNow, total - 1, total + 1, number)[0];
      } else if (number == 0) {}
    }
    this.setData({
      total: total
    })
  },
  randAlloc: function(total, min, max, length) {
    // 首先要判断是否符合 min 和 max 条件
    if (min * length > total || max * length < total) {
      throw Error(`没法满足最最少 ${min} 最大 ${max} 的条件`);
    }
    const result = [];
    let restValue = total;
    let restLength = length;
    for (let i = 0; i < length - 1; i++) {
      restLength--;
      // 这一次要发的数量必须保证剩下的要足最小量
      // 同进要保证剩下的不能大于需要的最大量
      const restMin = restLength * min;
      const restMax = restLength * max;
      // 可发的量
      const usable = restValue - restMin;
      // 最少要发的量
      const minValue = Math.max(min, restValue - restMax);
      // 以 minValue 为最左，max 为中线来进行随机，即随机范围是 (max - minValue) * 2
      // 如果这个范围大于 usable - minValue，取 usable - minValue
      const limit = Math.min(usable - minValue, (max - minValue) * 2);
      // 随机部分加上最少要发的部分就是应该发的，但是如果大于 max，最大取到 max
      result[i] = Math.min(max, minValue + Math.floor(limit * Math.random()));
      restValue -= result[i];
    }
    result[length - 1] = restValue;

    return result;
  },

  /*
   * 右上角转发功能 
   * */
  onShareAppMessage: function(res) {
    var that = this;
    console.log(res);
    if (res.from === 'menu') {
      // 来自页面内转发按钮
    }
    return {
      title: "“书来书往”读书季享好礼，分享即可领红包哦",
      path: '/pages/index/index',
      imageUrl: this.data.coverUrl,
      success: function(res) {
        // 转发成功
        console.log("转发成功")
        console.log(that.data.promotion.message.indexOf("已参加") > -1)
        if (that.data.promotion.message.indexOf("已参加") > -1) {
          wx.showModal({
            title: '通知',
            content: '您已经参加过活动了，此次分享不会再发红包了哦'
          })
        } else {
          that.addPromotionsDetial();
        }
      },
      fail: function(res) {
        // 转发失败
        console.log(res);
      }
    }
  },
  /**
   * 添加活动明细
   */
  addPromotionsDetial: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/act/fact0040_createThePromotionDetail.st";
    var data = {
      "acyivityId": this.data.promotion.acyivityId,
      "userId": wx.getStorageSync('userInfo').userid,
      "bonusAmouunt": "10",
      "receiveState": "未领"
    }
    console.log(data);
    util.http(url, data, "POST", this.processPromotionData, true);
  },
  processPromotionData: function(data) {
    console.log(data);
    if (data && data.message.indexOf("成功") > -1) {
      this.setData({
        show: true,
        acyivityDetailId: data.acyivityDetailId
      })
    }
  },

  /**
   * 领取红包
   */
  onReceivingTap: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/act/fact0040_updateActivityDetailAndAccount.st";
    var data = {
      "acyivityDetailId": this.data.acyivityDetailId,
      "receiveState": "已领"
    }
    util.http(url, data, "POST", this.processReceivingData, true);
  },
  processReceivingData: function(data) {
    console.log(data);
    var that = this;
    if (data && data.message.indexOf("成功") > -1) {
      wx.showModal({
        title: '通知',
        content: '你的红包' + this.data.total + '已到账，是否到我的红包查看',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../mine/wallet/wallet',
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
            wx.navigateBack({
              delta: 1
            })
          }

        }
      })
    }
  },

})