var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
      borrowRecords:[],
      message:""
  },

  onLoad: function (options) {
   
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_historyBorrowingRecord.st"
    var data = {
      "memberId": wx.getUserInfo.memberid
    }
    util.http(url, data, "GET", this.processHisToryBorrowRecord, false);
  },
  processHisToryBorrowRecord:function(data){
    if(data.length>0){
      this.setData({
        borrowRecords: data
      })
    }else{
      this.setData({
        message:"亲，您还没有借阅过图书哦"
      })
    }
    
  }


})