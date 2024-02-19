<template>
    <div class="dh-content__warpper">
        <draw class="draw"></draw>
        <timeline class="timeline"></timeline>
    </div>
</template>
<script setup>
import draw from './draw.vue'
import timeline from './timeline.vue'

</script>
<style lang="scss" scoped>
.dh-content__warpper {
    .draw {
        width: 100%;
        height: 500px;
    }
    .timeline {
        margin-top: 15px;
    }
}
</style>