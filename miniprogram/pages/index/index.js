
const db = wx.cloud.database()
const oStudents = db.collection("old_students")
const lovs = db.collection("loves")
const $ = db.command.aggregate

Page({

  data: {

  },

  // showModal(title, content) {
  //   wx.showModal({
  //     showCancel: false,
  //     title,
  //     content: content + ""
  //   })
  // },

  async one1() {
    const median = (await oStudents
      .aggregate()
      // 排名
      .sort({
        score: -1
      })
      // 求总人数
      .group({
        _id: null,
        count: $.sum(1),
        students: $.push({
          score: "$score"
        })
      })
      // 计算中位数
      .project({
        _id: 0,
        // 设中位数下标为index
        median: $.let({
          vars: {
            // 向下取整
            index: $.floor($.divide(['$count', 2])),
          },
          // 找到对应下标的成绩
          in: $.arrayElemAt(['$students.score', '$$index']),
        }),
      })
      .end()).list[0].median
    console.log(median);
    // this.showModal("19的成绩中位数是",median)
  },

  onetow() {

  },

  async tow1() {
    const res = (await oStudents
      .aggregate()
      .sort({
        score: -1
      })
      .limit(10)
      .end()).list
    console.log(res);
  },

  async three1() {
    const count = (await oStudents
      .where({
        "target": [
          "web前端",
          "移动应用",
          "手机游戏"
        ],
      }).count())
    console.log(count);
  },

  async four1() {
    const maxScore = (await oStudents
      .aggregate()
      .sort({
        score: -1
      })
      .match({
        gender: "女"
      })
      .limit(1)
      .end()).list[0].score
    console.log(maxScore);
  },

  async fives1() {
    const list = (await oStudents
      .aggregate()
      .group({
        _id: '$gender',
        count: $.sum(1)
      })
      .sort({
        _id: -1
      })
      .end()).list
    console.log(list[0].count / list[1].count);
  },

  six1() {
    const avg = (await oStudents
      .aggregate()
      .group({
        _id: null,
        avg: $.avg('$score')
      })
      .end()).list[0].avg
    console.log(avg);
  },

  six2() {
    const avg = (await oStudents
      .aggregate()
      .lookup({
        from: 'old_students',
        localField: 'name',
        foreignField: 'name',
        as: 'student'
      })
      .match({
        travel: '美国',
        favorite: '麻婆豆腐',
        'student.gender': '男'
      })
      .count('sn')
      .end()).list[0].sn
    console.log(avg);
  },

  async seven1() {
    const avg = (await oStudents
      .aggregate()
      .match({
        transcore: _.gt(0)
      })
      .group({
        _id: null,
        avg: $.avg('$transcore')
      })
      .end()).list[0].avg
    console.log(avg);
  },

  async seven2() {
    const count = (await oStudents
      .aggregate()
      .lookup({
        from: 'old_students',
        localField: 'name',
        foreignField: 'name',
        as: 'student'
      })
      .match({
        travel: '印度',
        color: '蓝色',
        'student.gender': '男'
      })
      .count('sn')
      .end()).list[0].sn
    console.log(count);
  },

  async eight1() {
    const count = (await oStudents
      .aggregate()
      .match({
        gender: '女'
      })
      .unwind({
        path: '$target',
        includeArrayIndex: 'index'
      })
      .group({
        _id: "$index",
        course: $.push({
          _id: "$_id",
          gender: "$gender",
          target: "$target"
        })
      })
      .match({
        "_id": 0,
      })
      .unwind('$course')
      .replaceRoot({
        newRoot: '$course'
      })
      .sortByCount('$target')
      .end()).list[0].count
    console.log(count);
  },

  onLoad() {
  }
})