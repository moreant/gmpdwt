
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    memberCount: 1,
    roomLimit: 3,
    templateInfo: {
      parameterList: [{
        name: 'member_count',
        value: '2'
      }, {
        name: 'room_limit',
        value: '4'
      }]
    }
  },

  onLoad(options) {
    console.log("options", options);
    if (JSON.stringify(options) != "{}") {
      this.setData({
        activityId: options.activityId,
        memberCount: Number(options.memberCount) + 1,
        roomLimit: Number(options.roomLimit)
      })
      let { activityId, memberCount, roomLimit } = this.data
      console.log("options.activityId:", activityId);
      wx.cloud.callFunction({
        name: "setUpdatableMsgUpdate",
        data: {
          activityId, memberCount, roomLimit
        }
      })
    }
  },


  async onShow(e) {
    const { shareTicket } = getApp().globalData
    let { activityId, templateInfo, memberCount, roomLimit, } = this.data
    if (shareTicket) {
      console.log("shareTicket", shareTicket)
      const cloudID = (await wx.getShareInfo({
        shareTicket,
      })).cloudID
      console.log("cloudID", cloudID)
      const groupId = (await wx.cloud.callFunction({
        name: 'showCloudID',
        data: {
          shareData: wx.cloud.CloudID(cloudID)
        }
      })).result.shareData.data.openGId
      this.setData({
        groupId
      })
    }
    if (!activityId) {
      activityId = (await wx.cloud.callFunction({
        name: 'createActivityId'
      })).result.activityId
      console.log("activityId", activityId);

      this.setData({ activityId })
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    templateInfo.parameterList[0].value = memberCount + ''
    templateInfo.parameterList[1].value = roomLimit + ''
    wx.updateShareMenu({
      withShareTicket: true,
      isUpdatableMessage: true,
      activityId,
      templateInfo
    })
  },

  onShareAppMessage(e) {
    const { activityId, memberCount, roomLimit } = this.data
    return {
      title: '动态分享消息',
      path: '/pages/index/index?activityId=' + activityId +
        "&memberCount=" + memberCount +
        "&roomLimit=" + roomLimit
    }
  },

  async end(e) {
    wx.showLoading({
      title: '结束中',
      mask: true
    })
    const result = (await wx.cloud.callFunction({
      name: 'setUpdatableMsgEnd',
      data: {
        path: '/pages/index/index',
        activityId: this.data.activityId
      }
    })).result
    if (result.errCode === 0) {
      wx.showToast({
        title: '结束成功',
      })
    } else {
      wx.showToast({
        title: '结束失败' + JSON.stringify(res),
      })
      this.setData({ error: JSON.stringify(result) })
    }
  }
})