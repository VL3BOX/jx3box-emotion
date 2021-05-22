/**
 * @description: 骚话渲染
 * @author: Kaviilee
 * @version: 1.0.0
 */

import $ from "jquery"
import emotions from "@jx3box/jx3box-data/data/jokes/default.json"
import {__imgPath} from '@jx3box/jx3box-common/data/jx3box.json'

class JX3_EMOTION {
  /**
   * @param {string} joke 骚话字符串
   */
  constructor(joke) {
    this._joke = $.trim(joke);

    this.init()
  }

  // 初始化实例
  init() {

    this.code = this._renderHTML()

    return
  }

  _renderHTML() {

    let str = this._joke;

    const emotionKeys = Object.keys(emotions);

    const regex_1 = /(#[\u4e00-\u9fa5]{1})/g;
    const regex_2 = /(#[\u4e00-\u9fa5]{2})/g;
    const regex_3 = /(#[\u4e00-\u9fa5]{3})/g;


    const _initEmotions = (data) => {
      const keys = Object.keys(data);
  
      const obj = {}
  
      keys.forEach(key => {
        const pathKey = key.slice(1)
        const imgPath = __imgPath + `image/emotion/${pathKey}.gif`
  
        obj[key] = imgPath
      })
  
      return obj
    }
  

    const replacer = (str) => {
      let _emotions = _initEmotions(emotions);
      return `<img src="${_emotions[str]}" />`
    }

    const emotion_1 = str.match(regex_1) ? str.match(regex_1).filter(emotion => emotionKeys.includes(emotion)) : [];
    emotion_1.forEach(emotion => str = str.replace(emotion, replacer));
    const emotion_2 = str.match(regex_2) ? str.match(regex_2).filter(emotion => emotionKeys.includes(emotion)) : [];
    emotion_2.forEach(emotion => str = str.replace(emotion, replacer));
    const emotion_3 = str.match(regex_3) ? str.match(regex_3).filter(emotion => emotionKeys.includes(emotion)) : [];
    emotion_3.forEach(emotion => str = str.replace(emotion, replacer));

    return `
      <div style="display:flex;align-content: baseline;">
        ${str}
      </div>
    `
  }
}

export default JX3_EMOTION;