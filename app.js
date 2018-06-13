App({
  globalData: {
    zbtcBase: "https://abc.rchjxx.com",
    isBack: false
  },
  isUserLogin: function () {
    let result = true;
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.navigateTo({
        url: '../login/login'
      })
      result = false;
    }
    return result;
  }
})