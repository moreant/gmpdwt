let res = ''
Page({
  data: {
    picker: {
      arr: ['0', '1', '2', '3', '4', '5', '6'],
      index: 1
    }
  },
  //验证姓名
  nameChange: function (e) {
    this.checkName(e.detail.value)
  },
  //验证手机号
  phoneChange: function (e) {
    this.checkPhone(e.detail.value)
  },
  // checkName()方法
  checkName: function (data) {
    var reg = /^[\u4E00-\u9FA5A-Za-z]+$/;
    return this.check(data, reg, '姓名输入错误!')
  },
  // checkPhone()方法
  checkPhone: function (data) {
    var reg = /^(((13)|(15)|(17)|(18))\d{9})$/;
    return this.check(data, reg, '手机号码输入有误!')
  },
  // check()方法
  check: function (data, reg, errMsg) {
    if (!reg.test(data)) {
      wx.showToast({
        title: errMsg,
        icon: 'none',
        duration: 1500
      })
    }
    return true
  },
  bindKeyInput: function (e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },

  async subscribe(e) {
    const { priTmplId, data } = this.data
    res = await wx.requestSubscribeMessage({
      tmplIds: [priTmplId]
    })
    console.log(res);
    if (res) {
      res = await wx.cloud.callFunction({
        name: 'guest',
        data: {
          ...data,
          date: '2020-5-14',
          templateID: priTmplId,
          phone: this.data.phone
        }
      })
      wx.showToast({
        title: '添加成功',
      })
    }
  },
  onShow() {
    wx.cloud.callFunction({
      name: 'addTemplate'
    }).then(res => {
      wx.showToast({
        title: '获取模板成功',
      })
      console.log(res.result);
      this.setData({ ...res.result })
    })

  },

  onHide() {
    wx.cloud.callFunction({
      name: 'deleteTemplate',
      data: {
        priTmplId: this.data.priTmplId
      }
    }).then(() => {
      wx.showToast({
        title: '删除成功',
      })
    })
  },
})
