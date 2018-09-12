var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {},
  onLoad: function() {
    this.getProbelms()
  },
  // 展开折叠选择 
  changeToggle: function(e) {
    var index = e.currentTarget.dataset.index;
    for (var idx in this.data.list) {
      if (index == idx) {
        if (!this.data.list[index].selectedFlag) {
          this.data.list[index].selectedFlag = true;
        } else {
          this.data.list[index].selectedFlag = false;
        }
      } else {
        this.data.list[idx].selectedFlag = false;
      }
    }
    this.setData({
      list: this.data.list
    })
  },
  /**
   * 获取常见问题的集合
   */
  getProbelms: function() {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/pro/fpro0020_getProblemsByType.st"
    util.http(url, {}, "GET", this.processProblems, false);
  },
  processProblems: function(data) {
    this.setData({
      list: data
    })
  }
})