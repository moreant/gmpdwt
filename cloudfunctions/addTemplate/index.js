const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 需要在 config.json 的 openapi 里添加 "subscribeMessage.*"

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取小程序账号的类目
  const category = (await cloud.openapi.subscribeMessage.getCategory({})).data[0].id
  console.log('category:', category)
  // 获取帐号所属类目下的公共模板标题
  const ptlist = (await cloud.openapi.subscribeMessage.getPubTemplateTitleList({
    ids: category,
    start: 0,
    limit: 30
  })).data
  console.log('ptlist:', ptlist)
  // 随机模板索引
  const random = Math.random() * ((25 - 0) + 1) | 0
  console.log('random', random);
  // 获取模板标题下的关键词列表
  const ptkw = (await cloud.openapi.subscribeMessage.getPubTemplateKeyWordsById({
    tid: ptlist[random].tid
  })).data
  console.log('ptkw:', ptkw)
  // 获取 token
  const APPID = 'wx03bcb7ad8c3a3ac9'
  const APPSECRET = 'c07f653e7b40a9f87f2b60f0ea13a07a'
  const tokenURL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
  const ACCESS_TOKEN = (await axios.get(tokenURL)).data.access_token
  const addTemplateURL = `https://api.weixin.qq.com/wxaapi/newtmpl/addtemplate?access_token=${ACCESS_TOKEN}`
  // 循环赋值关键词列表 kidList 和消息数据 data
  const kidList = [], data = {}
  for (let i = 0; i < 3; i++) {
    const ptkwi = ptkw[i]
    kidList.push(ptkwi.kid)
    var key = ptkwi.rule + ptkwi.kid
    // 模板的日期例子有点问题，自己替换
    if (ptkwi.rule === 'date') {
      ptkwi.example = '2019年10月1日'
    }
    data[[key]] = { value: ptkwi.example }
  }
  // 组合模板并添加至帐号下的个人模板库
  const priTmplId = (await axios.post(addTemplateURL, {
    tid: ptlist[random].tid,
    kidList,
    sceneDesc: '动态测试'
  })).data.priTmplId
  // 返回数据
  return {
    priTmplId,
    data
  }
}