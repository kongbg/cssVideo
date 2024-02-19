<template>
    <div class="timeline">
        <div :class="['item', drawStore.currentConfIndex == index ? 'active':'']" v-for="(item, index) in timeline" @click="timeItemClick(index)">
            <Image class="img" :src="item.imageUrl"></Image>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, getCurrentInstance, watch } from 'vue';
import Image from '@/components/Image'
import useDrawStore from '@/store/modules/draw';
let drawStore = useDrawStore();

let timeline = computed(()=>{
    let confs = drawStore.confs;
    confs.forEach((item, index)=>{
        let info = item.comps.find(v=>{
            return v.type == 'background';
        })
        // todo 判断　check
        item.imageUrl = info.schema.property.background.value.image.url;
    })
    return confs;
})

init()
function init (index=0) {
    if (!timeline.value.length) return;
    // 默认选中第一个配置
    drawStore.setCurrentConfIndex(index);
    drawStore.setCurrentConfInfo(timeline.value[index]);
    drawStore.setCurrentCompIndex(0);
    drawStore.setCurrentCompInfo(timeline.value[index].comps[0]);
}

watch(()=>drawStore.confs, (val)=>{
    init();
})

const timeItemClick = (index)=>{
    init(index);
    // drawStore.setCurrentConfIndex(index);
}
</script>
<style lang="scss" scoped>
.timeline {
    width: calc(100% - 4px);
    white-space: nowrap;
    overflow: auto;

    .item {
        display: inline-block;
        background-color: #ccc;
        width: 150px;
        height: 100px;
        margin-right: 15px;
        overflow: hidden;
        &.active {
            border: 1px solid #409eff;
        }
        .img {
            width: 100%;
        }
    }
}
</style>