// index.js
// 获取应用实例
const util = require('../../utils/util')

Page({
  data: {
    show: false
  },

  onLoad () {

  },

  showPicker () {
    this.setData({
      show: true
    })
  },

  handleChange (e) {
    // 选择器所抛出的结果
    const timestamp = e.detail.value
    console.log(timestamp)
    console.log(util.formatTime(timestamp, '{y}-{m}-{d} {h}:{i}'))
    
    if (this.data.show) {
      this.setData({
        show: false
      })
    }
  }
})
