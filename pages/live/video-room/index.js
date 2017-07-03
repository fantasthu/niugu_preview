// 视屏播放页面
import API from '../../../service/api';
const app = getApp();

Page({
  data: {
    params: {},
    detailData: null,
    pagesize: 20,
    currentpage: 1,
    list: [],
    noMore: false,
  },
  onLoad(data) {
    this.init(data);
    // 回放详情
    this.getDetailInfo();
    // 精品课程列表
    this.getGoodSubjectList();
  },
  getDetailInfo() {
    API.recordedPlay({
      videoid: this.data.params.videoid,
      liveid: this.data.params.liveid,
      usertoken: app.globalData.userInfo.userToken,
      packtype: 1,
      version: 999,
    }).then((res) => {
      this.setData({
        detailData: res.data.data,
      });
    });
  },
  getGoodSubjectList() {
    app.loading(true);
    API.goodSubjectList({
      excludevideoid: this.data.params.videoid,
      liveid: this.data.params.liveid,
      usertoken: app.globalData.userInfo.userToken,
      currentpage: this.data.currentpage,
      pagesize: this.data.pagesize,
    }).then((res) => {
      if (res.data.data.length === 0) {
        this.setData({
          noMore: true
        });
        wx.showToast({
          title: '没有更多!'
        });
        return;
      }
      this.setData({
        list: [...this.data.list, ...res.data.data],
      });
      app.loading(false);
    });
  },
  init(data) {
    this.setData({
      params: data,
    });
    wx.setNavigationBarTitle({
      title: data.livename,
    });
  },
  /**
   * 滑动到底部加载更多
   */
  onReachBottom() {
    console.log('加载了更多.......');

  },
  lower(e) {
    if (this.data.noMore) {
      return;
    }
    this.setData({
      currentpage: this.data.currentpage + 1,
    });
    this.getGoodSubjectList();
  },
  goVideoRoom(e) {
    const data = e.currentTarget.dataset.key;
    app.go(`../video-room/index?liveid=${data.mainId}&videoid=${data.videoid}&livename=${data.title}`);
  },
});
