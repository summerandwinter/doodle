//explore.js
//获取应用实例
var util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
const Doodle = require('../../model/doodle');
var app = getApp()
Page({
  data: {
    loading: {
      hidden: false
    },
    userInfo: {},
    cates: [],
    info: {
      list: [],
      hasMore: true,
      hasRefesh: true,
      page: 1,
      count: 10,
      total: 0,
      hidden: true
    },
    isLoading: false
  },
  tap: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('点击卡片' + id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  onPullDownRefresh: function (e) {
    console.log(e);
    var that = this;
    wx.stopPullDownRefresh();
    that.initData();
  },
  onReachBottom: function (e) {
    var that = this;
    console.log('加载第' + that.data.info.page + '页')
    this.loadData();
  },
  loadData: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    if (that.data.info.hasMore) {
      if (!that.data.isLoading && that.data.loading.hidden) {
        that.setData({ 'isLoading': true });
        var page = that.data.info.page;
        var data = { 'page': page };
        wx.hideLoading();
        AV.Cloud.run('explore', data).then(function (result) {
          // 调用成功，得到成功的应答 data
          console.log(result)
          if (result.code == 200) {
            that.setData({
              'isLoading': false,
              'info.page': page + 1,
              'info.hasMore': result.hasMore,
              'info.list': that.data.info.list.concat(result.data),
              'info.hidden': false
            })
          } else {
            that.setData({ 'isLoading': false });
          }
        }, function (err) {
          // 处理调用失败
          that.setData({ 'isLoading': false });
        });
      }

    } else {
      console.log('no more data');
    }
  },
  initData: function () {
    var that = this;
    var initParam = {
      loading: {
        hidden: false
      },
      userInfo: {},
      cates: [],
      info: {
        list: [],
        hasMore: true,
        hasRefesh: true,
        page: 1,
        count: 10,
        total: 0,
        hidden: true
      },
      isLoading: false
    }
    that.setData(initParam);
    var page = that.data.info.page;
    var data = { 'page': page }
    AV.Cloud.run('explore', data).then(function (result) {
      // 调用成功，得到成功的应答 data
      console.log(result)
      if (result.code == 200) {
        that.setData({
          'info.page': page + 1,
          'info.hasMore': result.hasMore,
          'loading.hidden': true,
          'info.list': that.data.info.list.concat(result.data),
          'info.hidden': false
        })
      }
    }, function (err) {
      // 处理调用失败
    });
  },
  onLoad: function () {
    console.log('生命周期:explore-load')
    var res = wx.getSystemInfoSync();
    var width = res.windowWidth;
    var height = res.windowHeight;
    this.setData({ width: width, height: height })
    var that = this;
    util.showShareMenu();
    //数据加载
    this.initData();
  },
  onReady: function () {
    console.log('生命周期:explore-ready');
  },
  onShow: function () {

    console.log('生命周期:explore-show');
  },
  onHide: function () {
    console.log('生命周期:explore-hide');
  },
  onUnload: function () {
    console.log('生命周期:explore-unload');
  }
})
