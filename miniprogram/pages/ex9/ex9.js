import moment from "moment";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch: false,
    show: false,
    date: moment().format("YYYY-MM-DD"),
    title: '',
    money: '',
    items: []
  },

  /**
   * 改变项目类型
   */
  onChangeSwitch({ detail }) {
    this.setData({ switch: detail });
  },

  /**
   * 改变日期
   */
  changeDate(event) {
    this.setData({ date: event.detail.value })
  },

  /**
   * 处理表单 显示/隐藏
   */
  show() {
    this.setData({ show: !this.data.show })
  },

  /**
   * 输入框失去焦点时输入结束
   */
  inputEnd(event) {
    this.data[event.currentTarget.id] = event.detail.value
  },

  /**
   * 处理提交
   */
  submit() {
    const { title = '', money, date, income = 0, expend = 0 } = this.data
    const item = { title, income, expend, date }
    if (this.data.switch) {
      item.expend = money - 0
    } else {
      item.income = money - 0
    }
    // 设置 key 用于循环
    item.key = new Date().valueOf()
    const items = this.data.items
    items.push(item)
    wx.setStorage({ data: items, key: 'items', })
    // 更新 items ，重置表单数据
    this.setData({ items, title: '', money: '', switch: false, date: moment().format("YYYY-MM-DD") })
    wx.showToast({ title: '添加成功', })
    // 隐藏表单
    this.show()
  },

  /**
   * 查看月视图时
   */
  calMonthView() {
    const items = this.data.items
    const temps = []
    const months = []
    items.forEach(item => {
      const month = moment(item.date).month() + 1
      const { income, expend } = item
      temps.push({ month, income, expend })
    })
    console.log(temps);

    const Test = [{
      month: 3, money: [3, 4, 5, 6, 7, 8, 9]
    }, {
      month: 4, money: [4, 5, 6, 7, 8]
    }]
    const monthItem = []
    Test.forEach(item => {
      const sum = item.money.reduce((sum, num) => {
        return sum + num
      })
      monthItem.push({ monthNum: item.month, sum })
    })
    console.log(monthItem)


    temps.forEach(temp => {
      const index = months.findIndex(month => month.month === temp.month)
      if (index !== -1) {
        const month = months[index]
        month.income += temp.income
        month.expend += temp.expend
        months.splice(index, 1, month)
      } else {
        months.push(temp)
      }
    })
    this.setData({ months })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 得指定默认值，不然 items 是空的时候会改变 items 的类型
    this.setData({ items: wx.getStorageSync('items') || [] })
    this.calMonthView()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})