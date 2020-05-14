// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const APPID = 'wx03bcb7ad8c3a3ac9'
  const APPSECRET = 'c07f653e7b40a9f87f2b60f0ea13a07a'
  const tokenURL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
  const ACCESS_TOKEN = (await axios.get(tokenURL)).data.access_token
  const { priTmplId } = event

  const deleteTemplateURL = `https://api.weixin.qq.com/wxaapi/newtmpl/deltemplate?access_token=${ACCESS_TOKEN}`
  const deleteTemplate = (await axios.post(deleteTemplateURL, {
    priTmplId
  })).data
  console.log(deleteTemplate);
  
  return {deleteTemplate}
}