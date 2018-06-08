const app = getApp();
const util = require('util.js');
const userInfo = wx.getStorageSync('userInfo');
// 用户登录
function userLogin() {

}
// 判断用户是否登陆
function isUserLogin() {
  let flag = false;
  if (!userInfo) {
    flag = true;
  }
  return true;
}

// 会员注册

// 账户充值

// 根据条件获取借书机
function findMachines(data, callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_findMachines.st"
  util.http(url, data, "GET", callBack, true);
}
// 获取借书机详情

// 获取书单集合

// 获取书单详情

//获取书单评论
function findComments(bookListId, start, count, callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_findBookCommentById.st"
  var data = {
    "bookListId": bookListId,
    "start": start,
    "count": count
  }
  util.http(url, data, "GET", callback);
}
// 创建评论
function createComment(booklistId, commentType, rate, comment, callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_createTheBookComment.st"
  var data = {
    "bookListId": booklistId,
    "userId": userInfo.userid,
    "type": commentType,
    "score": rate,
    "content": comment
  }
  util.http(url, data, "POST", callback);
}
//  图书借阅

// 正在借阅
function onGoingBorrowingRecord(callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_onGoingBorrowingRecord.st"
  console.log("memberId:" + userInfo.memberId);
  var data = {
    "memberId": userInfo.memberId
  }
  util.http(url, data, "GET", callback, false);
}
// 图书续借

function onRewBook(borrowRecordId, callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_renewBook.st"
  var data = {
    "borrowRecordId": borrowRecordId
  }
  util.http(url, data, "GET", callback, false);
}
// 图书归还

// 创建问题

function createProblem(data, callBack) {
  let url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_createTheProblem.st"
  // let data = {
  //   "rkspAutoComplete": true,
  //   "userId": wx.getStorageSync('userInfo').userid,
  //   "type": "故障保修",
  //   "content": this.data.content,
  //   "machineId": "machineId"
  // }

}


module.exports = {
  isUserLogin: isUserLogin,
  findMachines: findMachines,
  createProblem: createProblem,
  onGoingBorrowingRecord: onGoingBorrowingRecord,
  findComments: findComments,
  createComment: createComment
}
