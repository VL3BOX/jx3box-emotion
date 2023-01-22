/**
 * @description: 骚话渲染
 * @author: Kaviilee
 * @version: 1.0.0
 */

import $ from "jquery";
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { flatMapDeep } from "lodash"

class JX3_EMOTION {
    /**
     * @param {string} joke 骚话字符串
     */
    constructor(joke) {
        this._joke = $.trim(joke);
        this.emotionList = [];

        this.loadEmotionList();

        this.init();
    }

    // 初始化实例
    init() {
        this.code = this._renderHTML();

        return;
    }

    // 获取全部表情
    loadEmotionList() {
        try {
            const emotion = sessionStorage.getItem("jx3_emotion");
            if (emotion) {
                this.emotionList = JSON.parse(emotion);
                return;
            } else {
                this.emotionList = [];
            }
        } catch (e) {
            this.emotionList = [];
        }
    }

    _renderHTML() {
        let str = this._joke;

        const emotions = flatMapDeep(this.emotionList.map(item => item.items));
        const emotionKeys = emotions.map(item => item.key);

        const _initEmotions = (data) => {

            const obj = {};

            emotionKeys.forEach((key) => {
                const _emotion = emotions.find((item) => item.key === key);
                const src = `${__imgPath}emotion/output/${_emotion.filename}`

                obj[key] = src;
            });

            return obj;
        };

        const replacer = (str) => {
            let _emotions = _initEmotions();
            return `<img src="${_emotions[str]}" alt="${str}" title="${str}" />`;
        };

        const replaceAll = (str, mapper) => {
            const pattern = new RegExp(Object.keys(mapper).join("|"), "gi");
            return str.replace(pattern, (match) => mapper[match]);
        }

        const patterns = [/(#[\u4e00-\u9fa5]{1})/g, /(#[\u4e00-\u9fa5]{2})/g, /(#[\u4e00-\u9fa5]{3})/g];  // Emotion keys has maximum of 3 chars
        let allKeys = {};

        patterns.forEach((pattern) => {
            if (pattern.test(str)) {
                let keys = str.match(pattern)
                    .filter((emotion) => emotionKeys.includes(emotion))                         // Only valid
                    .reduce((before, value) => ({ ...before, [value]: replacer(value) }), {});  // Get HTML element and deduplicate to dict
                allKeys = Object.assign({}, allKeys, keys);                                     // Append to main dict for rendering
            }
        });

        if (Object.keys(allKeys).length > 0)
            str = replaceAll(str, allKeys);

        return str;
    }
}

export default JX3_EMOTION;
