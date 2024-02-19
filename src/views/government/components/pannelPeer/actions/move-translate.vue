<template>
    <div class="item center">
        <div class="content-label">延时：</div>
        <el-input class="" v-model="props.customData.delay" placeholder="">
            <template #append>秒</template>
        </el-input>并在
    </div>
    <div class="item center">
        <el-input class="duration" v-model="props.customData.duration" placeholder="">
            <template #append>秒内</template>
        </el-input>
        <div class="duration-txt">走到坐标</div>
    </div>
    <div class="item center">
        <div class="">x：</div>
        <el-input class="" v-model="props.customData.x" placeholder="">
            <template #append>px</template>
        </el-input>
    </div>
    <div class="item center">
        <div class="">y：</div>
        <el-input class="" v-model="props.customData.y" placeholder="">
            <template #append>px</template>
        </el-input>
    </div>
</template>
<script setup>
const props = defineProps({
    customData: {
        type: Object,
        default: ()=>{}
    }
})
</script>