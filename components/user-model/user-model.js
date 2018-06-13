// components/user-model.js
Component({
  properties: {
    showModalStatus: {
      type: String,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    isShowClose: {
      type: String,
      value: true
    },
    btnName: {
      type: String,
      value: ''
    },
    maskTapClose: {
      type: String,
      value: false
    }
  },
  data: {

  },
  methods: {
    powerDrawer: function (event) {
      var currentStatus = event.currentTarget.dataset.status;
      var clickType = event.currentTarget.dataset.type;
      console.log("currentStatus:" + currentStatus);
      var flag = true;
      if (clickType == 'mask') {
        var maskTapClose = event.currentTarget.dataset.maskTapClose;
        if (maskTapClose == 'false') {
          flag = false
        }
      }
      if (flag) {
        this.controlPower(currentStatus)
      }
    },
    controlPower: function (currentStatus) {
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200, //动画时长 
        timingFunction: "linear", //线性 
        delay: 0 //0则不延迟 
      });
      // 第2步：这个动画实例赋给当前的动画实例 
      this.animation = animation;
      // 第3步：执行第一组动画 
      animation.opacity(0).rotateX(-100).step();

      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        animationData: animation.export()
      })
      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        // 执行第二组动画 
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
          animationData: animation
        })
        //关闭 
        if (currentStatus == "close") {
          this.setData(
            {
              showModalStatus: false
            }
          );
        }
      }.bind(this), 200)
      // 显示 
      if (currentStatus == "open") {
        this.setData(
          {
            showModalStatus: true
          }
        );
      }
    },
    onBtnTap:function(){
      console.log("hh")
    }
  }
})
