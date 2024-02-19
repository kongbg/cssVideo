<template>
    <div class="donghua__warpper">
        <sideBar class="sideBar"></sideBar>
        <content class="content"></content>
        <panelPeer class="panelPeer"></panelPeer>
    </div>
</template>
<script setup name="shadiaodonghua">
import sideBar from '../components/sideBar.vue'
import content from '../components/content.vue'
import panelPeer from '../components/panelPeer.vue'
</script>

<style lang="scss" scoped>
.donghua__warpper {
    width: 100%;
    height: calc(100vh - 84px);
    display: flex;
    justify-content: space-between;

    .sideBar {
        width: 240px;
        height: 100%;
        border-right: 1px solid #eee;
    }

    .content {
        width: calc(100% - 480px);
        height: 100%;
        overflow: hidden;
    }

    .panelPeer {
        width: 240px;
        height: 100%;
        border-left: 1px solid #eee;
    }
}</style>