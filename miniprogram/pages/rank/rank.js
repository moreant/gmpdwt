
const db = wx.cloud.database()
const students = db.collection('ddd_students')

Page({

  data: {
    loading: true,
    ranklist: {}
  },

  onLoad: async function (options) {
    /** @type {Array} */
    const ranklist = (await students
      .orderBy('score', 'desc')
      .get()).data

    const user = (await students
      .where({
        _openid: '{openid}'
      }).get()).data[0]

    this.setData({
      ranklist,
      user,
      loading: false
    })
  },
})