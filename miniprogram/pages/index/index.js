import utils from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    running: false,
    latitude: 0,
    longitude: 0,
    markers: [],
    meters: 0.00,
    second: 0,
    polyline: [{
      points: [],
      color: "#FF0000DD",
      width: 2,
    },],
    index: -1
  },

  record() {
    const { running, markers, marked, intNum, second } = this.data
    if (!running) {
      if (!marked) {
        // 停止记录时设置最后一个的图标
        if (markers.length > 0) {
          markers[markers.length - 1].iconPath = '/images/zhongdian.png'
          // 同时停止定时器
          clearInterval(intNum)
          this.setData({ markers, marked: true })
        }
      }
      return
    }
    this.setData({
      second: second + 1
    })
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        // 在控制台里一个一个调太慢了，不如直接 + 随机数
        // 如果没传值，就用随机的
        var { latitude, longitude, index, remarks = [] } = this.data
        // index 默认是 -1 此时经纬度是获取来的
        if (index === -1) {
          latitude += ((Math.random() * (100 + 10) - 10 | 0) / 100000)
          longitude += ((Math.random() * (100 + 10) - 10 | 0) / 100000)
        } else {
          // 开启回放时是 1 
          console.log(index);
          // 自增到 length 时设置起终点， running = false 停止回放点
          if (index === remarks.length) {
            this.data.running = false
            if (markers.length > 0) {
              markers[0].iconPath = '/images/qidian.png'
              markers[markers.length - 1].iconPath = '/images/zhongdian.png'
              clearInterval(intNum)
              this.setData({ markers, marked: true })
            }
            return
          }
          // 回放时从记录的标记点数组中取点
          const remark = remarks[index]
          var { latitude, longitude } = remark
          this.data.index += 1
        }
        const newMarker = {
          latitude, longitude,
          // latitude: res.latitude,
          // longitude: res.longitude,
          // 默认图标是一个 1 像素的透明 png 图
          iconPath: '/images/none.png',
          width: 75,
          height: 75
        }
        let pace = 0
        const tmarkers = this.data.markers
        if (this.data.markers.length > 0) {
          const lastmarker = this.data.markers[this.data.markers.length - 1]
          pace = utils.getDistance(lastmarker.latitude, lastmarker.longitude, newMarker.latitude, newMarker.longitude)
          if (pace < 15) {
            pace = 0
          } else {
            tmarkers.push(newMarker)
          }
        } else {
          tmarkers.push(newMarker)
        }
        console.log(tmarkers);
        // 开始时设置起点图标
        if (tmarkers.length === 1) {
          tmarkers[0].iconPath = '/images/qidian.png'
        }
        this.setData({
          latitude,
          longitude,
          markers: tmarkers,
          // setData 的时候也将 tmarkers 设置给 polyline[0].points 即可显示标记点的连线
          'polyline[0].points': tmarkers,
          meters: this.data.meters + pace,
        })
      }
    })
  },

  saveRun() {
    // 保存标记点
    this.setData({ remarks: this.data.markers, })
    // 暂停定时器
    clearInterval(this.data.intNum)
    // 清除数据
    this.clear()
  },

  reRun() {
    // 启动更快的定时器
    this.setData({ running: !this.data.running, index: 0, })
    this.data.intNum = setInterval(this.record, 34)
  },


  run() {
    this.setData({ running: !this.data.running })
  },

  clear() {
    this.setData({
      markers: [],
      meters: 0,
      second: 0,
      running: false,
      index: -1,
      'polyline[0].points': []
    })
    clearInterval(this.data.intNum)
  },

  curLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log('latitude', res.latitude);
        console.log('longitude', res.longitude);
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.curLocation()
    this.data.intNum = setInterval(this.record, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})