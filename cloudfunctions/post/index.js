// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  const posts = db.collection('posts')
  const candidates = db.collection('candidates')
  const _ = db.command

  const _openid = cloud.getWXContext().OPENID
  const {
    fileID
  } = event
  const date = +new Date()

  const postId = await posts.add({
    data: {
      _openid,
      fileID,
      date
    }
  }).then(res => {
    return res._id
  })

  const updated = await candidates.where({
    fileID
  }).update({
    data: {
      vote: _.inc(1)
    }
  }).then(res => {
    return res.stats.updated
  })

  return {
    fileID,
    updated
  }
}