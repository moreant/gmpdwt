//云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
let db = cloud.database()
let wedding = db.collection('wedding')
letres = ''
//云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let today = new Date()
  let offset = 8 //中国在东八区
  let utc = today.getTime() + (today.getTimezoneOffset() * 60000); //获取utc时间
  today = new Date(utc + (3600000 * offset)); //设置东八区时间
  today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

  let messages = await wedding.where({
    "date2.value": today
  }).get()
  console.log(messages)
  let result = []
  for (v of messages.data) {
    res = await cloud.openapi.subscribeMessage.send({
      touser: v._openid,
      page: '/page/index',
      data: v,
      templateId: v.templateID
    })
    await wedding.doc(v._id).remove()
    // console.log(res)
    result.push(res)
  }
  // console.log(result 
  return result
}