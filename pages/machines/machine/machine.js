var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {

  },
  onLoad: function (options) {
    var optiontype = options.type;
    var btnType = options.btnType;
    if ("all" == optiontype || "bookCase" == optiontype) {
      var caseType = options.caseType;
      this.setData({
        caseType: caseType
      })
    }
    if ("return" == caseType) {
      var borrowRecordId = options.borrowRecordId;
      var delayMoney = options.delayMoney;
      var overDay = options.overDay;
      this.setData({
        borrowRecordId: borrowRecordId,
        delayMoney: delayMoney,
        overDay: overDay
      });
    }

    this.setData({
      machineId: options.id,
      optiontype: optiontype,
      btnType: btnType
    })
    this.getMachineDetil();
  },
  getMachineDetil: function () {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_findMachineDetailById.st"
    var data = {
      "rkspAutoComplete": true,
      "machineId": this.data.machineId,
      "type": this.data.optiontype
    }
    util.http(url, data, "GET", this.processMachineData);
  },
  processMachineData: function (data) {
    var optiontype = this.data.optiontype;
    this.setData({
      machine: data
    })
    if ("all" == optiontype || "bookCase" == optiontype) {
      this.setData({
        bookCases: data.bookCases
      })
    }
    wx.setNavigationBarTitle({
      title: data.name
    })
  },
  onShow: function (options) {
    if (app.globalData.isBack) {
      this.getMachineDetil();
      app.globalData.isBack = false;
    }
  },
  /**
   * 跳转的内置地图的位置信息页面
   */
  onOpenLocationTap: function (event) {
    var longitude = event.currentTarget.dataset.longitude;
    var latitude = event.currentTarget.dataset.latitude;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude
    });
  },
  /**
   * 点击跳转到书单详情页面
   */
  onBookTap: function (event) {
    var bookListId = event.currentTarget.dataset.booklistId;
    var machineId = this.data.machine.id;
    var bookCaseId = event.currentTarget.dataset.bookCaseId;
    var bookId = event.currentTarget.dataset.bookId;
    var bookCaseNumber = event.currentTarget.dataset.bookCaseNumber;
    wx.navigateTo({
      url: '../../booklists/booklist-detail/booklist-detail?machineId=' + machineId + "&bookListId=" + bookListId + "&bookCaseId=" + bookCaseId + "&bookId=" + bookId + "&bookCaseNumber=" + bookCaseNumber + "&btnType=" + this.data.btnType,
    })
  },
  radioChange: function (event) {
    var items = this.data.bookCases;

    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].bookcaseid == event.detail.value
      if (items[i].checked && items[i].note) {
        return;
      }
    }
    this.setData({
      bookCases: items
    });
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要选择这个借书单元吗',
      success: function (res) {
        if (res.confirm) {
          var machineId = that.data.machineId;
          var caseType = that.data.caseType;
          var bookcaseId = event.detail.value;
          if ("shalve" == caseType) {
            wx.navigateTo({
              url: '../../shalve/bookcategory/bookcategory?machineId=' + machineId + '&bookcaseId=' + bookcaseId,
            })
          } else if ("return" == caseType) {
            var borrowRecordId = that.data.borrowRecordId;
            var delayMoney = that.data.delayMoney;
            var overDay = that.data.overDay;
            var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_updateBorrowingRecord.st"
            var data = {
              "rkspAutoComplete": true,
              "machineId": machineId,
              "bookcaseId": bookcaseId,
              "borrowRecordId": borrowRecordId,
              "delaycost": delayMoney,
              "delayday": overDay
            }
            util.http(url, data, "GET", that.processReturnBookData);
          }
        }
      }
    })
  },
  processReturnBookData: function (data) {
    wx.showToast({
      title: data.message,
    })
    if (data.message.indexOf("成功") > 0) {
      this.onShow();
    }
  }
})