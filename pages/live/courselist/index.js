// 股市课程列表

import API from '../../../service/api';
const app = getApp();

Page({
  data: {
    watchLive: [], //我关注的
    recommendRecord: [], //横屏显示
    liveList: [], //推荐课程
  },
  onLoad() {
    app.loading(true);
    this.getStockSubjects();
  },
  getStockSubjects() {
    API.stockSubject({
      usertoken: app.globalData.userInfo.userToken,
      packtype: 214,
    }).then((res) => {
      this.setData({
        watchLive: res.data.data.watchLive,
        recommendRecord: res.data.data.recommendRecord,
        liveList: res.data.data.liveList,
      });
      app.loading(false);
    })
  },
  goPreviousList() {
    app.go('../../live/previous-list/index');
  },
  goLivingRoom() {
    app.go('../living-room/index');
  },
  goVideoRoom(e) {
    const data = e.currentTarget.dataset.key;
    app.go(`../video-room/index?liveid=${data.liveId}&videoid=${data.videoId}&livename=${data.liveName}`);
  },
  goRoom(e) {
    const data = e.currentTarget.dataset.key;
    if (data.liveType) {
      if (data.liveType === "0") {
        app.go(`../living-room/index?title=${data.liveTitle}&liveid=${data.liveId}`);
      } else if (data.liveType === "1") {
        app.go(`../living-room/index?title=${data.liveTitle}&liveid=${data.liveId}`);
      } else if (data.liveType === "2") {
        app.go(`../living-room/index?title=${data.liveTitle}&liveid=${data.liveId}`);
      }
    }
  },
});
