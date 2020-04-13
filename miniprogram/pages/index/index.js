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
  },

  record() {
    if (!this.data.running) {
      return
    }
    this.setData({
      second: this.data.second + 1
    })
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log(this.data.latitude);
        const newMarker = {
          // 在控制台里一个一个调太慢了，不如直接 + 随机数
          latitude: this.data.latitude + ((Math.random() * (100 - 1) + 1 | 0) / 10000),
          longitude: this.data.longitude + ((Math.random() * (100 - 1) + 1 | 0) / 10000),
          // latitude: res.latitude,
          // longitude: res.longitude,
          iconPath: '/images/redPoint.png'
        }
        let pace = 0
        const tmarkers = this.data.markers
        if (this.data.markers.length > 0) {
          const lastmarker = this.data.markers[this.data.markers.length - 1]
          pace = utils.getDistance(lastmarker.latitude, lastmarker.longitude, newMarker.latitude, newMarker.longitude)
          console.log(pace);
          if (pace < 15) {
            pace = 0
          } else {
            tmarkers.push(newMarker)
          }
        } else {
          tmarkers.push(newMarker)
        }
        this.setData({
          // 22.71991
          latitude: res.latitude,
          // 114.24779
          longitude: res.longitude,
          markers: tmarkers,
          meters: this.data.meters + pace,
        })
      }
    })
  },

  run() {
    this.setData({ running: !this.data.running })
  },

  clear() {
    this.setData({ markers: [], meters: 0, second: 0, running: false })
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
    setInterval(this.record, 1000)
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