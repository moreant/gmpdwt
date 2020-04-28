// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  const posts = db.collection('posts')
  const candidates = db.collection('candidates')
  const _ = db.command

  const { _id, fileID } = event
  let = updated = 0

  const { removed } = await posts
    .doc(_id).remove().then(res => {
      return res.stats
    })
  if (removed === 1) {
    updated = await candidates.where({
      fileID
    }).update({
      data: {
        vote: _.inc(-1)
      }
    }).then(res => {
      return res.stats.updated
    })
  }
  return updated
}