var app = getApp();
var util = require("../../utils/util.js");

Page({
  data: {
    message: "",
    borrowBook: "",
    purpose: "",
    pageType: ""
  },
  onLoad: function(options) {
    var pageType = options.pageType;
    this.setData({
      pageType: pageType
    })
    if (pageType == 'borrow') {
      this.setData({
        wallet: wx.getStorageSync('wallet') ? wx.getStorageSync('wallet') : 30,
        redpacket: wx.getStorageSync('redpacket') ? wx.getStorageSync('redpacket') : 0,
        userInfo: wx.getStorageSync('userInfo')
      })
      var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_onGoingBorrowingRecord.st"
      var data = {
        "memberId": this.data.userInfo.memberId
      }
      util.http(url, data, "GET", this.processBorrowData, false);
    } else if (pageType == 'return') {
      var borrowRecordId = options.borrowRecordId;
      var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_getTheUnreviewBook.st"
      var data = {
        borrowRecordId: borrowRecordId
      }
      util.http(url, data, "GET", this.processBorrowData, false)
    }

  },
  processBorrowData: function(data) {
    console.log(data);
    if (this.data.pageType == "borrow") {
      if (data.length > 0) {
        this.setData({
          borrowBook: data[0]
        });
      } else {
        this.setData({
          message: "哎呦，您还没有借阅图书呢"
        })
      }
      wx.setNavigationBarTitle({
        title: '正在借阅',
      })
    } else if (this.data.pageType == "return") {
      this.setData({
        borrowBook: data
      });
      wx.setNavigationBarTitle({
        title: '还书详情',
      })
    }
  },
  onRenewTap: function(event) {
    var borrowRecordId = event.currentTarget.dataset.borrowRecordId;
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_renewBook.st"
    var data = {
      "borrowRecordId": borrowRecordId
    }
    util.http(url, data, "GET", this.processReNewData, false);
  },
  processReNewData: function(data) {
    if (!!data) {
      wx.showToast({
        title: data.message,
      })
      this.setData({
        borrowBook: data
      })
    }
  },
  onReturnTap: function(event) {
    var borrowRecordId = this.data.borrowBook.id;
    var delayMoney = this.data.borrowBook.delayMoney;
    var overDay = this.data.borrowBook.overDay;
    this.setData({
      purpose: "图书逾期"
    })
    if (delayMoney <= 0) {
      this.goToReturn();
    } else {
      wx.showModal({
        title: '通知',
        content: '您的图书已于' + this.data.borrowBook.shouldReturnTime + '到期，因为没有及时归还图书，到目前为止逾期' + this.data.borrowBook.overDay + '天,需要缴费' + delayMoney + "元，否则无法归还图书",
        success: res => {
          if (res.confirm) {
            this.payment(delayMoney);
          }
        }
      })
    }
  },
  payment: function(total) {
    if (this.data.redpacket < parseInt(total) && this.data.wallet < parseInt(total)) {
      this.doUndifiedOrder(total);
    } else {
      if (this.data.redpacket >= parseInt(total)) {
        this.setData({
          payMethod: "红包",
          orderNum: ""
        })
      } else if (this.data.wallet >= parseInt(total)) {
        this.setData({
          payMethod: "钱包",
          orderNum: ""
        })
      }
      this.createConsume(total);
    }
  },
  doUndifiedOrder: util.throttle(function(delayMoney) {
    var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0020_goToUnifiedOrder.st"
    var data = {
      "type": "账户充值",
      "openid": this.data.userInfo.openid,
      "totalMoney": delayMoney
    }
    util.http(url, data, "POST", this.processUndifiedOrder, false);
  }),
  processUndifiedOrder: function(data) {
    if (data.message.indexOf('成功') > 0) {
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        'success': res => {
          this.setData({
            payMethod: "微信支付",
            orderNum: data.outTradeNo
          })
          this.createConsume(data.outTradeNo);
        },
        'fail': res => {
          var msg = "";
          if (res.errMsg.indexOf('cancel') > 0) {
            msg = "取消支付"
          } else {
            msg = res.errMsg.subString(15);
          }
          wx.showToast({
            title: msg,
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
  goToReturn: function() {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        var id = res.result;
        //扫描借书机二维码
        wx.navigateTo({
          url: '../machines/machine/machine?id=' + id + '&type=bookCase&caseType=return&borrowRecordId=' + this.data.borrowBook.id + '&delayMoney=' + this.data.borrowBook.delayMoney + '&overDay=' + this.data.borrowBook.overDay,
        })
      },
      fail: (res) => {}
    })
  },
  onProblemTap: function(event) {
    wx.navigateTo({
      url: '../problem/problem?problemType=book&borrowRecordId=' + this.data.borrowBook.id,
    })

  },
  onPurchaseTap: function(options) {
    wx.showModal({
      title: '通知',
      content: '确定要购买此图书吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            "purpose": "图书购买"
          });
          this.payment(this.data.borrowBook.price);
        }
      }
    })
  },
  createConsume: function(total) {
    console.log(this.data);
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_expensecost.st"
    var data = {
      "memberId": this.data.userInfo.memberid,
      "total": total,
      "purpose": this.data.purpose,
      "payMethod": this.data.payMethod,
      "orderNum": this.data.orderNum ? this.data.orderNum : util.randNum(32)
    }
    if (this.data.purpose == '图书购买') {
      data["borrowRecordId"] = this.data.borrowBook.id;
      data["bookListId"] = this.data.borrowBook.bookListId;
      data["bookId"] = this.data.borrowBook.bookId;
      data["discount"] = "";
    }
    this.setData({
      total: total
    })
    console.log(data);
    util.http(url, data, "POST", this.processCreateConsumeData, false);
  },
  processCreateConsumeData: function(data) {
    wx.showToast({
      title: data.message,
      success: res => {
        if (data.message.indexOf('成功') > 0) {
          if (this.data.purpose == '图书逾期') {
            wx.showModal({
              title: '通知',
              content: '是否继续还书操作',
              success: res => {
                if (res.confirm) {
                  this.goToReturn();
                }
              }
            })
          } else if (this.data.purpose == '图书购买') {
            this.setData({
              isBuy: '是'
            })
          }
          this.setData({
            payMethod: "",
            orderNum: "",
            purpose: "",
            total: ""
          })
        }
      }
    })
  },
  onBlurTap: function(event) {
    this.setData({
      note: event.detail.value
    })
  },
  onReviewBookTap: function(event) {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_reviewBook.st"
    var data = {
      "borrowRecordId": this.data.borrowBook.id,
      "note": this.data.note,
    }
    console.log(data);
    util.http(url, data, "POST", this.processReviewBook, false);
  },
  processReviewBook: function(data) {
    wx.showToast({
      title: data.message
    })
    this.setData({
      isReview:true
    })
  }
})