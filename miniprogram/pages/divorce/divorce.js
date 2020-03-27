// pages/index/divorce/divorce.js
Page({
  submit(e) {
    const money = e.detail.value.money - 0
    this.setData({
      fei1: (money * 0.05).toFixed(2),
      fei2: (money * 0.025).toFixed(2)
    })

  },
  property(e) {
    this.setData({
      property: e.detail.value
    })
  },
  reset(e) {
    this.setData({
      property: true,
      fei1: 300,
      fei2: 150
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    property: false,
    fei1: 300,
    fei2: 150,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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