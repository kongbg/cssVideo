<template>
    <img :src="getImgUrl(props.src)" :alt="props.alt">
</template>
<script setup>
import { getImgUrl } from '@/utils/draw'
const props = defineProps({
    src:{
        type: String,
        default: ""
    },
    alt:{
        type: String,
        default: ""
    }
})

</script>