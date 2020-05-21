// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV
  env: 'sc-t3cwb'
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  const db = cloud.database()
  const test = db.collection("test")

  /**@type {student[]} */
  let postList = (await test
    .limit(1000)
    .orderBy('total', 'desc')
    .get()).data 

  /**
   * 学生信息   
   * 
   * **示例**:
   * ```json
   * {
   *    "_id": "9098d0ed5ec557bc000d3ae6703f9850", 
   *    "total": 90, 
   *    "target": ["手机游戏","web前端","移动应用"], 
   * }
   * ```
   * @typedef {Object} student
   * @property {string} _id - 唯一标识
   * @property {Number} total - 总分
   * @property {Array<string>} target - 志愿数组（顺序代表志愿顺序）
   */

  /**
   * 班级信息
   * @typedef  {object} classInfo
   * @property {string} name - 班级名称
   * @property {string} max - 最大人数
   * @property {student[]} students - 班级学生
   */

  /**
   * @type {classInfo[]}
   */
  const classes = [
    { name: '手机游戏', max: 52, students: [] },
    { name: 'web前端', max: 104, students: [] },
    { name: '人工智能', max: 52, students: [] },
    { name: '移动应用', max: 52, students: [] }
  ]


  /**
  * 投档
  * @param {Array} students - 投档学生数组
  * @param {Number} cycle - 投档次数
  */
  function post(students, cycle) {
    students.forEach(student => {
      let post = false
      classes.forEach(cInfo => {
        if (student.target[cycle - 1] === cInfo.name) {
          cInfo.students.push(student)
          post = true
        }
      })
      // 收集无法投档
      if (!post) {
        unablePosts.push(student)
      }
    })
    // 投档完成进行排序
    classes.forEach((cInfo, index) => {
      classes[index].students = cInfo.students.sort((a, b) => {
        return (a.target - b.target)
      })
    })
  }

  /**
   * 退档
   * @returns {student[]} - 退档学生数组
   */
  function backPost() {
    const overPosts = []
    classes.forEach((classInfo, index) => {
      // 超出的投档
      const overPost = classInfo.students.slice(classInfo.max)
      // 加到退档中
      overPosts.push(...overPost)
      // 删除班级里超出的投档
      classes[index].students.splice(classInfo.max, 999)
    })
    return overPosts
  }

  // 掉档
  /** @type {student[]} */
  const unablePosts = []

  // 最大志愿
  const postCycle = 4

  // 循环投档
  for (let i = 1; i < postCycle + 1; i++) {
    post(postList, i)
    // 填入退档
    postList = backPost(postList)
  }

  // 结果分析
  console.log("分班情况：", classes);
  console.log("分班人数：", classes.reduce((sum, curr, index) => {
    return sum + curr.students.length
  }, 0));

  console.log("掉档情况：", unablePosts);
  console.log("掉档人数：", unablePosts.length);

  return {
    classes,
    unablePosts
  }
}