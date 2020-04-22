// pages/index/index.js

const db = wx.cloud.database()
const votelog = db.collection('votelog')
const votes = db.collection('votes')
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    voted: false
  },


  async tap(e) {
    if (this.data.voted) {
      wx.showToast({ title: '您已投票', icon: "none" })
      return
    }
    // 防止多次点击
    this.data.voted = true
    wx.showLoading({ title: '投票中', })
    try {
      const { voteid, index } = e.target.dataset
      await votelog.add({
        data: {
          voteid,
          date: new Date().valueOf()
        }
      })
      const updated = await votes
        .doc(voteid)
        .update({ data: { count: _.inc(1) } })
        .then(res => { return res.stats.updated })
      if (updated === 1) {
        this.data.voted = true
        wx.hideLoading()
        wx.showToast({ title: '投票成功', })
        const voteList = this.data.voteList
        if (voteList[index].count) {
          voteList[index].count += 1
        } else {
          voteList[index].count = 1
        }
        this.setData({ voteList })
        return
      }
    } catch (error) {
      this.data.voted = false
      console.log(error);
      wx.hideLoading()
      wx.showToast({ title: error, icon: "none" })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const _openid = await wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(res => res.result.openId)
    await votelog
      .where({ _openid }).get()
      .then(res => {
        this.data.voted = !!res.data.length
      })
    const voteList = await votes.get().then(res => { return res.data })
    this.setData({ voteList })
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