// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const url = 'https://tianqiapi.com/api?version=v1&appid=62227342&appsecret=0Na7FE6J&city='
  // 没啥好说的，axios 发送 get 请求，在回调取出的响应数据，就可以直接返回
  return await axios.get(url + encodeURI(event.city)).then(res => { return res.data })
  // return url + event.city
}