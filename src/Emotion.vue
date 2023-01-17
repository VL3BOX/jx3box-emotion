<template>
    <div class="c-jx3box-emotion">
        <el-tabs type="card">
            <el-tab-pane
                v-for="item in decorationEmotion"
                :key="item.group_id"
                :label="item.group_name"
            >
                <template v-for="emotion in item.items">
                    <span
                        :key="emotion.emotion_id"
                        class="c-jx3box-emotion-item"
                        @click="handleEmotionClick(emotion)"
                    >
                        <img
                            :src="`${EmojiPath}${emotion.filename}`"
                            :alt="emotion.key"
                            :title="emotion.key"
                        />
                    </span>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { $cms } from "@jx3box/jx3box-common/js/https";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Emotion",
    data() {
        return {
            emotionList: [],
            EmojiPath: __imgPath + "emotion/output/",
            
            decoration: []
        };
    },
    created() {
        this.loadEmotionList();
        this.loadDecoration();
    },
    computed: {
        decorationEmotion({ emotionList, decoration }) {
            const defaultEmo = emotionList.filter(item => item.group_id === 0);
            if (decoration.length === 0) {
                return defaultEmo;
            } else {
                const arr = emotionList.filter(item => decoration.includes(item.group_id));
                return [...defaultEmo, ...arr];
            }
        }
    },
    methods: {
        /**
         * 点击表情触发事件
         * @param {Object} emotion 表情对象
         */
        handleEmotionClick(emotion) {
            const src = `${this.EmojiPath}${emotion.filename}`;
            this.$emit("selected", src);
        },
        loadEmotionList() {
            fetch(`${__dataPath}emotion/output/catalog.json`)
                .then((response) => response.json())
                .then((data) => {
                    this.emotionList = data;
                });
        },
        loadDecoration() {
            $cms().get(`/api/cms/user/decoration`, {
                params: {
                    type: 'emotion',
                    using: 1
                }
            }).then((res) => {
                this.decoration = res.data.data
            });
        }
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