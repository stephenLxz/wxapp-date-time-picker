// components/date-time-picker.js
const utils = require('../utils/util')
const yearTimestamp = 365 * 24 * 60 * 60 * 1000 // 一年

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: '_showChange'
    },
    // 开始时间，时间戳
    startTime: {
      type: Number,
      value: +new Date() - yearTimestamp  // 默认，一年前
    },
    // 结束时间，时间戳
    endTime: {
      type: Number,
      value: +new Date() + yearTimestamp  // 默认，一年后
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    disabled: false, // button disable态

    dateIndex: null,
    hourValue: '',
    minValue: '',
    dateArr: [],
    hourArr: [],
    minArr: [],

    activeTime: null // 抛出的时间戳
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showChange (e) {
      if (e) {
        this.getDateTimeData()
        this.initData()
      }
    },

    handleSubmit () {
      this.bindclose()
      this.triggerEvent('change', { value: this.data.activeTime })
    },

    /**
     * 处理日期时间初始值
     */
    initData () {
      if (!this.data.activeTime) {
        const now = +new Date()
        if (now >= this.data.startTime && now <= this.data.endTime) {
          const index = this.data.dateArr.map(v => v.name).indexOf(utils.formatTime(now, '{m}月{d}日周{a}'))
          let tmp = this.data.dateArr
          tmp[index].name = '今天'

          this.setData({
            dateIndex: index,
            hourValue: utils.formatTime(now, '{h}'),
            minValue: utils.formatTime(now, '{i}'),
            dateArr: tmp,
            activeTime: now
          })
        }
      }
    },

    /**
     * 获取日期时间数据，思路：获取固定的小时、分钟数组，将开始时间、结束时间进行年月天对比，取其差值，从而形成对应日期数组
     */
    getDateTimeData () {
      const mins = []
      const hours = []
      let dates = []

      // 获取小时、分钟数组
      for (let i = 0; i < 60; i++) {
        mins.push(i.toString().length < 2 ? '0' + i : i.toString())
      }
      for (let j = 0; j < 24; j++) {
        hours.push(j.toString().length < 2 ? '0' + j : j.toString())
      }

      // 开始时间需小于结束时间
      if (this.data.startTime >= this.data.endTime) {
        console.log('error_params_not_valid')
        return
      }

      // 获取日期数组
      dates = this.getDateData()

      this.setData({
        hourArr: hours,
        minArr: mins,
        dateArr: dates
      })
    },

    getDateData () {
      const startDate = new Date(this.data.startTime)
      const endDate = new Date(this.data.endTime)
      const nowYear = new Date().getFullYear()
      const startYear = startDate.getFullYear()
      const endYear = endDate.getFullYear()
      const startMonth = startDate.getMonth()
      const endMonth = endDate.getMonth()
      const startDay = startDate.getDate()
      const endDay = endDate.getDate()

      const dateArr = []

      // 处理逻辑：判断年限是否相同；若同年则判断是否同月，同月则直接添加日期；不同月则从开始时间月份处理，同时处理月日边界问题；以此类推...
      let time = 0
      // 同年
      if (startYear === endYear) {
        // 同月
        if (startMonth === endMonth) {
          for (let day = startDay; day <= endDay; day++) {
            time = new Date(startYear, startMonth, day)
            dateArr.push({ name: startYear === nowYear ? utils.formatTime(time, '{m}月{d}日周{a}') : utils.formatTime(time, '{y}-{m}-{d}'), value: time })
          }
        } else {
          // 不同月
          let tmpDay = startDay
          let lastMonth = endMonth
          for (let month = startMonth; month <= lastMonth; month++) {
            // 默认获取的月份方法得到月份值是0-11，该方法获取天数的月份值是1-12
            const days = month === lastMonth ? endDay : new Date(startYear, month + 1, 0).getDate()

            for (let day = tmpDay; day <= days; day++) {
              time = new Date(startYear, month, day)
              dateArr.push({ name: startYear === nowYear ? utils.formatTime(time, '{m}月{d}日周{a}') : utils.formatTime(time, '{y}-{m}-{d}'), value: time })

              // 处理边界（日）
              day === days && (tmpDay = 1)
            }
          }
        }
      } else {
        // 不同年
        let tmpDay = startDay
        let tmpMonth = startMonth
        let lastMonth = 11

        for (let year = startYear; year <= endYear; year++) {
          for (let month = tmpMonth; month <= lastMonth; month++) {
            // 默认获取的月份方法得到月份值是0-11，该方法获取天数的月份值是1-12
            const days = (month === lastMonth && year === endYear) ? endDay : new Date(startYear, month + 1, 0).getDate()

            for (let day = tmpDay; day <= days; day++) {
              time = +new Date(year, month, day)
              dateArr.push({ name: year === nowYear ? utils.formatTime(time, '{m}月{d}日周{a}') : utils.formatTime(time, '{y}-{m}-{d}'), value: time })

              // 处理边界（日）
              day === days && (tmpDay = 1)
            }

            // 处理边界（月）
            month === lastMonth && (tmpMonth = 0)
            month === lastMonth && year === endYear - 1 && (lastMonth = endMonth)
          }
        }
      }

      return dateArr
    },

    dateChange (e) {
      const day = this.data.dateArr[e.detail.value[0]]
      let time = day.value + (Number(this.data.hourValue) * 3600 + Number(this.data.minValue) * 60) * 1000
      this.setData({
        dateIndex: e.detail.value[0],
        activeTime: time
      })
    },

    hourChange (e) {
      const hour = Number(this.data.hourArr[e.detail.value[0]])
      let time = this.data.dateArr[this.data.dateIndex].value + (hour * 3600 + Number(this.data.minValue) * 60) * 1000
      this.setData({
        hourValue: this.data.hourArr[e.detail.value[0]],
        activeTime: time
      })
    },

    minChange (e) {
      const min = Number(this.data.minArr[e.detail.value[0]])
      let time = this.data.dateArr[this.data.dateIndex].value + (Number(this.data.hourValue) * 3600 + min * 60) * 1000
      this.setData({
        minValue: this.data.minArr[e.detail.value[0]],
        activeTime: time
      })
    },

    bindclose () {
      this.setData({
        show: false
      })
    },

    bindpickstart () {
      this.setData({
        disabled: true
      })
    },

    bindpickend () {
      this.setData({
        disabled: false
      })
    },

    preventTouchMove () {
      // 阻止半屏状态下 页面滑动
    }

  }
})
