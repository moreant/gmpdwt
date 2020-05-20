Page({
  data: {
    target: [],
    student: {
      target: []
    }
  },

  async post() {
    let { student: { target } } = this.data
    const res = await wx.cloud.database().collection('pc_students')
      .where({
        _openid: '{openid}'
      })
      .update({
        data: {
          target
        }
      })
    if (res.stats.updated === 1) {
      wx.redirectTo({
        url: '/pages/profile/profile',
      })
    } else {

    }
  },

  reset() {
    this.init()
  },

  change(e) {
    const { student, target } = this.data
    const id = e.currentTarget.dataset.id
    const index = e.detail.value - 0
    student.target[id] = target[index]
    target.splice(index, 1)
    this.setData({
      'student.target': student.target,
      target
    })
  },

  init() {
    const student = wx.getStorageSync('student')
    let target = ['web前端', '人工智能', '移动应用', '手机游戏']
    if (student.transcore < 60) {
      if (student.ai) {
        target = ['人工智能']
      } else {
        target = ['web前端', '移动应用', '手机游戏']
      }
    }
    student.target = Array(target.length).fill('')
    this.setData({
      target,
      student
    })
  },

  onLoad(options) {
    this.init()
  },
})