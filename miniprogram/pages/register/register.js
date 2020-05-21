Page({
  data: {
    nickName: '',
    avatarUrl: '',
    name: '',
    sn: '',
    error: ''
  },

  async submit(e) {  
    console.log("???");
    const {
      sn,
      name
    } = this.data
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
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      this.register(sn, name)
        .catch(e => {
          wx.hideLoading()
          wx.showModal({
            title: '发生错误',
            content: e,
            showCancel: false
          })
        })
    } catch (e) {
      wx.hideLoading()      
      this.setData({
        error: e
      })
      // 暴露给日志系统
      throw e
    }
  },

  getUserInfo(e) {
    this.setData({ ...e.detail.userInfo })
  },

  async register(sn, name) {
    const { nickName, avatarUrl, _openid } = this.data
    const students = wx.cloud.database().collection('test')
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
    wx.getUserInfo({
      success: res => {
        this.setData({ ...res.userInfo })
      }
    })

    wx.cloud.callFunction({
      name: 'openid'
    }).then(res => this.data._openid = res.result.openid)
  }
})