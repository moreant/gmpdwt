// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const posts = cloud.database().collection('posts')
  // 这步骤有问题
  const res = await posts.where({
    _openid: '{openid}'
  }).get()

  return res.data

}