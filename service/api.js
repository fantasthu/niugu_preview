// 接口

import Promise from '../plugins/promise/index.js';

const trHost = 'https://tr.niuguwang.com';
const bbsHost = 'https://bbs.niuguwang.com';
const liveHost = 'https://live.niuguwang.com';

const a = Promise;

function simpleRequest({
  url,
  data,
}) {
  return new Promise((success, fail) => {
    wx.request({
      url,
      data,
      success,
      fail,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  });
}

function postRequest({
  url,
  data,
  header,
}) {
  return new Promise((success, fail) => {
    wx.request({
      url,
      data,
      success,
      fail,
      method: 'post',
      header,
    })
  })
}
module.exports = {
  /**
   * 热门资讯
   * data ={index,size}
   */
  infomationHotList(data) {
    return simpleRequest({
      url: `${trHost}/api/discoveryBbs.ashx`,
      data,
    });
  },
  /**
   * 资讯详情
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  infomationDetail(mid) {
    // return new Promise((resolve, reject) => {
    //   wx.request({
    //     url: `${bbsHost}/api/bbsgetdetailsort.ashx`,
    //     data: {
    //       mid,
    //       packtype: 0,
    //       version: 9.9,
    //       type: 0,
    //       size: 10,
    //       index: 1,
    //     },
    //     success: resolve,
    //     fail: reject,
    //   });
    // });
    return simpleRequest({
      url: `${bbsHost}/api/bbsgetdetailsort.ashx`,
      data: {
        mid,
        packtype: 0,
        version: 9.9,
        type: 0,
        size: 10,
        index: 1,
      },
    })
  },

  /**
   * 获取直播间基本信息
   *
   * @param {any} {liveId}
   */
  livingRoomBasicInfo(data) {
    return simpleRequest({
      url: `${liveHost}/video/Live/PlayLive`,
      data,
    });
  },
  /**
   * 获取主播聊天消息
   * https://live.niuguwang.com/chat/chatroom/detail?roomId=5945342&direction=-1&order=1
   */
  livingRoomTalks(data) {
    return postRequest({
      url: `${liveHost}/chat/chatroom/mastersay`,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  },
  /**
   * 获取聊天室的消息
   * https://live.niuguwang.com/chat/chatroom/detail?
   * roomId=4460838&direction=-1&order=1
   */
  livingRoomAllTalks(data) {
    return postRequest({
      url: `${liveHost}/chat/chatroom/detail`,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  },
  /**
   * 直播间发送消息
   * https://live.niuguwang.com/chat/chatroom/SendMsg
   * roomId:4460838
   * content:12
   * usertoken:yFqkAGaWTyMpqgqe4B5iApR2WqXDWpLLvS-VLxhzDsvMRTwgpnlQTTrSOe0b1OEe
   */
  sendMsg(data) {
    return postRequest({
      url: `${liveHost}/chat/chatroom/SendMsg`,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  },
  /**
   * 获取网易云信聊天室地址
   * https://live.niuguwang.com/chat/chatroom/RequestAddr?
   * roomId=4460838
   */
  getNERoomURL(data) {
    return postRequest({
      url: `${liveHost}/chat/chatroom/RequestAddr`,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  },
  /**
   * 首页直播列表
   */
  indexDiscoverLiveList() {
    return simpleRequest({
      url: `${liveHost}/video/VideoList/DiscoveryLive`
    });
  },
  // live.niuguwang.com/video/VideoList/PlayBack?
  // pagesize=2&currentpage=1&
  // usertoken=PyO8LO_wEVwvxVz1QJZOmSWo_i-VOfSRlV-Akbj7BhU*&
  // userid=14495
  /**
   * 更多精彩视频列表
   */
  moreWonderfulVideo(data) {
    return simpleRequest({
      url: `${liveHost}/video/VideoList/RecommendRecord`,
      data,
    })
  },
  /**
   * 股市课程页面接口
   */
  stockSubject(data) {
    return simpleRequest({
      url: `${liveHost}/video/VideoList/PublicCourse`,
      data,
    })
  },
  /**
   * 录播播放
   * live.niuguwang.com/video/app/PlayVideo?videoid=64&liveid=30
   * &usertoken=ss5fcOqmMRhmQ6dG6E8WFash8RHLdQ7lh2W6-SRx2QxgSMb3ymABSw**
   * &packtype=1&version=999
   */
  recordedPlay(data) {
    return simpleRequest({
      url: `${liveHost}/video/app/PlayVideo`,
      data,
    })
  },
  /**
   * 录播详情中的精品课程列表
   * live.niuguwang.com/video/app/LivePagePublicVideo?
   * usertoken=ss5fcOqmMRhmQ6dG6E8WFash8RHLdQ7lh2W6-SRx2QxgSMb3ymABSw**
   * &currentpage=1&pagesize=20&liveid=152&excludevideoid=13
   */
  goodSubjectList(data) {
    return simpleRequest({
      url: `${liveHost}/video/app/LivePagePublicVideo`,
      data,
    })
  },
  getUser(data) {
    return simpleRequest({
      url: `https://user.niuguwang.com/api_wap/weapp/weAppLogin.ashx`,
      data,
    })
  },
  getSessionKey(data) {
    return simpleRequest({
      url: `https://user.niuguwang.com/api_wap/weapp/jsCode2Session.ashx`,
      data,
    });
  },
};
