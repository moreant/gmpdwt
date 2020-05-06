
const db = wx.cloud.database()
const students = db.collection('ddd_students')

Page({


  data: {

  },

  /**
   * 这个页面是 students 里没有记录才会进入的，就不查重了。
   * 并且在数据库中设置了唯一键，保证学号绝对唯一
   */
  async submit(e) {
    const { sn, name } = e.detail.value
    const id = (await students.add({
      data: {
        sn,
        name,
        signdate: +new Date(),
        score: 0
      }
    }))._id
    if (id) {
      wx.showToast({
        title: '绑定成功',
      })
      // 设置定时器，避免 Toast 已出现就跳转
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }, 1000)
    }
  },

  onLoad: function (options) {

  },

})