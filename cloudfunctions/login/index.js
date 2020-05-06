// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const students = db.collection('ddd_students')

// 云函数入口函数
exports.main = async (event, context) => {

  const _openid = cloud.getWXContext().OPENID
  const student = (await students
    .where({
      _openid
    })
    .get()).data[0]

  return student
}