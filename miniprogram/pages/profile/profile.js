const db = wx.cloud.database()
const $ = db.command.aggregate

Page({
  data: {
    tab: 0,
    list: ['a', 'b', 'c']
  },

  // 页面切换
  changeItem: function (e) {
    this.setData({
      item: e.target.dataset.item
    })
  },
  // tab切换
  changeTab: function (e) {
    this.setData({
      tab: e.detail.current
    })
  },
  rank(res) {
    wx.redirectTo({
      url: '/pages/rank/rank',
    })
  },

  async onLoad(options) {
    const student = wx.getStorageSync('student')
    const list = (await db.collection('pc_students')
      .aggregate()
      .unwind({
        path: '$target',
        includeArrayIndex: 'index'
      })
      .match({
        index: 0
      })
      .sort({
        total: -1
      })
      .group({
        _id: "$target",
        course: $.push({
          _id: "$_id",
          total: "$total"
        }),
      })
      .end()).list
    this.setData({
      student,
      list
    })

  }
})