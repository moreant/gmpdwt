App({
  onLaunch: async function () {
    wx.cloud.init({
      env: 'sc-t3cwb',
      traceUser: true
    })

    const student = (await wx.cloud.callFunction({
      name: 'login'
    })).result
    wx.setStorage({
      data: student,
      key: 'student',
    })
    // 默认是 exam ，不需要跳转
    if (!student) {
      wx.redirectTo({
        url: '/pages/register/register',
      })
    }
  },

  globalData: {

  }
})