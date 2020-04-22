// pages/index/index.js

import moment from "moment";

const db = wx.cloud.database()
// 投票记录集合
const votelog = db.collection('votelog')
// 投票项集合
const votes = db.collection('votes')
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    vote: ''
  },


  /**
   * 获取本用户本填投票
   * @param {String} _openid 用户的 _openid
   */
  async getVote(_openid) {
    // 获取今天的时间戳
    const nowDay = 0 - moment(0, "hh").format("x")
    const res = await votelog
      // 查找比今天时间戳大的数据
      .where({ _openid, date: _.gt(nowDay) }).get()
    return res.data[0]
  },

  /**
   * 取消投票
   */
  async undoVoting() {
    // 回调函数 Promise 化
    const res = await new Promise((resolve, reject) => {
      wx.showModal({
        title: '您已投票',
        content: '是否取消之前的投票',
        success: (res) => resolve(res)
      })
    })
    // 确定取消
    if (res.confirm) {
      const { _openid, voteList, vote: { voteid } } = this.data
      wx.showLoading({ title: '取消中', })
      // 移除指定的投票记录
      await votelog.where({ _openid, voteid }).remove()
      // 调用改变计数方法，自增 -1
      await this.changeCount(voteid, -1)
      // 循环查找本地投票列表，删除对应的计数
      voteList.forEach((item, index) => {
        if (item._id === voteid) {
          voteList[index].count -= 1
        }
      })
      this.setData({ voteList, vote: '' })
      wx.showToast({ title: '取消成功', })
    }
  },

  /**
   * 投票计数增加/减少 使用 inc 原子操作 
   * inc: 原子自增多个用户同时写，对数据库来说都是将字段自增，不会有后来者覆写前者的情况
   * @param {String} _id 投票项集合 _id
   * @param {Number} inc 增加/减少数
   */
  async changeCount(_id, inc) {
    const res = await votes
      .doc(_id)
      .update({ data: { count: _.inc(inc) } })
    return res.stats.updated
  },

  /**
   * 图片点击事件
   */
  async tap(e) {
    // 查到已有投票则调用取消投票对话框
    if (!!this.data.vote) {
      this.undoVoting()
    } else {
      if (this.data.loading) { return }
      // 开始增加投票的耗时操作，防止重复投票
      this.data.loading = true
      const { voteid, index } = e.target.dataset
      const { _openid, voteList } = this.data
      wx.showLoading({ title: '投票中', })
      const date = new Date().valueOf()
      // 添加投票记录
      const _id = await votelog.add({
        data: { voteid, date }
      })
      // 调用投票计数方法，自增 +1
      const updated = await this.changeCount(voteid, 1)
      // 用于更新本地投票记录
      const vote = { _id, _openid, voteid, date }
      // 投票成功
      if (updated === 1) {
        this.data.loading = false
        wx.showToast({ title: '今天投票成功', })
        // 更新本地投票计数 || 0 防止无计数时相加的 NaN
        voteList[index].count = (voteList[index].count || 0) + 1
        this.setData({ voteList, vote })
      }
    }
  },

  /**
   * 轮播图滑动事件，更新标题栏
   */
  schange(e) {
    const { current } = e.detail
    const { voteList } = this.data
    // 解构指定默认值，防止计数为零
    const { count = 0 } = voteList[current]
    wx.setNavigationBarTitle({
      title: `${current + 1}/${voteList.length} 票数：${count}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 调用云函数获得用户 _openid
    const _openid = await wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(res => res.result.openId)
    // 调用获取投票方法
    const vote = await this.getVote(_openid)
    // 获取投票列表
    const voteList = await votes.get().then(res => { return res.data })
    this.setData({ voteList, vote, _openid })
    // 标题栏默认显示投票列表第一个
    this.schange({ detail: { current: 0 } })
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