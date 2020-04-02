// pages/index/index.js
var city
Page({
  /**
   * 获取城市天气数据
   * @param {String} city 城市名称
   */
  getWeather(city) {
    // 网络请求加上个加载提示友好一点
    wx.showLoading({ title: '加载中' })
    // 使用云函数代发请求，传入城市参数
    wx.cloud.callFunction({
      name: 'weather',
      data: {
        city
      }
    }).then(res => {
      console.log(res);
      // 解构返回的数据
      const { city, data } = res.result
      // 只需要展示近三天，使用 slice 方法返回前 3 个
      this.setData({ city, data: data.slice(0, 3) })
      // 请求完成，隐藏加载提示
      wx.hideLoading()
    })
  },
  // 搜索框处理函数
  search(event) {
    this.getWeather(event.detail)
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeather()
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