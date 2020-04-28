// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const posts = cloud.database().collection('posts')
  const res = await posts.where({
    _openid: cloud.getWXContext().OPENID
  }).get()

  return res.data

}