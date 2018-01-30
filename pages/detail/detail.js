var util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
const Doodle = require('../../model/doodle');
const app = getApp()

Page({
  data: {
    points:[]

  },
  path:[],
  lastTime: 0,
  isEmptyObject: function (obj) {
    for (var key in obj) {
      return false;//返回false，不为空对象
    }
    return true;//返回true，为空对象
  },
  requestAnimationFrame2: function (callback, element) {

    var id = setTimeout(function () { callback(); }, 0);

  },
  requestAnimationFrame: function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
    var id = setTimeout(function () { callback(currTime + timeToCall); },
      timeToCall);
    this.lastTime = currTime + timeToCall;
    return id;
  },
  cancelAnimationFrame: function (id) {
    clearTimeout(id);
  },
  renderCanvas: function(){
    const ctx = wx.createCanvasContext('myCanvas');
    var res = wx.getSystemInfoSync();
    var width = res.windowWidth;
    var height = res.windowHeight;
    var ratio = 600 / width;
    console.log(width)
    console.log(height)
    this.setData({ width: width, height: height })
    var self = this;
    var points = this.path;
    ctx.setLineJoin('round');
    ctx.setLineCap('round');
    var i = 0;
    var j = 0;
    (function loop() {


      if (!self.isEmptyObject(points[i].lines[j].e)) {
        ctx.beginPath();
        ctx.moveTo(points[i].lines[j].s.x / ratio, points[i].lines[j].s.y / ratio);
        ctx.setGlobalAlpha(points[i].a);
        ctx.setStrokeStyle(points[i].c);
        ctx.setLineWidth(points[i].l / ratio);
        ctx.lineTo(points[i].lines[j].e.x / ratio, points[i].lines[j].e.y / ratio);
        ctx.stroke();
        ctx.draw(true);
      }

      //console.log(i + "-" + j);
      j++;
      if (j == points[i].lines.length) {
        i++;
        j = 0;
      }
      if (i < points.length && j < points[i].lines.length) self.requestAnimationFrame(loop);
    })();
  },
  initData: function (id) {
    var that = this;
    var param = {};
    param['id'] = id;
    console.log(id);
    wx.showLoading({
      title: '加载中',
    })
    AV.Cloud.run('detail', param).then(function (result) {
      console.log('获取首页数据');
      // 调用成功，得到成功的应答 data
      wx.hideLoading();
      if (result.code == 200) {
        that.path = result.data.path;
        that.setData({
          //'points': result.data.path,
          'loading.hidden': true,
          'content.hidden': false,
          'notfound.hidden': true
        })
        that.renderCanvas()
      } else if (result.code == 101) {
        //数据不存在
        that.setData({
          'loading.hidden': true,
          'content.hidden': true,
          'notfound.hidden': false
        })
      }

    }, function (err) {
      // 处理调用失败
      that.setData({
        'loading.hidden': true,
        'content.hidden': true,
        'notfound.hidden': false,
        'notfound.tips': '网络出了点问题，重新打开试试'
      })
    });
  },
  onLoad: function (option) {
    var that = this;
    if (option.id) {
      that.setData({ id: option.id })
      that.initData(option.id);

    }
    
  }
})
