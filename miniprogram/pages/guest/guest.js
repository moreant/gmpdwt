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
    res = await wx.requestSubscribeMessage({
      tmplIds: ['n9-jjzzhNIxkjff0V4xJ5RGdbrP9_ZwzrWgD8bDTJ1Q']
    })
    console.log(res)
    if (res) {
      res = await wx.cloud.callFunction({
        name: 'guest',
        data: {
          name5: { value: this.data.name },
          thing1: { value: '王辉辉&张琳琳婚礼' },
          thing3: { value: this.data.wish },
          date2: { value: '2020-5-13' },
          templateID: 'n9-jjzzhNIxkjff0V4xJ5RGdbrP9_ZwzrWgD8bDTJ1Q',
          phone: this.data.phone
        }
      })
      console.log(res)
    }
  }
})
