//index.js
//获取应用实例
const app = getApp()

Page({
  // 处理按钮点击事件
  handle(e) {
    const id = e.currentTarget.id
    // 设置激活id和图片地址
    this.setData({
      active: id,
      src: `/images/${id.toLowerCase()}.png`
    })
  },
  data: {
    // 音名列表
    pitchList: [
      'C', 'D', 'E', 'F', 'G', 'A', 'B'
    ],
    // 默认状态
    active: 'C',
    src: '/images/a.png'
  },
  
  onLoad: function () {}
})