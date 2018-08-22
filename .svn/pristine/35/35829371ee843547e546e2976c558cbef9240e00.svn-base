// pages/booklists/booklist-share/booklist-share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    painting: {},
    shareImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  eventDraw() {
    console.log(wx.getStorageSync('userInfo'));
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    this.setData({
      painting: {
        width: 375,
        height: 555,
        clear: true,
        views: [{
            type: 'image',
            url: 'https://abc.rchjxx.com/DPlatform/files/800.jpg',
            top: 0,
            left: 0,
            width: 375,
            height: 555
          },
          // {
          //   type: 'image',
          //   url:wx.getStorageSync('userInfo').avatar,
          //   top: 27.5,
          //   left: 29,
          //   width: 55,
          //   height: 55
          // },
          // {
          //   type: 'image',
          //   url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531401349117.jpeg',
          //   top: 27.5,
          //   left: 29,
          //   width: 55,
          //   height: 55
          // },
          {
            type: 'text',
            content: '您的好友【Cheryl】',
            fontSize: 16,
            color: '#402D16',
            textAlign: 'left',
            top: 33,
            left: 100,
            bolder: true
          },
          {
            type: 'text',
            content: '给您分享了一本好书，快去瞅瞅吧',
            fontSize: 15,
            color: '#563D20',
            textAlign: 'left',
            top: 59.5,
            left: 100
          },
          {
            type: 'image',
            url: 'https://abc.rchjxx.com/DPlatform/files/btb/bookList/6ace680c26cf42eea9c8742a9d1e062a.jpg',
            top: 120,
            left: 46,
            width: 136,
            height: 186
          },
          {
            type: 'image',
            url: 'https://abc.rchjxx.com/DPlatform/files/miniprogram.jpg',
            top: 340,
            left: 85,
            width: 68,
            height: 68
          },
          {
            type: 'text',
            content: '《百年孤独》',
            fontSize: 16,
            lineHeight: 21,
            color: '#563D20',
            textAlign: 'left',
            top: 120,
            left: 200,
            width: 100,
            MaxLineNumber: 1,
            breakWord: true,
            bolder: true
          },
          {
            type: 'text',
            content: '我们终此一生，就是要摆脱他人的期待，找到真正的自己',
            fontSize: 16,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 160,
            left: 200,
            width: 100,
            MaxLineNumber: 4,
            breakWord: true
          },

          {
            type: 'text',
            content: '长按识别图中二维码查看书单详情~',
            fontSize: 14,
            color: '#383549',
            textAlign: 'left',
            top: 360,
            left: 165.5,
            lineHeight: 20,
            MaxLineNumber: 2,
            breakWord: true,
            width: 125
          }
        ]
      }
    })
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  }
})