const db = wx.cloud.database()
const candidates = db.collection('candidates')
let res = null

Page({
  data: {
    candidateList: [], //候选人数组
    index: 0,
    posted: false //已投票状态
  },


  //页面加载生命周期回调
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //调用云函数posted获取是否投过票
    const posted = await wx.cloud.callFunction({
      name: 'posted'
    }).then(res => {
      return res.result[0] || ''
    })
    /** @type {Array} */
    const candidateList = (await candidates.get()).data
    // 如果带了fileID参数
    let index = 0
    if (options.fileID) {
      const { fileID } = options
      index = candidateList.findIndex(item => item.fileID === fileID)
    }
    // 如果投了票
    if (posted) {
      const index = candidateList.findIndex(item => item.fileID === posted.fileID)
      candidateList[index].class = 'border'
    }

    this.setData({
      candidateList,
      posted,
      index
    })
    // 刷新标题栏
    this.schange({
      detail: {
        current: index
      }
    })
    wx.hideLoading({})
  },

  async schange(res) {
    const { current } = res.detail
    const { candidateList } = this.data
    const vote = candidateList[current].vote || 0
    this.data.swiperCurrent = current
    //设置标题栏内容
    wx.setNavigationBarTitle({
      title: `莫奕基 ${current + 1} / ${candidateList.length} 票数：${vote}`
    })
  },


  async tap(e) {
    if (this.data.posted) {
      const { _id, fileID } = this.data.posted
      const { confirm } = await wx.showModal({
        title: '您已投票',
        content: '是否取消上次投票',
      })
      if (confirm) {
        const updated = await wx.cloud.callFunction({
          name: 'removePost',
          data: {
            _id,
            fileID
          }
        }).then(res => {
          return res.result
        })
        if (updated === 1) {
          this.relaunch()
        } else {
          wx.showToast({ title: '取消失败', })
        }
      }
    } else {
      const { confirm } = await wx.showModal({
        title: '投票确认',
        content: '确定投这件作品吗？',
      })
      if (confirm) {
        const { fileid, index } = e.currentTarget.dataset
        wx.showLoading({
          title: '投票中',
        })
        const updated = await wx.cloud.callFunction({
          name: 'post',
          data: {
            fileID: fileid
          }
        }).then(res => {
          return res.result.updated
        })
        if (updated === 1) {
          this.data.candidateList[index].vote++
          this.schange({
            detail: {
              current: index
            }
          })
          this.relaunch()
        } else {
          wx.showToast({
            title: '投票失败',
          })
        }
      }
    }
  },

  /**
   * 统一重加载方法
   * @param {String} param 重加载参数
   */
  relaunch(param = '') {
    wx.reLaunch({
      url: '/' + getCurrentPages()[0].route + param
    })
  },

  async long(e) {
    /** @type {WechatMiniprogram.ChooseImageSuccessCallbackResult} */
    const tempFilePaths = await wx.chooseImage({
      count: 1,
    }).then(res => {
      return res.tempFilePaths
    })
    const extName = (/\.(\w+)$/.exec(tempFilePaths[0]))[0]
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    const fileID = await wx.cloud.uploadFile({
      cloudPath: +new Date() + extName,
      filePath: tempFilePaths[0]
    }).then(res => {
      return res.fileID
    })
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    await wx.cloud.callFunction({
      name: 'addCandidate',
      data: {
        fileID
      }
    })
    const param = '?fileID=' + fileID
    this.relaunch(param)
  }

})