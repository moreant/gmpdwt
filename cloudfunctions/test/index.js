// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    openId
  } = event.userInfo
  const candidates = await cloud.database().collection('candidates')
    .add({
      data: {
        _openid: openId,
        fileID: 'test',
        vote: '???'
      }
    })

  return {
    candidates,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}