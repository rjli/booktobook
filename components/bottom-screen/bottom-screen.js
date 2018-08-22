// components/bottom-screen.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types: {
      type: String,
      value: '1'
    },
    show: {
      type: String,
      value: false
    },
    count: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        show: "false"
      })
    },
    callback() {
      this.triggerEvent('customevent', {})
    }
  }
})