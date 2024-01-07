/**
 * @description: 骚话渲染
 * @author: Kaviilee
 * @version: 1.2.6
 */

import $ from "jquery";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import {
    flatMapDeep
} from "lodash"
const {
    __imgPath,
    __dataPath
} = JX3BOX;

// 获取全部表情
async function getEmotion() {
    const emotion = sessionStorage.getItem("jx3_emotion");
    if (emotion) {
        return JSON.parse(emotion);
    } else {
        const data = await fetch(`${__dataPath}emotion/output/catalog.json`).then((response) => response.json());
        sessionStorage.setItem("jx3_emotion", JSON.stringify(data));
        return data;
    }
}

class JX3_EMOTION {
    /**
     * @param {string} joke 骚话字符串
     */
    constructor(joke) {
        this._joke = $.trim(joke);
        this.emotionList = [];
        this.max = 0;
    }

    // 获取表情
    async loadEmotionList() {
        const emotionList = await getEmotion();
        this.emotionList = emotionList;
    }

    async _renderHTML() {
        let str = this._joke;

        // 如果没有表情符号，直接返回
        if (!str.includes("#")) return str;

        for (let i = 0; i < 3; i++) {

            await this.loadEmotionList();

            const emotions = flatMapDeep(this.emotionList.map(item => item.items));
            const emotionKeys = emotions.map(item => item.key);

            // 获取表情符号的位置并且替换为img标签
            while (emotionKeys.some(key => str.includes(key))) {
                const _index = emotionKeys.findIndex(key => str.includes(key));
                const key = emotionKeys[_index].replace('#', '$');
                str = _index > -1 ? str.replace(emotionKeys[_index], key) : str;
            }
            // 替换表情符号为img标签
            while (emotionKeys.some(key => str.includes(`${key.replace('#', '$')}`))) {
                const _index = emotionKeys.findIndex(key => str.includes(key.replace('#', '$')));
                const _emotion = emotions.find(item => item.key === emotionKeys[_index]);
                const src = _emotion ? `${__imgPath}emotion/output/${_emotion.filename}` : '';
                const key = emotionKeys[_index].replace('#', '$');
                str = src ? str.replace(key, `<img src="${src}" alt="${emotionKeys[_index]}" title="${emotionKeys[_index]}" />`) : str;
            }

            // 如果已经获取到表情列表，就跳出循环
            if (this.emotionList.length) break;
        }

        return str;
    }
}

export default JX3_EMOTION;
