//app.js
import Promise from './plugins/promise/index.js';
import API from './service/api.js';

const gio = require('vds-mina.js');

initGrowingIO();

App({
  onLaunch: function () {},
  getUserInfo() {
    const that = this;
    this.loading(true);
    return new Promise((resolve) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo);
      } else {
        wx.login({
          success: (data) => {
            console.debug('获取用户登录信息',data);
            wx.getUserInfo({
              success: (res) => {
                // 获取用户登录信息
                that.getUser(data.code, res);
              }
            });
          }
        });
      }
    });
  },
  getUser(code, originData) {
    const that = this;
    // 获取sessionKey
    this.getSessionKey(code).then((key) => {
      API.getUser({
        encryptedData: originData.encryptedData,
        iv: originData.iv,
        sessionKey: key,
      }).then((res) => {
        this.loading(false);
        console.debug('getUser', res);
        that.globalData.userInfo = res.data.userInfo;
      });
    });
  },
  getSessionKey(code) {
    return new Promise((resolve) => {
      API.getSessionKey({
        code
      }).then((res) => {
        if (res.data.result === 1) {
          resolve(res.data.dataInfo.sessionKey);
        } else {
          console.error('error,获取sessionkey失败', res);
        }
      });
    });
  },
  globalData: {
    userInfo: null,
    chatRoomInstance:null,
  },
  go(name) {
    wx.navigateTo({
      url: name,
    });
  },
  loading(isShow, txt) {
    if (isShow) {
      wx.showToast({
        title: txt || '加载中',
        icon: 'loading',
        duration: 10000,
      });
    } else {
      wx.hideToast();
    }
  },
});

/**
 * 初始化GrowingIO 代码统计
 */
function initGrowingIO() {
  gio.projectId = '牛股王';
  gio.appId = 'wxc4cc0dc90d37decc';
}
