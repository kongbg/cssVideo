<template>
    <div class="comp-position">
        <div class="p-item">
            <div class="label">{{ props.compData.image.label }}:</div>
            <el-input v-model="props.compData.image.value"></el-input>
        </div>
        <div class="p-item">
            <div class="label">{{ props.compData.width.label }}:</div>
            <el-input-number v-model="props.compData.width.value" class="mx-4" :min="0" :max="9999" controls-position="right"></el-input-number>
        </div>
        <div class="p-item">
            <div class="label">{{ props.compData.height.label }}:</div>
            <el-input-number v-model="props.compData.height.value" class="mx-4" :min="0" :max="9999" controls-position="right"></el-input-number>
        </div>
        <div class="p-item">
            <div class="label">{{ props.compData.x.label }}:</div>
            <el-input-number v-model="props.compData.x.value" class="mx-4" :min="0" :max="9999" controls-position="right"></el-input-number>
        </div>
        <div class="p-item">
            <div class="label">{{ props.compData.y.label }}:</div>
            <el-input-number v-model="props.compData.y.value" class="mx-4" :min="0" :max="9999" controls-position="right"></el-input-number>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useDrawStore from '@/store/modules/draw';
let drawStore = useDrawStore()
const props = defineProps({
    compData: {
        type: Object,
        default: () => ({})
    }
});

// watch(() => drawStore.currentCompInfo.schema.property.size.value.width.value, value => {
//     console.log('widthchange:', value, drawStore.currentCompInfo.schema.property)
//     let changeList = []
    
// })

let unit = ref('px');
</script>
<style lang="scss" scoped>
.comp-position {
    .p-item {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
        padding-left: 10px;
        .unit {
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 6px;
        }

        .label {
            min-width: 32px;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>