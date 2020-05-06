// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const questCollection = db.collection('ddd_questions')
const recordCollection = db.collection('ddd_records')

const vals = [10000, 20000, 30000, 40000, 50000]
const nums = [1, 1, 1, 1, 1] //五道题目的类型数字
let ids = []
let result = []

//获取随机整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//获取每个号码段最大值
function getCount(val1, val2) {
  let result = questCollection
    .where({
      "no": _.gt(val1).and(_.lt(val2))
    })
    .count()
  return result
}

//随机抽题，题目+选项，一次抽五个,要保证题目编号的连续，否则会有选项数量缺失。
async function getChoice(val1, val2) {
  let chs = []
  for (let i = 0; i < 5; i++) {
    chs.push(getRandomInt(val1, val2))
  }
  let result = await questCollection
    .where({
      "no": _.in(chs)
    })
    .get()
  return result
}
// 云函数入口函数
exports.main = async(event, context) => {
  let begin = new Date()

  //获取全部题目数量
  let questions = await questCollection.count()
  console.log('questcount:' + (new Date() - begin))
  //获取各类题目的数量
  for (let i = 1; i < vals.length; i++) {
    ids[i - 1] = await getCount(vals[i - 1], vals[i])
  }
  ids = ids.map(val => {
    return val.total
  })
  result = []
  console.log('class:' + (new Date() - begin))
  //抽题，抽答案选项
  for (let i = 0; i < 5; i++) {
    rand = getRandomInt(1, questions.total)

    choice = await getChoice(nums[i] * 10000, nums[i] * 10000 + ids[nums[i] - 1])
    console.log('choice:' + (new Date() - begin))
    result[i] = choice.data
  }
  //返回一个5X5的二维数组
  return result
}