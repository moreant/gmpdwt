const db = wx.cloud.database()
const candidates = db.collection('candidates')
let res = null

Page({
  data: {
    candidateList: [], //候选人数组
    posted: false //已投票状态
  },


  //页面加载生命周期回调
  onLoad: async function (options) {
    wx.showLoading({
      title: '初始化中',
      mask: true
    })
    //调用云函数posted获取是否投过票
    const posted = await wx.cloud.callFunction({
      name: 'posted'
    }).then(res => {
      return res.result[0] || ''
    })
    const candidateList = (await candidates.get()).data
    console.log(candidateList);
    this.setData({
      candidateList,
      posted
    })
    // 刷新标题栏
    this.schange({
      detail: {
        current: 0
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
    //如果已投票，提示不能再投
    if (this.data.posted) {
      //挑战任务2 取消投票提示，然后调用云函数取消投票。
      wx.showToast({
        title: '投过票不能再投！',
        icon: 'success'
      })
      return
    }
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
        wx.showToast({
          title: '投票成功',
        })
      } else {
        wx.showToast({
          title: '投票失败',
        })
      }

      // // 页面的data的当前候选人的票数加1
      // this.data.candidates[this.data.swiperCurrent].vote++

      // // this.data.posted = true
      // wx.showToast({
      //   title: '投票成功',
      // })
    }
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
    wx.reLaunch({
      url: '/' + getCurrentPages()[0].route
    })
  }

})