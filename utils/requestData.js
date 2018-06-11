const app = getApp();
const util = require('util.js');
const userInfo = wx.getStorageSync('userInfo');

// 判断用户是否登陆
function isUserLogin() {
  let flag = false;
  if (!userInfo) {
    flag = true;
  }
  return true;
}


//获取书单评论
function findComments(bookListId, start, count, callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_findBookCommentById.st"
  var data = {
    "bookListId": bookListId,
    "start": start,
    "count": count
  }
  util.http(url, data, "GET", callback, false);
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
  util.http(url, data, "POST", callback, false);
}
//  图书借阅
function createTheBorrowingRecord(machineId, bookCaseId, bookListId, bookId, callback) {
  var data = {
    machineId: machineId,
    bookcaseId: bookCaseId,
    bookListId: bookListId,
    bookId: bookId,
    memberId: userInfo.memberid
  }
  var url = app.globalData.zbtcBase + "/DPlatform//btb/bro/fbro0020_createTheBorrowingRecord.st";
  util.http(url, data, "POST", callback, false);
}
// 正在借阅
function onGoingBorrowingRecord(callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_onGoingBorrowingRecord.st"
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
function createProblem(problemType, machineId, bookcaseId, borrowRecordId, content, remark, callBack) {
  let url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_createTheProblem.st"
  let data = {
    "userId": userInfo.userid,
    "type": problemType,
    "content": content,
    "machineId": machineId,
    "remark": remark,
    "bookcaseId": bookcaseId,
    "borrowRecordId": borrowRecordId
  }
  util.http(url, data, "POST", callBack, false);
}


module.exports = {
  isUserLogin: isUserLogin,
  createProblem: createProblem,
  createTheBorrowingRecord: createTheBorrowingRecord,
  onGoingBorrowingRecord: onGoingBorrowingRecord,
  findComments: findComments,
  createComment: createComment
}
