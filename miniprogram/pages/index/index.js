//index.js
const ctx = wx.createCanvasContext('myCanvas')
var imagepath
var fun = false
var fancy = false
var seal = false
Page({
  //获取分享图片地址
  onLoad: function (options) {
    if (options.path !== undefined) {
      imagepath = options.path
      ctx.drawImage(imagepath, 0, 0, 700, 700)
      ctx.draw()
    }
  },

  //选择图片
  click: function (e) {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.data.temp = res.tempFilePaths[0]
        ctx.drawImage(res.tempFilePaths[0], 0, 0, 700, 700)
        ctx.draw()
      }
    })
  },

  //手指移动
  move: function (e) {
    //打马赛克
    if (fun) {
      ctx.setFillStyle('red')
      ctx.fillRect(e.touches[0].x, e.touches[0].y, 10, 10)
      ctx.fillRect(e.touches[0].x + 10, e.touches[0].y + 10, 10, 10)
      ctx.setFillStyle('pink')
      ctx.fillRect(e.touches[0].x + 10, e.touches[0].y, 10, 10)
      ctx.fillRect(e.touches[0].x, e.touches[0].y + 10, 10, 10)
      ctx.draw(true)
    } else if (fancy) {
      const pattern = ctx.createPattern('/images/cool.png', 'repeat')
      ctx.fillStyle = pattern
      ctx.fillRect(e.touches[0].x, e.touches[0].y, 16, 16)
      ctx.draw(true)
    }
    //擦除
    else {
      ctx.clearRect(e.touches[0].x, e.touches[0].y, 20, 20)
      ctx.draw(true)
    }
  },

  /**
   * 学号姓名水印
   */
  start(e) {
    if (seal) {
      ctx.setFontSize(20)
      console.log(e.touches[0].x, e.touches[0].y);
      ctx.fillText('07180935莫奕基', e.touches[0].x, e.touches[0].y)
      ctx.draw(true)
    }
  },

  /**
   * 印章按钮
   */
  seal() {
    seal = true
    fancy = false
    fun = false
  },

  /**
   * 花样按钮
   */
  fancy() {
    fancy = true
    seal = false
    fun = false
  },

  /**
   * 上传处理
   */
  upload() {
    wx.uploadFile({
      url: 'https://www.gdmec.vip/upload', 
      filePath: imagepath,
      name: 'file',
      success: res => {
        const path = JSON.parse(res.data)
        wx.downloadFile({
          url: path.url,
          success: res => {
            if (res.statusCode === 200) {
              console.log(res);
              imagepath = res.tempFilePath
              ctx.drawImage(res.tempFilePath, 0, 0, 700, 700)
              ctx.draw()
            }
          }
        })
      }
    })

  },

  //按键切换
  clear: function (e) {
    fun = false
  },
  cover: function (e) {
    fun = true
  },
  //保存图片
  save: function (e) {
    console.log("保存")
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success(res) {
        imagepath = res.tempFilePath
      }
    })
  },
  //分享给好友
  onShareAppMessage: function () {
    return {
      title: '我的图片',
      desc: '',
      path: '/pages/index/index?path=' + imagepath
    }
  }
})