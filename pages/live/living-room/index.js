// 直播间
import API from '../../../service/api';
import Utils from '../../../utils/util';

import Chatroom from '../../../plugins/NIM/NIM_Web_Chatroom_v3.4.2-beta';
import Promise from '../../../plugins/promise/index';
import {
  toImgUrl,
} from '../../../utils/emoji.js';

const app = getApp();

Page({
  data: {
    list: [],
    // 0 - 只看直播
    // 1 - 全部聊天
    tabIndex: 0,
    msg: '',
    selfName: null,
    liveid: '',
    accId: '',
    podCast: null,
    podTalks: [],
    podAllTalks: [],
    podId: 0,
    allId: 0,
    podCurrent: 0,
    allCurrent: 0,
    chatRoomId: null,
    chatRoom: {},
    btnStatus: false,
    scrollToView: {
      anchor: '',
      chat: '',
    },
    // 是否显示过 全部聊天列表
    hasDisplayed: false
  },
  onLoad(ops) {
    this.init(ops);
    // 获取直播间基础信息
    this.getPodCastInfo();
  },
  onUnload() {
    if (this.chatRoomInstance) {
      this.chatRoomInstance.disconnect();
    }
  },
  getPodCastInfo() {
    const that = this;
    API.livingRoomBasicInfo({
      liveid: this.data.liveid,
      usertoken: app.globalData.userInfo.userToken,
    }).then((res) => {
      that.setData({
        podCast: res.data.data,
        chatRoomId: res.data.data.chatRoomId,
        chatToken: res.data.data.chatToken,
        accId: res.data.data.accId,
      });
      return res.data.data;
    }).then((res) => {
      // 获取直播间聊天信息
      this.getTalksInfo(res);
      // 初始化聊天室
      this.initChatRoom();
    });
  },
  getTalksInfo() {
    // 只看主播聊天
    this.getPodTalks(this.data.podId);
    // 获取所以聊天
    this.getAllTalks(this.data.allId);
  },
  getPodTalks(id) {
    if (this.data.podCurrent === 2) {
      app.loading(true);
    }
    API.livingRoomTalks({
      roomId: this.data.chatRoomId,
      usertoken: app.globalData.userInfo.userToken,
      direction: -1,
      order: 1,
      id: id,
    }).then((inres) => {
      let list = inres.data.result === 1 ? inres.data['im_data'] : [];
      if (list[0].id === this.data.id) {
        return;
      }
      this.setData({
        podId: list[0].id,
      });
      this.replyFormat(list);
      this.setData({
        podTalks: [...list.map((item) => {
          let time = new Date((+item.sendTime) * 1000);
          let timestr = [time.getHours(), time.getMinutes()].map(Utils.formatNumber).join(":")
          item.sendTime = timestr;
          return item;
        }).filter(item => {
          return item.contentFormat[0].content && item.contentFormat[0].content.indexOf('查看详情') < 0;
        }), ...this.data.podTalks]
      });

      if (this.data.podCurrent === 2) {
        app.loading(false);
        this.anchorListScrollToBottom([...this.data.podTalks.splice(0, list.length)]);
      }

      if (this.data.podCurrent === 0) {
        this.anchorListScrollToBottom(this.data.podTalks);
      }
      this.setData({
        podCurrent: 2
      });
    });
  },
  getAllTalks(id) {
    if (this.data.allCurrent === 2) {
      app.loading(true);
    }
    API.livingRoomAllTalks({
      roomId: this.data.chatRoomId,
      usertoken: app.globalData.userInfo.userToken,
      direction: -1,
      order: 1,
      id: id,
    }).then((inres) => {
      let list = inres.data.result === 1 ? inres.data['im_data'] : [];
      this.setData({
        allId: list[0].id,
      });
      this.replyFormat(list);

      this.setData({
        podAllTalks: [...list.map((item) => {
          let time = new Date((+item.sendTime) * 1000);
          let timestr = [time.getHours(), time.getMinutes()].map(Utils.formatNumber).join(":")
          item.sendTime = timestr;
          return item;
        }).filter(item => {
          return item.contentFormat[0].content && item.contentFormat[0].content.indexOf('查看详情') < 0;
        }), ...this.data.podAllTalks]
      });
      if (this.data.allCurrent === 2) {
        app.loading(false);
        this.chatListScrollToBottom([...this.data.podAllTalks.splice(0, list.length)]);
      }
      if (this.data.allCurrent === 0) {
        this.chatListScrollToBottom(this.data.podAllTalks);
      }
      this.setData({
        allCurrent: 2
      });
    });
  },
  podCastupper(e) {
    console.debug('upper', e);
    this.getPodTalks(this.data.podId);
  },
  podCastlower(e) {
    console.debug('lower', e);
  },
  allTalksUpper(e) {
    this.getAllTalks(this.data.allId);
  },
  allTalksLower() {

  },
  getMessage(e) {
    this.data.msg = e.detail.value;
    if (this.data.msg.trim() === '') {
      this.setData({
        btnStatus: false,
      })
    } else {
      this.setData({
        btnStatus: true,
      })
    }
  },
  formReset() {
    const that = this;
    if (this.data.msg.trim() === '') {
      return;
    }
    this.setData({
      btnStatus: false,
    });
    API.sendMsg({
      content: that.data.msg,
      roomId: that.data.chatRoomId,
      usertoken: app.globalData.userInfo.userToken,
    }).then((res) => {
      if (res.data.result != 1) {
        return;
      }
      const myInfo = res.data.im_msg;
      // 处理时间
      let time = new Date((+myInfo.sendTime) * 1000);
      let timestr = [time.getHours(), time.getMinutes()].map(Utils.formatNumber).join(":")
      myInfo.sendTime = timestr;
      // 处理回调消息
      that.handleReply(myInfo);
      // 反应到界面上
      this.setData({
        podAllTalks: [...this.data.podAllTalks, myInfo]
      })
      that.data.msg = '';
    });

    // 滚动到底部
    this.chatListScrollToBottom(this.data.podAllTalks);
  },
  getchatroomAddresses(
    roomId,
    usertoken
  ) {
    return API.getNERoomURL({
      roomId,
      usertoken,
    });
  },
  initChatRoom() {
    app.loading(true);
    const that = this;
    this.getchatroomAddresses(this.data.chatRoomId, app.globalData.userInfo.userToken).then((res) => {
      if (res.data.result === 0) {
        console.error('error->获取房间地址失败', res);
        return;
      }
      console.debug('返回直播间信息', this.data.chatToken, this.data.accId, this.data.chatRoomId, res.data.im_addr);
      that.chatRoomInstance = Chatroom.getInstance({
        appKey: '3b95e461fd9bbc17dc72e638d5a5fcf8',
        account: this.data.accId,
        token: this.data.chatToken,
        chatroomId: this.data.chatRoomId,
        chatroomAddresses: ['wlnimsc1.netease.im:443'],
        onconnect: onChatroomConnect,
        onerror: onChatroomError,
        onwillreconnect: onChatroomWillReconnect,
        ondisconnect: onChatroomDisconnect,
        // 消息
        onmsgs: onChatroomMsgs,
      });

      function onChatroomConnect(chatroomInfo) {
        app.loading(false);
        console.debug('onChatroomConnect-进入聊天室', chatroomInfo);
      }

      function onChatroomMsgs(msgs) {
        console.debug('msgs', msgs);
        msgs = msgs.filter((item) => {
          return item.fromNick != app.globalData.userInfo.userName;
        })
        msgs.map((item) => {
          if (item.content) {
            const cusInfo = JSON.parse(item.custom);
            // 处理时间
            let time = new Date((+cusInfo.sendTime) * 1000);
            let timestr = [time.getHours(), time.getMinutes()].map(Utils.formatNumber).join(":")
            cusInfo.sendTime = timestr;
            // 处理回调消息
            that.handleReply(cusInfo);
            that.setData({
              podAllTalks: [...that.data.podAllTalks, cusInfo]
            });
          }
        });
        that.chatListScrollToBottom(that.data.podAllTalks);
      }

      function onChatroomError() {
        console.debug('onChatroomError-发生错误', error, obj);
      }

      function ChatroomMsgs() {
        console.debug('onChatroomMsgs-收到聊天室消息', msgs);
      }

      function onChatroomWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连', obj);
        app.loading(true, '重连中...');
      }

      function onChatroomDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.debug('onChatroomDisconnect-连接断开', error);

        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
              break;
              // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              break;
            default:
              break;
          }
        }
      }
    });
  },
  handleReply(data) {
    if (data.contentFormat[0].type === 2) {
      data.display = [{
        content: data.contentFormat[0].src,
        height: data.contentFormat[0].height,
        type: 'image',
      }];
    } else {
      data.display = data.contentFormat[0].content.split(/(\[[0-9a-f]{4,5}\])/g).filter((ditem) => {
        return ditem;
      }).map((emoji) => {
        const content = toImgUrl(emoji);
        const obj = {
          content,
          type: 'content',
        };
        if (content.indexOf('i0.niuguwang') > 0) {
          obj.type = 'emoji';
        }
        return obj;
      });
    }
  },
  init(ops) {
    this.setData({
      selfName: app.globalData.userInfo.userName,
      liveid: ops.liveid,
    })
    wx.setNavigationBarTitle({
      title: ops.title,
    });
  },
  changeTab(e) {
    const key = e.currentTarget.dataset.key || 0;
    this.setData({
      tabIndex: key,
    });
    if (key === '1' && !this.data.hasDisplayed) {
      this.setData({
        hasDisplayed: true,
      });
      this.chatListScrollToBottom(this.data.podAllTalks);
    }
  },
  /**
   * 渲染只看主播列表
   */
  renderAnchorList() {

  },

  renderChatList() {

  },
  anchorListScrollToBottom(list) {
    setTimeout(() => {
      this.setData({
        scrollToView: Object.assign(this.data.scrollToView, {
          anchor: `item-${list.length-1}`,
        }),
      });
    }, 10);

  },
  chatListScrollToBottom(list) {
    this.setData({
      scrollToView: Object.assign(this.data.scrollToView, {
        chat: `item-${list.length-1}`,
      }),
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
      if (item.contentFormat[0].type === 2) {
        item.display = [{
          content: item.contentFormat[0].src,
          height: item.contentFormat[0].height,
          type: 'image',
        }];
      } else {
        item.display = item.contentFormat[0].content.split(/(\[[0-9a-f]{4,5}\])/g).filter((ditem) => {
          return ditem;
        }).map((emoji) => {
          const content = toImgUrl(emoji);
          const obj = {
            content,
            type: 'content',
          };
          if (content.indexOf('i0.niuguwang') > 0) {
            obj.type = 'emoji';
          }
          return obj;
        });
      }
    });
  },
});
