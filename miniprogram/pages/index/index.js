import musicList from "./musicList";
import recommandList from "./recommandList";

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
    // 将播放列表和推荐列表合并
    playList: [].concat(musicList, recommandList),
    // 用于列表渲染
    recommandList: recommandList,
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
    const music = this.data.playList[index]
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
   * 在推荐页选择歌曲
   */
  recommand(e) {
    this.selectMusic(e.currentTarget.dataset.index + musicList.length)
    this.play()
  },

  /**
   * 滑动条变化时
   */
  sliderchange(e) {
    const value = e.detail.value
    const position = value / 100 * this.data.play.duration
    audioCtx.seek(position)
    this.setData({ 'play.currentTime': position })
    // 停启是为了解决 onTimeUpdate 失效
    audioCtx.pause()
    audioCtx.play()
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
      console.log('播放失败：', audioCtx.src);
    })
    audioCtx.onEnded(() => {
      this.next()
    })

    audioCtx.onTimeUpdate(() => {
      const { duration, currentTime } = audioCtx
      const play = {
        // es6 扩展运算
        ...this.data.play,
        duration,
        currentTime,
        percent: currentTime / duration * 100
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