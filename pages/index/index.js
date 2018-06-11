var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    containerShow: true,
    searchPanelShow: false,
    hideShopPopup: true,
    iconBottom: 100,
    iconSize: 50,
    machines: [],
    markers: [],
    message: "请输入附近的店名搜索，比如娇书坊"
  },
  // 页面加载
  onLoad: function (options) {
    this.initMap();
  },
  // 页面显示
  onShow: function () {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
    })
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("bookMap");
    this.movetoPosition();
  },
  //初始化地图页面信息
  initMap: function () {
    // 1.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        // 3.请求服务器，显示附近借书机，用marker标记
        var data = {
          "latitude": res.latitude,
          "longitude": res.longitude
        }
        this.findMachines(data, this.processMachinesData);
      }
    });

    // 2.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/icon/location.png',
            position: {
              left: 10,
              top: res.windowHeight - this.data.iconBottom,
              width: this.data.iconSize,
              height: this.data.iconSize
            },
            clickable: true
          }, {
            id: 2,
            iconPath: '/images/icon/borrow.png',
            position: {
              left: 80,
              top: res.windowHeight - this.data.iconBottom + 5,
              width: 100,
              height: 40
            },
            clickable: true
          }, {
            id: 3,
            iconPath: '/images/icon/return.png',
            position: {
              left: res.windowWidth / 2 + 10,
              top: res.windowHeight - this.data.iconBottom + 5,
              width: 100,
              height: 40
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/icon/warn.png',
            position: {
              left: res.windowWidth - 60,
              top: res.windowHeight - this.data.iconBottom,
              width: this.data.iconSize,
              height: this.data.iconSize
            },
            clickable: true
          },
          {
            id: 5,
            iconPath: '/images/icon/marker.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 22,
              height: 40
            },
            clickable: true
          },
          {
            id: 6,
            iconPath: '/images/icon/avatar.png',
            position: {
              left: res.windowWidth - 60,
              top: res.windowHeight - this.data.iconBottom - 60,
              width: this.data.iconSize,
              height: this.data.iconSize
            },
            clickable: true
          }
          ]
        })
      }
    });
  },
  processMachinesData: function (data) {
    var machines = []
    data.forEach(function (item, index) {
      machines.push({
        // width: 30,
        // height: 40,
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        location: item.location,
        machineName: item.name,
        image: item.image,
        borrow: item.borrow,
        businessHour: item.businessHour,
        return: item.return
      })
    });
    this.setData({
      markers: machines
    })

  },

  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即借书，判断当前是否有在借书籍
      case 2:
        this.borrowBook();
        break;
      // 点击保障控件，跳转到报障页
      case 3:
        this.returnBook();
        break;
      case 4:
        // 跳转到问题上报页面
        wx.navigateTo({
          url: '../problem/problem?problemType=base',
        })
      
        break;
      // 点击头像控件，跳转到个人中心
      case 6: wx.navigateTo({
        url: '../mine/mine'
      });
        break;
      default: break;
    }
  },
  // 地图视野改变事件
  bindregionchange: function (e) {
    // 拖动地图，获取附件单车位置
    if (e.type == "end") {
      this.mapCtx.getCenterLocation({
        type: "gcj02",
        success: (res) => {
          this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
          // 3.请求服务器，显示附近借书机，用marker标记
          var data = {
            "latitude": res.latitude,
            "longitude": res.longitude
          }
          this.findMachines(data, this.processMachinesData);
        }
      });
    }
  },
  // 地图标记点击事件，连接用户位置和点击借书机的位置
  markerTap: function (e) {
    //查询marker的详细信息
    var marker = this.getMarkerById(e.markerId);
    var machine = marker;
    this.setData({
      machine: machine,
      hideShopPopup: false
    })

  },
  //根据marker的id获取详情信息
  getMarkerById: function (id) {
    console.log("/根据marker的id获取详情信息");
    var that = this;
    var markers = that.data.markers;
    var len = markers.length;
    var result;
    for (var i = 0; i < len; i++) {
      if (markers[i]["id"] === id) {
        result = markers[i];
        result.name = markers[i].machineName;
        break;
      }
    }
    return result;
  },
  /**
  * marker选择弹出框隐藏 
  */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  // 根据条件获取借书机
  findMachines: function (data, callBack) {
    var url = app.globalData.zbtcBase + "/DPlatform/btb/mach/fmach0030_findMachines.st"
    util.http(url, data, "GET", callBack, true);
  },
  /**
   * 搜索控件获取焦点事件
   * 显示serach-pannel
   */
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },
  borrowBook: function () {
    if (!app.isUserLogin) {
      wx.navigateTo({
        url: 'member/member',
      })
    }
    var url = app.globalData.zbtcBase + "/DPlatform/btb/bro/fbro0020_onGoingBorrowingRecord.st"
    var data = {
      "memberId": wx.getUserInfo.memberid
    }
    util.http(url, data, "GET", this.processBorrowData, false);
  },
  processBorrowData: function (data) {
    console.log(data);
    if (data.length <= 0) {
      wx.scanCode({
        scanType: "qrCode",
        success: (res) => {
          // 正在获取借书机信息
          wx.showLoading({
            title: '正在获取借书机信息',
            mask: true
          })
          var id = res.result;
          wx.hideLoading();
          // 请求服务器获取借书机的信息
          wx.redirectTo({
            url: '../machines/machine/machine?id=' + id + '&type=bookList&btnType=borrow',
          })
        }, fail: (res) => {
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '亲，一次只能借阅一本图书呦',
      })
    }
  },
  returnBook: function () {
    wx.navigateTo({
      url: '../borrow/borrow',
    })
  },

  /**
   *搜索借书机
   */
  onBindConfirm: function (event) {
    var name = event.detail.value;
    var data = {
      "name": name
    }
    this.findMachines(data, this.showSearchResult);

  },
  showSearchResult: function (data) {
    if (data.length > 0) {
      this.setData({
        machines: data,
      });
    } else {
      this.setData({
        message: '附近还没有借书机哦'
      })
    }
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    });
  },
  /**
   * 跳转到借书机页面
   */
  onMachineTap: function (event) {
    let machineId = event.currentTarget.dataset.machineId;
    wx.navigateTo({
      url: '../machines/machine/machine?id=' + machineId + '&type=bookList&btnType=simple',
    })

  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  }
})