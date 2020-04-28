// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  const candidates = db.collection('candidates')

  const _openid = cloud.getWXContext().OPENID
  const {
    fileID
  } = event
  
  const id = await candidates.add({
    data: {
      _openid,
      fileID,
      vote: 0
    }
  }).then(res => {
    return res._id
  })

  return id
}