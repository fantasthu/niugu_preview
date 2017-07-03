//index.js
//获取应用实例
import API from '../../service/api.js';


import Promise from '../../plugins/promise/index.js';

const app = getApp();

Page({
  data: {
    liveData: [],
    infoList: [],
    loadingTip: false,
    infoPageIndex: 1,
    infoPageSize: 10,
  },
  //事件处理函数
  bindViewTap: function () {},
  onLoad() {
    app.getUserInfo().then((res) => {
    });
    this.getIndexLives();
    this.getInfoList();
  },
  /**
   * 页面滑动到底部
   * @return {[type]} [description]
   */
  onReachBottom() {
    this.loadMore();
  },
  getIndexLives() {
    API.indexDiscoverLiveList().then((res) => {
      this.setData({
        liveData: res.data.data,
      });
    })
  },
  getInfoList() {
    API.infomationHotList({
      index: this.data.infoPageIndex,
      size: this.data.infoPageSize,
    }).then((res) => {
      if (res.data && res.data.code === 0) {
        this.setData({
          infoList: [...this.data.infoList, ...res.data.bbsRecommend],
        });
      }
      this.setData({
        loadingTip: false,
      });

    }, (err) => {
      console.error('er', err);
    });
  },
  loadMore() {
    if (this.data.loadingTip) {
      return;
    }
    this.setData({
      loadingTip: true,
      infoPageIndex: this.data.infoPageIndex + 1
    });
    this.getInfoList();
  },
  goCourseList() {
    app.go('../live/courselist/index');
  },
  goInfoDetail(e) {
    const id = e.currentTarget.dataset.id || '';
    if (id) {
      app.go(`../information/detail/index?id=${id}`);
    }
  },
  /**
   * 进入直播间
   *
   * @param {any} e
   */
  goLivingRoom(e) {
    const data = e.currentTarget.dataset.key;
    if (data.showType === "1") {
      app.go(`../live/living-room/index?title=${data.liveTitle}&liveid=${data.liveId}`);
    } else if (data.showType === "2") {
      app.go(`../live/living-room/index?title=${data.liveTitle}&liveid=${data.liveId}`);
    } else if (data.showType === "3") {
      app.go(`../live/video-room/index?livename=${data.liveTitle}&liveid=${data.liveId}&videoid=${data.videoId}`);
    }
  }
});
