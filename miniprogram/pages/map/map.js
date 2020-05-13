Page({
  data: {
    latitude: 23.3882,
    longitude: 113.4490,
    markers: [{
      iconPath: '/images/navi.png',
      id: 0,
      latitude: 23.3882,
      longitude: 113.4490,
      width: 50,
      height: 50
    }]

  },
  markertap: function() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: '马沥大酒店',
      address: '广州市白云区马沥路'
    })
  }
})