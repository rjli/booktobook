const app = getApp();
const util = require('util.js');
const userInfo = wx.getStorageSync('userInfo');
// 用户登录
function userLogin(code, callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/wct/bas/fbas0010_createUserFromMiniProgram.st";
  var data = {
    "code": code,
    "userInfo": JSON.stringify(userInfo)
  }
  util.http(url, data, "POST", callback, false);
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
function registerMember(callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_registerMember.st"
  var data = {
    "userid": userInfo.userid
  }
  util.http(url, data, "POST", callBack, false);
}
// 账户信息

function getAccountInfo(callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_getMyWallet.st";
  var data = {
    "memberId": userInfo.memberid
  }
  util.http(url, data, "GET", callBack, false);
}
// 账户充值
function registerAccount(total, callback) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mbr/fmbr0050_registerAccount.st";
  var data = {
    "userid": userInfo.userid,
    "memberid": userInfo.memberid,
    "total": total
  }
  util.http(url, data, "POST", callback, false);
}

// 根据条件获取借书机
function findMachines(data, callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_findMachines.st"
  util.http(url, data, "GET", callBack, true);
}
// 获取借书机详情

// 获取图书分类
function getBookCategoryList(callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_getBookKind.st"
  util.http(url, {}, "GET", callBack, false);
}

// 获取书单集合
function getBookListByCategoryId(bookkindId, start, count, callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_getBookListsBykindId.st"
  var data = {
    "bookkindId": bookkindId,
    "start": start,
    "count": count
  }
  util.http(url, data, "GET", callBack, false);
}
// 图书上架
function shalveBook(machineId, bookcaseId, booklistId, callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_shelfBook.st"
  var data = {
    "machineId": machineId,
    "bookcaseId": bookcaseId,
    "bookListId": booklistId,
    "userId": userInfo.userid
  }
  util.http(url, data, "POST", callBack, false);
}
// 获取书单详情
function getBookListDetailById(bookListId, callBack) {
  var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_findBookDetailById.st"
  var data = {
    "bookListId": bookListId,
  }
  util.http(url, data, "GET", callBack, false);
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
  userLogin: userLogin,
  isUserLogin: isUserLogin,
  registerMember: registerMember,
  getAccountInfo: getAccountInfo,
  registerAccount: registerAccount,
  findMachines: findMachines,
  getBookCategoryList: getBookCategoryList,
  getBookListByCategoryId: getBookListByCategoryId,
  getBookListDetailById: getBookListDetailById,
  shalveBook: shalveBook,
  createProblem: createProblem,
  createTheBorrowingRecord: createTheBorrowingRecord,
  onGoingBorrowingRecord: onGoingBorrowingRecord,
  findComments: findComments,
  createComment: createComment
}
