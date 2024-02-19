<template>
    <div class="comp__warpper"
        :id="`comp-${props.compData.id}`"
        :ref="`warp-${props.compData.id}`"
        :class="[props.active  && props.compData.type != 'background' ? 'active' : '']"
        :style="customStyle"
    >
    <!-- {{ props.compData.id }} -->
        <slot></slot>
        <span class="draw-icon top-center"></span>
        <span class="draw-icon top"></span>
        <span class="draw-icon left"></span>
        <span class="draw-icon right"></span>
        <span class="draw-icon bottom"></span>
        <span class="draw-icon top-left"></span>
        <span class="draw-icon top-right"></span>
        <span class="draw-icon bottom-left"></span>
        <span class="draw-icon bottom-right"></span>
        <el-icon class="delete" @click="deleteComp">
            <Delete />
        </el-icon>
    </div>
</template>
<script setup>
import { computed, provide, onMounted } from 'vue';
import anime from 'animejs/lib/anime.es.js';
import useDrawStore from '@/store/modules/draw';
let drawStore = useDrawStore();
const { proxy }  = getCurrentInstance();
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  compData: {
    type: Object,
    default: () => ({})
  }
});

//  根据子元素的xy定位
const customStyle = computed(() => {
    let property = props.compData.schema.property;
    if (property.position) {
        let data = property.position.value;
        let nuit = data.unit.value;
        return {
            left: `${data.x.value}${nuit}`,
            top: `${data.y.value}${nuit}`,
            zIndex: `${data.zIndex.value}`
        }
    }
    return {};
})

const setAnimate = async (propertys, options) => {
    return new Promise((resolve, reject) => {
        // console.log( propertys, options, `comp-${props.compData.id}`)
        let playload = {
            targets: `#comp-${props.compData.id}`,
            ...propertys,
            ...options,
            complete: function(anim) {
                resolve(true)
            },
        }
        anime(playload)
    })
}
provide('setAnimate', setAnimate)

const deleteComp = () => {
    drawStore.drawConfigs.confs[drawStore.currentConfIndex].comps.splice(drawStore.currentCompIndex, 1);
}
</script>
<style lang="scss" scoped>
.comp__warpper {
    position: absolute;
    border: 1px solid transparent;
    .draw-icon{
        display: none;
    }
    .delete {
        position: absolute;
        top: 2px;
        right: 2px;
        color: #409eff;
        cursor: pointer;
        display: none;
    }
    &.active {
        border: 1px dashed #409eff;
        .draw-icon {
            position: absolute;
            display: block;
            &.top-center {
                top: -22px;
                left: 50%;
                transform: translateX(-50%);
                background: url('./../../../../assets/icons/move.png') no-repeat;
                width: 20px;
                height: 20px;
                background-size: 100% 100%;
                cursor: pointer;
            }
            &.top {
                top: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 25px;
                height: 3px;
                background: #409eff;
                cursor: row-resize;
            }
            &.left {
                left: -2px;
                top: 50%;
                transform: translateY(-50%);
                height: 25px;
                width: 3px;
                background: #409eff;
                cursor: col-resize;
            }
            &.right {
                right: -2px;
                top: 50%;
                transform: translateY(-50%);
                height: 25px;
                width: 3px;
                background: #409eff;
                cursor: col-resize;
            }
            &.bottom {
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 25px;
                height: 3px;
                background: #409eff;
                cursor: row-resize;
            }
            &.top-left {
                width: 20px;
                top: -2px;
                left: -2px;
                cursor: nwse-resize;
                &::after,&::before{
                    display: block;
                    content: '';
                    width: 3px;
                    height: 20px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: #409eff;
                }
                &::before{
                    width: 20px;
                    height: 3px;
                }
            }
            &.top-right {
                width: 20px;
                top: -2px;
                right: -2px;
                cursor: nesw-resize;
                &::after,&::before{
                    display: block;
                    content: '';
                    width: 3px;
                    height: 20px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: #409eff;
                }
                &::before{
                    width: 20px;
                    height: 3px;
                }
            }
            &.bottom-left {
                width: 20px;
                bottom: -2px;
                left: -2px;
                cursor: nesw-resize;
                &::after,&::before{
                    display: block;
                    content: '';
                    width: 3px;
                    height: 20px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background: #409eff;
                }
                &::before{
                    width: 20px;
                    height: 3px;
                }
            }
            &.bottom-right {
                width: 20px;
                bottom: -2px;
                right: -2px;
                cursor: nwse-resize;
                &::after,&::before{
                    display: block;
                    content: '';
                    width: 3px;
                    height: 20px;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: #409eff;
                }
                &::before{
                    width: 20px;
                    height: 3px;
                }
            }
        }
        .delete {
            display: block;
        }
    }
}
</style>