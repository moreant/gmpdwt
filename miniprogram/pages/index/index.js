//index.js

Page({
  // 处理输入事件
  input(e) {
    const input = e.currentTarget.id
    const show = this.data.show + input
    this.setData({
      show
    })
    this.inputOver()
  },
  // 输入完成
  inputOver() {
    const show = this.data.show
    // 从输入的字符串中提取信息
    // const other = /\^|√|sin|cos/g
    const reg = /\+|\-|\×|\÷|\%|\^|√|sin|cos/g
    const nums = show.split(reg).map(x => x - 0)
    const calculates = show.match(reg)
    // 如果运算符后接着运算符 还有改进空间，但我不想弄了
    if (
      nums[nums.length - 1] === nums[nums.length - 2] &&
      nums[nums.length - 1] === 0 &&
      calculates[calculates.length - 1] !== '√' &&
      calculates[calculates.length - 1] !== '^' &&
      calculates[calculates.length - 1] !== 'sin' &&
      calculates[calculates.length - 1] !== 'cos'
    ) {
      var newShow = show.split('')
      newShow.splice(-2, 1)
      newShow = newShow.join('')
      this.setData({
        show: newShow
      })
    }
    this.setData({
      nums,
      calculates
    })
    // 是否符合计算条件
    if (nums.length > 1 && nums[nums.length - 1] !== 0) {
      this.setData({        
        output: this.cal()
      })
    }
  },

  // 计算字符串 暴力 if 解决
  cal() {
    const nums = this.data.nums
    const calculates = this.data.calculates
    var len = nums.length
    var index
    if (len > 1 && nums[1] !== "") {
      if (calculates.indexOf('sin') !== -1) {
        index = calculates.indexOf('sin')
        nums.splice(index, 2, Math.sin(nums[index + 1]))
      } else if (calculates.indexOf('cos') !== -1) {
        index = calculates.indexOf('cos')
        nums.splice(index, 2, Math.cos(nums[index + 1]))
      } else if (calculates.indexOf('√') !== -1) {
        index = calculates.indexOf('√')
        nums.splice(index, 2, Math.sqrt(nums[index + 1]))
      } else if (calculates.indexOf('^') !== -1) {
        index = calculates.indexOf('^')
        nums.splice(index, 2, Math.pow(nums[index], nums[index + 1]))
      } else if (calculates.indexOf('%') !== -1) {
        index = calculates.indexOf('%')
        nums.splice(index, 2, nums[index] % nums[index + 1])
      } else if (calculates.indexOf('×') !== -1) {
        // 注意是 × 不是 X
        index = calculates.indexOf('×')
        nums.splice(index, 2, nums[index] * nums[index + 1])
      } else if (calculates.indexOf('÷') !== -1) {
        index = calculates.indexOf('÷')
        nums.splice(index, 2, nums[index] / nums[index + 1])
      } else if (calculates.indexOf('-') !== -1) {
        index = calculates.indexOf('-')
        nums.splice(index, 2, nums[index] - nums[index + 1])
      } else if (calculates.indexOf('+') !== -1) {
        index = calculates.indexOf('+')
        nums.splice(index, 2, nums[index] + nums[index + 1])
      }
    }
    console.log(nums);
    // 删除计算完的运算符
    calculates.splice(index, 1)
    // 没算完就递归
    if (nums.length > 1) {
      this.cal(nums, calculates)
    }
    // 算完输出
    return nums[0]
  },

  // 处理删除事件
  del() {
    const strings = this.data.show.split('')
    strings.pop()
    this.setData({
      show: strings.join('')
    })
    // 删除完成
    this.inputOver()
  },
  // 处理清除事件
  clear() {
    this.setData({
      nums: '',
      calculates: '',
      show: '',
      output: '0',
    })
  },
  data: {
    nums: '',
    calculates: '',
    show: '',
    output: '0',
  },

  onLoad: function () {}
})