<template>
    <div :class="['person', isEmpty ? 'empty':'']" @dragover="dragover" @drop="drop" :style="customStyle">
      <!-- {{ props.compData.id }} -->
        <div v-if="isEmpty" class="default-body"></div>
        <div v-if="!isEmpty" class="body" :style="bodyStyle">
          <div class="face" :style="faceStyle"></div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, inject } from "vue";
import { speak, sleep } from "../../utils";
import { getImgUrl } from '@/utils/draw'
const { proxy } = getCurrentInstance()
const props = defineProps({
  compData: {
    type: Object,
    default: () => ({})
  }
});

// 是否为空
const isEmpty = computed(() => {
  let {x, y} = props.compData.schema.property.position.value;
  return x.value==0 && y.value==0;
});

const bodyImgUrl = computed(()=>{
  return getImgUrl(props.compData.schema.property.background.value.image.url);
})


const customStyle = computed(() => {
  return {
    width: props.compData.schema.property.size.value.width.value + 'px',
    height: props.compData.schema.property.size.value.height.value + 'px'
  }
})

const faceStyle = computed(() => {
  let url = props.compData.schema.property.face?.value.image.value;
  if (url) {
    return {
      backgroundImage: `url(${getImgUrl(url)})`,
      left: props.compData.schema.property.face?.value.x.value + 'px',
      top: props.compData.schema.property.face?.value.y.value + 'px',
      width: props.compData.schema.property.face?.value.width.value + 'px',
      height: props.compData.schema.property.face?.value.height.value + 'px'
    }
  } else {
    return {}
  }
})

const bodyStyle = computed(() => {
  return {
    backgroundImage: `url(${getImgUrl(props.compData.schema.property.background.value.image.url)})`
  }
})


const dragover = (e) => {
    // e.preventDefault();
}
const drop = (e) => {
    e.stopPropagation();//阻止冒泡
    let data =JSON.parse(e.dataTransfer.getData('text/plain'))
    let compId = data.data.compId;
    let type = data.parent.type;
    proxy.$emit('change', {
        action: 'update',
        data: {
            compId,
            type,
            id: props.id
        }
    })
}

defineExpose({
  run
})

let setAnimate = inject('setAnimate')
function run () {
  return new Promise(async (resolve, reject) => {
    await doAction();
    resolve(true);
  })
}
async function doAction() {
  let actions = props.compData.schema.actions || [];
  let list = [];
  actions.forEach(item => {
    let p = new Promise(async (resolve, reject) => {
      if (item.type === 'speak') {
        await speak(item.content);
      }
      if (item.type === 'move') {
        await setAnimate(
          {
            left: `${item.x}px`,
            top: `${item.y}px`
          },
          {
            duration: item.duration * 1000,// 动画时长 (单位毫秒)
            easing: 'linear', // 设置动画 运动速率 [esse(默认)：慢-快-慢 ，linear: 匀速， ease-in: 慢-匀速， ease-in-out 慢-匀速-慢] [非必须]
            delay: item.delay * 1000, // 设置动画延迟时长 (单位毫秒) [非必须]
          }
        )
      }
      resolve(true);
    })
    list.push(p)
  })
  await Promise.all(list);
}
</script>

<style lang="scss" scoped>
.person {
    border: 1px solid transparent;
    .default-body,.body {
      position: relative;
      width: 100%;
      height: 100%;
      background-origin: content;
      /*从content区域开始显示背景*/
      background-position: 50% 50%;
      /*图片上下左右居中*/
      background-size: contain;
      /*保持图像本身的宽高比例，将图片缩放到宽度或高度正好适应定义背景的区域*/
      background-repeat: no-repeat;
      .face {
        width: 20%;
        height: 20%;
        background-origin: content;
        /*从content区域开始显示背景*/
        background-position: 50% 50%;
        /*图片上下左右居中*/
        background-size: contain;
        /*保持图像本身的宽高比例，将图片缩放到宽度或高度正好适应定义背景的区域*/
        background-repeat: no-repeat;
        position: absolute;
        left: 42%;
        top: 24%;
      }
    }
    &.empty {
    }
}
</style>