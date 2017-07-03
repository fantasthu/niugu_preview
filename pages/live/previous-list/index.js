/**
 * 精彩回放
 */
import API from '../../../service/api';
const app = getApp();

Page({
  data: {
    list: [],
    pageSize: 20,
    currentpage: 1,
  },
  onLoad() {
    this.getPlayBacks();
  },
  getPlayBacks() {
    API.moreWonderfulVideo({
      pagesize: this.data.pageSize,
      currentpage: this.data.currentpage,
    }).then((res) => {
      this.setData({
        loadingTip:false,
      });
      this.setData({
        list: [...this.data.list, ...res.data.data],
      });
    });
  },
  onReachBottom() {
    if (this.data.loadingTip) {
      return;
    }
    this.setData({
      loadingTip: true,
      infoPageIndex: this.data.currentpage + 1
    });
    this.getPlayBacks();
  },
  goVideoRoom(e) {
    const data = e.currentTarget.dataset.key;
    app.go(`../video-room/index?liveid=${data.liveId}&videoid=${data.videoId}&livename=${data.liveName}`);
  },

});
