<template>
    <div class="c-jx3box-emotion">
        <el-tabs type="card">
            <el-tab-pane v-for="item in decorationEmotion" :key="item.group_id" :label="item.group_name">
                <span v-for="emotion in item.items" :key="emotion.emotion_id" class="c-jx3box-emotion-item" @click="handleEmotionClick(emotion)">
                    <img :src="`${EmojiPath}${emotion.filename}`" :alt="emotion.key" :title="emotion.key" />
                </span>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { $cms } from "@jx3box/jx3box-common/js/https";
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "Emotion",
    data() {
        return {
            emotionList: [],
            EmojiPath: __imgPath + "emotion/output/",

            decoration: [],
        };
    },
    created() {
        this.loadEmotionList();
        this.loadDecoration();
    },
    computed: {
        decorationEmotion({ emotionList, decoration }) {
            // 默认表情
            const defaultEmo = emotionList.filter((item) => item.group_id === 0);
            if (decoration.length === 0) {
                return defaultEmo;
            } else {
                // 购买的表情
                const arr = emotionList.filter((item) => decoration.includes(item.group_name));
                // 截取4个
                return [...defaultEmo, ...arr].slice(0, 4);
            }
        },
    },
    methods: {
        /**
         * 点击表情触发事件
         * @param {Object} emotion 表情对象
         */
        handleEmotionClick(emotion) {
            this.$emit("selected", emotion);
        },
        // 获取全部表情
        loadEmotionList() {
            try {
                const emotion = sessionStorage.getItem("jx3_emotion");
                if (emotion) {
                    this.emotionList = JSON.parse(emotion);
                    return;
                } else {
                    fetch(`${__dataPath}emotion/output/catalog.json`)
                        .then((response) => response.json())
                        .then((data) => {
                            this.emotionList = data;
                            sessionStorage.setItem("jx3_emotion", JSON.stringify(data));
                        });
                }
            } catch (e) {
                fetch(`${__dataPath}emotion/output/catalog.json`)
                    .then((response) => response.json())
                    .then((data) => {
                        this.emotionList = data;
                        sessionStorage.setItem("jx3_emotion", JSON.stringify(data));
                    });
            }
        },
        // 获取虚拟资产
        loadDecoration() {
            if (!User.isLogin()) return;
            $cms()
                .get(`/api/cms/user/decoration`, {
                    params: {
                        type: "emotion",
                        using: 1,
                        // uid: 8719
                    },
                })
                .then((res) => {
                    this.decoration = res.data.data.map((item) => item.val);
                });
        },
    },
};
</script>

<style lang="less" scoped>
.c-jx3box-emotion {
    margin: 16px 0;

    .c-jx3box-emotion-item {
        display: inline-flex;
        padding: 4px;
        margin: 2px;
        border: 1px solid #fff;
        cursor: pointer;

        &:hover {
            border-color: #ccc;
        }
    }
}
</style>
