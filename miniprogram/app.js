App({
  onLaunch: async function () {
    wx.cloud.init({
      env: 'sc-t3cwb',
      traceUser: true
    })

  },
  globalData: {

  },

  onShow(e) {
    try {
      this.globalData.shareTicket = e.shareTicket
      console.log('app onshow ticket:', this.globalData.shareTicket)
    } catch (e) {
      console.log(e);
    }
  }
})