/**
 * @description: 骚话渲染
 * @author: Kaviilee
 * @version: 1.0.0
 */

import $ from "jquery";
import emotions from "./data/default.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

class JX3_EMOTION {
    /**
     * @param {string} joke 骚话字符串
     */
    constructor(joke) {
        this._joke = $.trim(joke);

        this.init();
    }

    // 初始化实例
    init() {
        this.code = this._renderHTML();

        return;
    }

    _renderHTML() {
        let str = this._joke;

        const emotionKeys = Object.keys(emotions);

        const _initEmotions = (data) => {
            const keys = Object.keys(data);

            const obj = {};

            keys.forEach((key) => {
                const pathKey = key.slice(1);
                const imgPath = __imgPath + `image/emotion/${pathKey}.gif`;

                obj[key] = imgPath;
            });

            return obj;
        };

        const replacer = (str) => {
            let _emotions = _initEmotions(emotions);
            return `<img src="${_emotions[str]}" alt="${str}" title="${str}" />`;
        };

        const replaceAll = (str, mapper) => {
            const pattern = new RegExp(Object.keys(mapper).join("|"), "gi");
            return str.replace(pattern, (match) => mapper[match]);
        }

        const patterns = [ /(#[\u4e00-\u9fa5]{1})/g, /(#[\u4e00-\u9fa5]{2})/g, /(#[\u4e00-\u9fa5]{3})/g ];  // Emotion keys has maximum of 3 chars
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
