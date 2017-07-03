//  热点资讯

import API from '../../../service/api.js';
import {
  toImgUrl,
} from '../../../utils/emoji.js';

const app = getApp();
const brReg = /\↵+|\r+|\n+|(\r\n)+/g;

Page({
  data: {
    detailId: 0,
    list: [],
  },
  onLoad(ops) {
    app.loading(true);
    this.initDetail(ops);
  },
  initDetail(ops) {
    this.setData({
      detailId: ops.id,
    });
    API.infomationDetail(ops.id).then((res) => {
      app.loading(false);
      this.renderPage(res.data);
    }, (err) => {
      console.log(err);
      wx.showToast({
        title: '加载失败',
      });
    });
  },
  renderPage(res) {
    const page = {
      content: {},
    };
    if (!res || !res.data) {
      return;
    }

    page.title = res.title || '';

    page.content = res.data[0];
    // 处理page.content数据
    this.handlerContent(page.content);

    page.replyList = res.data.splice(1);
    this.replyFormat(page.replyList);

    this.setTitle(page.title);

    this.setData({
      page,
    });
  },
  handlerContent(data) {
    // 获取屏幕的宽高比
    const res = wx.getSystemInfoSync();
    console.debug('设备信息', res);
    data.contentFormat.map((item) => {
        if (item.__type === 'Image') {
          const wid = item.width;
          item.width = (res.windowWidth-30) + 'px';
          item.height = item.height * res.windowWidth / wid + 'px';
      }
      return item;
    });
},
setTitle(title) {
  wx.setNavigationBarTitle({
    title,
  });
},
/**
 * 处理回复内容中的表情
 *
 * @param {any} list
 * @returns
 */
replyFormat(list) {
  if (!list) {
    return;
  }

  list.map((item) => {
    // item.display = toImg(item.content);
    item.display = item.content.split(/(\[[0-9a-f]{4,5}\])/g).filter((ditem) => {
      return ditem;
    }).map((emoji) => {
      const content = toImgUrl(emoji);
      const obj = {
        content,
        type: 'content',
      };
      if (content.indexOf('i0.niuguwang') > 0) {
        obj.type = 'image';
      }
      return obj;
    });
  });
},
});
