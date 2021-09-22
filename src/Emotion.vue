<template>
    <div class="c-jx3box-emotion">
        <template v-for="emotion in sortedEmotions">
            <span :key="emotion.key" class="c-jx3box-emotion-item" @click="handleEmotionClick(emotion.key)">
                <img :src="emotion.path" :alt="emotion.key" :title="emotion.key" />
            </span>
        </template>
    </div>
</template>

<script>
import emotion from "../data/default.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
  name: 'Emotion',
  data () {
    return  {
      sortedEmotions: [],
    }
  },
  created() {
      this.emotionSort()
  },
  methods: {
    // 表情排序
    emotionSort() {
        const keys = Object.keys(emotion);
        keys.sort((item1, item2) => {
            return item1.localeCompare(item2);
        });
        keys.forEach((key) => {
            const pathKey = key.slice(1);
            const obj = {
                key,
                value: emotion[key],
                path: __imgPath + `image/emotion/${pathKey}.gif`,
            };
            // console.log(key)
            this.sortedEmotions.push(obj);
        });
    },
    /**
     * 点击表情触发事件
     * @param {string} key 表情key
     */
    handleEmotionClick(key) {
        this.$emit('selected', key)
    }
  }
}
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