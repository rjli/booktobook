Component({
  properties: {
    rate: {
      type: String,
      value: ''
    },
    disabled: {
      type: String,
      value: false
    },
    small: {
      type: String,
      value: false
    },
    showScore:{
      type:String,
      value:false
    }
  },
  data: {
    starArr: []
  },

  attached: function () {
    this.getStarArr()
  },
  moved: function () {
  },
  detached: function () {
  },
  methods: {
    getStarArr: function () {
      let stars = this.data.rate * 10;
      //使用类型化的数组，Int8Array，默认的初始化元素都为0
      let starArr = new Int8Array(5);
      let num1 = Math.floor(stars / 10);
      let num2 = Math.floor(stars % 10);
      for (let i = 0; i < 5; i++) {
        if (i < num1) {
          starArr[i] = 1;// 1表示整颗星
          if (num2 != 0) {//用来显示半颗星
            starArr[i + 1] = 2;
          }
        }
      }
      this.setData({
        starArr: starArr
      })
    },
    handleTap: function (e) {
      if (this.data.disabled) {
        return;
      }
      this.setData({
        rate: Number(e.currentTarget.dataset.index) + 1
      })
      this.triggerEvent('change', { value: Number(e.currentTarget.dataset.index) + 1 });
      this.getStarArr()
    }
  }
})
