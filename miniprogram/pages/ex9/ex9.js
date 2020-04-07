var arrayincp = [] //收入
var arraycp = [] //支出
var income
Page({
  data: {
    array: arrayincp,
    array1: arraycp,
    condition1: true,
    condition2: false,
    input: false,
    nav1: "nav1",
    nav2: "nav2",
    income: 0,
    pay: 0,
    balance: 0
  },
  //页面加载，提取保存数据
  onLoad: function (options) {
    wx.getStorage({
      key: 'array',
      success: res => {
        var arraystore = res.data
        arrayincp = arraystore[0]
        arraycp = arraystore[1]
      }
    })
  },

  //点击待办
  click1: function (e) {
    this.setData({
      condition1: true,
      condition2: false,
      nav1: "nav1",
      nav2: "nav2",
      input: false
    })
  },

  //点击支出  
  click2: function (e) {
    this.setData({
      condition1: false,
      condition2: true,
      nav1: "nav2",
      nav2: "nav1",
      input: false
    })
  },

  //增加
  click: function (e) {    
    this.setData({
      input: true,
    })

  },
  // 输入完成
  confirm: function (e) {
    if (e.detail.value.trim()) {
      if (this.data.condition1) {
        arrayincp.push(e.detail.value)
      } else {
        arraycp.push(e.detail.value)
      }
    }
    this.setData({
      array: arrayincp,
      array1: arraycp,
      input: false,
      income: arrayincp.length > 0 ? arrayincp.reduce((x, y) => {
        return parseFloat(x) + parseFloat(y)
      }) : 0,
      pay: arraycp.length > 0 ? arraycp.reduce((x, y) => {
        return parseFloat(x) + parseFloat(y)
      }) : 0
    })
  },

  onHide: function () {
    var arraystore = [arrayincp, arraycp]
    wx.setStorage({
      data: arraystore,
      key: 'array',
    })
  },
})