
Page({
  data: {
    scrollTop: 0,
    list: [],
    nickName: null,
    avatarUrl: null
  },
  //事件处理函数

  onLoad: function () {
    wx.connectSocket({
      url: 'wss://78vy7.sse.codesandbox.io/:8080',
    })
    wx.onSocketOpen(function () {
      console.log('connect success')
      wx.showToast({
        title: '登录成功',
      })
    })
    wx.onSocketMessage(msg => {
      console.log(msg)
      var data = JSON.parse(msg.data)
      console.log(data)
      if (data && data.name == this.data.nickName) {
        return
      }
      data.id = this.id++
      data.role = 'server'
      var list = this.data.list
      list.push(data)
      this.setData({
        list: list
      })
      this.rollingBottom()
    })
  },
  count: 0,
  massage: '',
  send: function () {
    if (this.message) {
      wx.sendSocketMessage({
        data: this.message,
        fail: e => {
          wx.showToast({
            title: '发送失败',
          })
        }
      })
      console.log(this.data.list)
      var list = this.data.list
      list.push({
        id: this.count++,
        msg: this.message,
        role: 'me'
      })
      this.setData({
        list: list
      })
      this.rollingBottom()
    } else {
      wx.showToast({
        title: 'message can not null',
        icon: 'none',
        duration: 2000
      })
    }
  },
  bindChange(res) {
    this.message = res.detail.value
  },
  onUnload() {
    wx.onSocketClose();
    wx.showToast({
      title: 'connect shutdown',
      icon: 'none',
      duration: 2000
    })
  },
  rollingBottom(e) {
    wx.createSelectorQuery().selectAll('.list').boundingClientRect(rects => {
      rects.forEach(rect => {
        this.setData({
          scrollTop: rect.bottom
        })
      })
    }).exec()
  },
  userinfo(e) {
    console.log(e)
    let { nickName, avatarUrl } = e.detail.userInfo
    if (this.nickName == null) {
      wx.sendSocketMessage({
        data: 'nickName|' + nickName + '|avatarUrl|' + avatarUrl,
        fail: (e) => {
          console.log(e.errMsg);
        }
      })
    }
    this.setData({
      nickName, avatarUrl
    })
  }

})
