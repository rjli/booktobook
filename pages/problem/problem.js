var app = getApp();
var requestData = require("../../utils/requestData.js");
Page({
  data: {
    picUrls: [],// 故障图路径数组
    actionText: "拍照/相册",// 选取图片提示
    content: "",
    remark: "",
    problemId: "",
    itemsValue: [
      {
        checked: false,
        value: "二维码不对"
      },
      {
        checked: false,
        value: "借书机信息有误"
      },
      {
        checked: false,
        value: "借书机柜门无法打开"
      },
      {
        checked: false,
        value: "其他故障"
      }
    ],
    disabled: true,
    bookcaseId: ""
  },
  onLoad: function (options) {
    let machineId = options.machineId;
    this.setData({
      machineId: machineId
    })
  },
  radioboxChange: function (event) {
    let value = event.detail.value;
    var tempItemsValue = this.data.itemsValue;
    for (let item of tempItemsValue) {
      if (item.value == value) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    }
    this.setData({
      itemsValue: tempItemsValue,
      remark: value,
      disabled: false
    })
  },
  numberChange: function (event) {
    this.setData({
      bookcaseId: event.detail.value
    })
  },
  //拍照或选择相册
  bindCamera: function () {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tfps = res.tempFilePaths;
        this.setData({
          picUrls: tfps,
          actionText: "+"
        });

      }
    })
  },
  // 删除选择的故障车周围环境图
  delPic: function (e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    })
  },
  onProblemBlur: function (event) {
    this.setData({
      content: event.detail.value
    })
  },
  //问题上报
  onProblemTap: function (event) {
    requestData.createProblem("故障保修", this.data.machineId, this.data.bookcaseId, "", this.data.content, this.data.remark, this.processProblemData);
  },
  processProblemData: function (data) {
    let length = this.data.picUrls.length; //总共个数
    let problemId = data.id;
    this.setData({
      problemId: problemId
    })
    if (length > 0) {
      wx.showLoading({
        title: '加载中',
      })
      let successUp = 0; //成功个数
      let failUp = 0; //失败个数
      let i = 0; //第几个
      this.uploadFiles(this.data.picUrls, successUp, failUp, i, length);
    } else {
      wx.navigateBack({
        delta: 1,
        success: (res) => {
          wx.showToast({
            title: data.message,
            duration: 2000
          })
        }
      }
      );
    }

  },
  // 多文件上传函数
  uploadFiles(filePaths, successUp, failUp, i, length) {
    wx.uploadFile({
      url: app.globalData.zbtcBase + "/DPlatform/btb/bkl/fbkl0040_uploadfile.st?rkspAutoComplete=true",
      filePath: filePaths[i],
      name: 'file',
      formData: {
        'problemId': this.data.problemId,
        'userId': wx.getStorageSync('userInfo').userid
      },
      success: (resp) => {
        successUp++;
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          this.setData({
            resultMessage: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！'
          })
          wx.showToast({
            title: '操作成功',
          })
          wx.hideLoading();
        }
        else {  //递归调用uploadFiles函数
          this.uploadFiles(filePaths, successUp, failUp, i, length);
        }
      },
    });
  }

})