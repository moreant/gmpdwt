// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await axios.post('https://www.gdmec.vip/upload', {
    path: event.path
  }, { headers: { 'Content-Type': 'multipart/form-data' } })
}