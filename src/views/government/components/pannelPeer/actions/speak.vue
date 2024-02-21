<template>
    <div class="item center" v-if="props.customData.type == 'speak'">
        <div class="content-label">内容：</div>
        <el-input class="textarea" v-model="content" :rows="2" type="textarea" placeholder="" />
    </div>
    <div class="item center">
        <div class="content-label">延时：</div>
        <el-input class="" v-model="props.customData.delay" placeholder="">
            <template #append>秒</template>
        </el-input>
    </div>
    <div class="item center">
        <div class="content-label">随机摇头：</div>
        <el-switch v-model="props.customData.shakeHead" />
    </div>
    <div class="item center">
        <div class="content-label">头部翻转：</div>
        <el-switch v-model="props.customData.scaleHead" />
    </div>
    <div class="item center">
        <div class="content-label">全身左右翻转：</div>
        <el-switch v-model="props.customData.scaleBody" />
    </div>
    <div class="item center">
        <div class="content-label">随机表情：</div>
        <el-switch v-model="props.customData.randomFace" />
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    customData: {
        type: Object,
        default: ()=>{}
    }
})
const content = computed({
    get() {
        console.log('props.customData:', props.customData)
        // let content = props.customData?.content || [];
        // let data = content.find(item => {
        //     return item.speak == props.name;
        // })
        // return data && data.content || '';
        return props.customData.content.content;
    },
    set(value) {
        console.log('props.customData:', props.customData)
        props.customData.content.content = value;
    }
    
})
</script>