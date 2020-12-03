//index.js
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    articles: [],
    page: 1,
    more: true,
  },
  onLoad: function (options) {
    this.getArticles(this, this.data.page);
  },
  onReachBottom: function () {
    if (!this.data.more){
      return
    }
    this.getArticles(this, this.data.page);
  },
  getArticles: function (that, page) {
    
    wx.request({
      url: app.globalData.url + "/articles",
      method: 'GET',
      data: {
        page: page
      },
      success: function (res) {
        var data = res.data;
        if (data.code === 0) {
          if (data.data.length === 0) {
            that.data.more = false
            return
          } else {
            that.data.page += 1
          }
          var articles = data.data;
          // 转换时间格式
          articles.map(article => {
            article.create_time = util.formatTime(new Date(article.create_time))
            return article
          })
          var old = that.data.articles
          old = old.concat(articles)
          that.setData({articles: old});
        }
      },
      fail: function () {},
    })

  },
  
  readArticle: function (e) {
    console.log(e.currentTarget.dataset.articleId);
    wx.navigateTo({
      url:'../article/article?id='+e.currentTarget.dataset.articleId,
    })
  }
})