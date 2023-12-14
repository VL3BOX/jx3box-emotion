/**
 * @description: 骚话渲染
 * @author: Kaviilee
 * @version: 1.1.5
 */

import $ from "jquery";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { flatMapDeep } from "lodash"
const { __imgPath, __dataPath } = JX3BOX;

// 获取全部表情
function getEmotion() {
    try {
        const emotion = sessionStorage.getItem("jx3_emotion");
        if (emotion) {
            return;
        } else {
            fetch(`${__dataPath}emotion/output/catalog.json`)
                .then((response) => response.json())
                .then((data) => {
                    sessionStorage.setItem(
                        "jx3_emotion",
                        JSON.stringify(data)
                    );
                });
        }
    } catch (e) {
        fetch(`${__dataPath}emotion/output/catalog.json`)
            .then((response) => response.json())
            .then((data) => {
                sessionStorage.setItem(
                    "jx3_emotion",
                    JSON.stringify(data)
                );
            });
    }
}

getEmotion();

class JX3_EMOTION {
    /**
     * @param {string} joke 骚话字符串
     */
    constructor(joke) {
        this._joke = $.trim(joke);
        this.emotionList = [];
        this.max = 0;

        this.init();
    }

    // 初始化实例
    init() {
        this.code = this._renderHTML();

        return;
    }

    // 获取表情
    loadEmotionList() {
        const emotions = sessionStorage.getItem("jx3_emotion");
        if (emotions) {
            return JSON.parse(emotions);
        }
        return [];
    }

    _renderHTML() {
        if (this.max >= 3) {
            return this._joke;
        }
        
        this.emotionList = this.loadEmotionList();
        let str = this._joke;

        // 1. 没有表情符号，直接返回
        if (!str.includes("#")) return str;

        const emotions = flatMapDeep(this.emotionList.map(item => item.items));
        const emotionKeys = emotions.map(item => item.key);

        // 2. 获取表情符号的位置并且替换为img标签
        while (emotionKeys.some(key => str.includes(key))) {

            const _index = emotionKeys.findIndex(key => str.includes(key));

            const key = emotionKeys[_index].replace('#', '$');

            str = _index > -1 ? str.replace(emotionKeys[_index], key) : str;
        }
        // 3. 替换表情符号为img标签
        while (emotionKeys.some(key => str.includes(`${key.replace('#', '$')}`))) {

            const _index = emotionKeys.findIndex(key => str.includes(key.replace('#', '$')));

            const _emotion = emotions.find(item => item.key === emotionKeys[_index]);

            const src = _emotion ? `${__imgPath}emotion/output/${_emotion.filename}` : '';

            const key = emotionKeys[_index].replace('#', '$');

            str = src ? str.replace(key, `<img src="${src}" alt="${emotionKeys[_index]}" title="${emotionKeys[_index]}" />`) : str;
        }
        // 4. 递归 3 次，防止没获取到表情
        if (!this.emotionList.length && this.max < 3) {
            this._renderHTML();
            this.max++;
        }

        return str;
    }
}

export default JX3_EMOTION;
