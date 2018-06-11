var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      machineId: options.machineId,
      bookcaseId: options.bookcaseId
    });
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_getBookKind.st"
    util.http(url, {}, "GET", this.processCategoryData, false);
  },
  processCategoryData: function (data) {
    this.setData({
      bookCategorys: data
    })
  },
  radioChange: function (event) {
    var machineId = this.data.machineId;
    var bookcaseId = this.data.bookcaseId;
    var items = this.data.bookCategorys;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].bookkindId == event.detail.value
    }
    var bookkindId = event.detail.value;
    this.setData({
      bookCategorys: items
    });
    wx.navigateTo({
      url: '../shalve?machineId=' + machineId + '&bookcaseId=' + bookcaseId + '&bookkindId=' + bookkindId,
    })
  }
})