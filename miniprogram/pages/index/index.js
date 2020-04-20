import musicList from "../../utils/musicList";

const audioCtx = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    tab: 0,
    state: 'paused',
    playIndex: 0,
    playList: musicList,
    audioCtx: '',
    play: {
      currentTime: 0,
      duration: 0,
      percent: 0,
      title: '',
      singer: '',
      coverImgUrl: ''
    }
  },

  changeItem(e) {
    this.setData({
      item: e.target.dataset.item
    })
  },

  changeTab(e) {
    this.setData({ tab: e.detail.current })
  },

  selectMusic(index) {
    console.log(index);
    const music = this.data.playList[index]
    console.log(music);
    const { src, title, singer, coverImgUrl } = music
    audioCtx.src = src
    this.setData({
      playIndex: index,
      play: {
        title, singer, coverImgUrl,
        currentTime: 0,
        duration: 0,
        percent: 0
      }
    })
  },

  play() {
    audioCtx.play()
    this.setData({ state: 'running' })
  },

  pause() {
    audioCtx.pause()
    this.setData({ state: 'paused' })
  },

  next() {
    const { playIndex, playList, state } = this.data
    const index = (playIndex + 1) % playList.length
    this.selectMusic(index)
    if (state === 'running') {
      this.play()
    }
  },

  change(e) {
    this.selectMusic(e.currentTarget.dataset.index)
    this.play()
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    audioCtx.onError(() => {
      console.log('播放失败：', this.audioCtx.src);
    })
    audioCtx.onEnded(() => {
      this.next()
    })
    audioCtx.onTimeUpdate(() => {
      const { duration, currentTime } = audioCtx
      const play = {
        duration,
        currentTime,
        percent: currentTime / duration * 1000,
        ...this.data.play
      }
      this.setData({ play })
    })
    this.selectMusic(0)
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