## usage

1. 表情渲染

```js
import JX3_EMOTION from '@jx3box/jx3box-emotion'

const ins = new JX3_EMOTION(str)

// return html
ins.code
```

2. 表情组件

该组件会 `emit` 一个 `selected` 事件，向上传递一个参数，其值为选中的表情的key

```js
import Emotion from '@jx3box/jx3box-emotion/src/Emotion.vue'

<Emotion @selected="handleSelected" />

const handleSelected = (key) => {
  // your code
}
```