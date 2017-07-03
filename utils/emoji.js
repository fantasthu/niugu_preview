// 表情处理



module.exports = {
  toImg(content) {
    return content.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
      if (!/^\d+$/g.test(group) && group.length < 6) {
        return `<image class="icon-face" src="https://i0.niuguwang.com/emoji/emoji_${group}.png" />`;
      }
      return match;
    });
  },
  toImgUrl(content) {
    return content.replace(/\[([0-9a-f]{4,5})\]/g, (match, group) => {
      if (!/^\d+$/g.test(group) && group.length < 6) {
        return `https://i0.niuguwang.com/emoji/emoji_${group}.png`;
      }
      return match;
    });

  },
  toEmoji(content) {
    let result = content.replace(/&nbsp;/g, ' ').trim();
    result = result.replace(/<br>/g, '\n');
    result = result.replace(/<image[^>]+?([a-zA-Z0-9]{4,5}(?=\.png))[^>]*>/g, (match, key) => {
      return `[${key}]`;
    });

    return result;
  },
};
