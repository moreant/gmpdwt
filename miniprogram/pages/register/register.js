Page({
  data: {
    nickName: '',
    avatarUrl: '',
  },

  async formsubmit(e) {
    const {
      sn,
      name
    } = e.detail.value
    try {
      if (!this.data.nickName) {
        throw '请获取微信信息'
      }
      if (!sn || !name) {
        throw '请输入学号姓名'
      }
      if (!/\d{8}/.test(sn)) {
        throw '请输入8位学号'
      }
      this.register(sn, name)
        .catch(e => {
          wx.showModal({
            title: '发生错误',
            content: e,
            showCancel: false
          })
        })
    } catch (e) {
      wx.showToast({
        title: e,
        icon: 'none'
      })
    }
  },

  getUserInfo(e) {
    this.setData({ ...e.detail.userInfo })
  },

  async register(sn, name) {
    console.log(sn, name);
    const { nickName, avatarUrl, _openid } = this.data
    const students = wx.cloud.database().collection('pc_students')
    let student = (await students
      .where({
        sn,
        name
      }).get()).data[0]
    if (!student) {
      return Promise.reject("没有找到匹配的学号姓名")
    }
    console.log(student);
    if (student.nickName) {
      return Promise.reject(`学号：${sn} 已被微信昵称：${student.nickName} 绑定`)
    }
    await students
      .doc(student._id)
      .update({
        data: {
          nickName,
          avatarUrl,
          _openid
        }
      })
    student = (await students.where({
      _openid: '{openid}'
    }).get()).data[0]
    wx.setStorageSync('student', student)
    wx.redirectTo({
      url: '/pages/rank/rank',
    })
  },

  onLoad() {
    wx.cloud.callFunction({
      name: 'openid'
    }).then(res => this.data._openid = res.result.openid)
  }
})