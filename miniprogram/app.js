App({
  onLaunch: async function () {
    wx.cloud.init({
      env: 'sc-t3cwb',
      traceUser: true
    })
  },
  globalData: {

  }
})