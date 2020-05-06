// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const students = db.collection('ddd_students')
  const records = db.collection('ddd_reords')

  const _openid = cloud.getWXContext().OPENID
  const student = (await students
    .where({
      _openid
    }).get()).data[0]

  if (event.score != 0) {
    await students.where({
      _openid
    }).update({
      data: {
        score: _.inc(event.score)
      }
    })
    student.score += event.score
  }
  const record = event
  record.postDate = +new Date()
  record._openid = _openid
  records.add({
    data: record
  })

  return student
}