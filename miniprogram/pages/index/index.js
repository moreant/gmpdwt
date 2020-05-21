const db = wx.cloud.database()
const $ = db.command.aggregate

Page({
  data: {
    tab: 0,
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
    const student = (await db.collection("test").where({
      _openid: '{openid}'
    }).get()).data[0]
    if (!student) {
      wx.redirectTo({
        url: '/pages/register/register',
      })
    } else {
      wx.setStorageSync('student', student)
    }

    const list = (await db.collection('test')
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
        students: $.push({
          _id: "$_id",
          total: "$total"
        }),
      })
      .end()).list
    console.log(list);
    // list.forEach(cInfo => {
    //   cInfo.students.unshift({
    //     name: "排名",
    //     total: "分数"
    //   })
    // })
    this.setData({
      student,
      list
    })

  }
})