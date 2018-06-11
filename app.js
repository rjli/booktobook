App({
  globalData: {
    zbtcBase: "https://abc.rchjxx.com",
    isBack: false
  },
  isUserLogin:function(){
    let  userInfo= wx.getStorageSync('userInfo');
    let flag = false;
    if (!userInfo) {
      flag = true;
    }
    return true;
  }
})