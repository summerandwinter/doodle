//index.js
//获取应用实例
const app = getApp()

Page({
  data: {  
    points: [] 
  },
  lastLoc: {},
  curLoc: {},
  isDrawing: false,
  lineWidth: 2,
  globalAlpha: 1,
  strokeStyle: "rgb(0,0,0)",
  lastTime : 0,
  ctx:null,
  touchstart: function(e){
    var point = { x: e.touches[0].x, y: e.touches[0].y};
    this.beginStroke(point);
  },
  touchmove: function(e){
    var point = { x: e.touches[0].x, y: e.touches[0].y };
    if(this.isDrawing)
      this.moveStroke(point);
  },
  touchend: function(e){
    this.endStroke();
  },
  touchcancel: function(e){
    this.endStroke();
  },
  beginStroke:function (point){  
    this.isDrawing = true
    this.lastLoc = point; //上一次坐标位置  
    this.lastTime = new Date().getTime();  
  
  },  
   endStroke:function () {
     this.isDrawing = false;
  },  
  moveStroke:function (point) {
    
    this.ctx.setLineJoin('round');
    this.ctx.setLineCap('round');
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastLoc.x, this.lastLoc.y);
    this.ctx.setGlobalAlpha(this.globalAlpha);
    this.ctx.setStrokeStyle(this.strokeStyle);
    this.ctx.setLineWidth(this.lineWidth);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
    this.ctx.draw(true);
    this.lastLoc = point;
  },  
  onLoad: function () {
    this.ctx = wx.createCanvasContext('myCanvas');
    var res = wx.getSystemInfoSync();
    var width = res.windowWidth;
    var height = res.windowHeight;
    var ratio = 600 / width;
    console.log(width)
    console.log(height)
    this.setData({ width: width, height: height })
    var self = this;
    var points = this.path;

  }
})
