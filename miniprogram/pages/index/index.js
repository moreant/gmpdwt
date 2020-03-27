// ufo 全局变量
var ufo = false;

Page({
  submit(e) {
    const money = e.detail.value.money - 0
    var ssf = 0;
    if (money <= 10000) {
      ssf = 50;
    } else if (money <= 100000 && money > 10000) {
      ssf = (0.025 * money - 200);
    } else if (money <= 200000 && money > 100000) {
      ssf = 0.02 * money + 300;
    } else if (money <= 500000 && money > 200000) {
      ssf = 0.015 * money + 1300;
    } else if (money <= 1000000 && money > 500000) {
      ssf = 0.01 * money + 3800;
    } else if (money <= 2000000 && money > 1000000) {
      ssf = 0.009 * money + 4800;
    } else if (money <= 5000000 && money > 2000000) {
      ssf = 0.008 * money + 6800;
    } else if (money <= 10000000 && money > 5000000) {
      ssf = 0.007 * money + 11800;
    } else if (money <= 20000000 && money > 10000000) {
      ssf = 0.006 * money + 21800;
    } else if (money > 20000000) {
      ssf = 0.005 * money + 41800;
    }
    // 如果外星人开关开启，诉讼费双倍 
    if (ufo) {
      ssf *= 2
    }
    this.setData({
      fei1: ssf.toFixed(2),
      fei2: (ssf * 0.5).toFixed(2)
    })
  },
  // 外星人开关时间处理
  ufo(e) {
    ufo = e.detail.value
  },
  reset(e) {
    console.log(2);
    this.setData({
      fei1: 0,
      fei2: 0
    })
  },
  data: {
    ufo: false,
    fei1: 0,
    fei2: 0,
  },

  onLoad: function () {}
})