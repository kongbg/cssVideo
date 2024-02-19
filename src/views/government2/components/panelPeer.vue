<template>
    <div class="pannelPeer">
        <div class="title" v-if="!isEmpty">
            <div class="label">组件名称：</div>
            <div class="value">
                <el-input v-model="schema.name" />
            </div>
        </div>
        <div class="propertys">
            <el-collapse class="collapse" v-model="activeNames">
                <el-collapse-item class="item__warpper" :title="item.name" :name="index"
                    v-for="(item, index) in schema.property" :key="index" v-show="item.show || item.show == undefined">
                    <component v-if="item.show || item.show == undefined" :is="compMap[item.type]" :compData="item.value">
                    </component>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="actions">
            <el-collapse class="collapse" v-model="activeNames2">
                <el-collapse-item class="item__warpper" title="动作" name="action">
                    <div class="action" v-for="(item,index) in schema.actions">
                        <el-icon class="delete"  @click="removeAction(index)">
                            <Delete />
                        </el-icon>

                        <div class="item">
                            <div class="content-label">新增动作：</div>
                            <el-select class="select" v-model="item.type" placeholder="">
                                <el-option v-for="item in actionTypes" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                        <!-- speak -->
                        <div class="item center" v-if="item.type == 'speak'">
                            <div class="content-label">内容：</div>
                            <el-input class="textarea" v-model="item.content" :rows="2" type="textarea" placeholder="" />
                        </div>
                        <!-- move -->
                        <!-- delay -->
                        <div class="item center">
                            <div class="content-label">延时：</div>
                            <el-input class="" v-model="item.delay" placeholder="">
                                <template #append>秒</template>
                            </el-input>
                        </div>
                        <div class="item center" v-if="item.type == 'move'">
                            <el-input class="duration" v-model="item.duration" placeholder="">
                                <template #append>秒</template>
                            </el-input>
                            <div class="duration-txt">走到坐标</div>
                        </div>
                        <div class="item center" v-if="item.type == 'move'">
                            <div class="">x：</div>
                            <el-input class="" v-model="item.x" placeholder="">
                                <template #append>px</template>
                            </el-input>
                        </div>
                        <div class="item center" v-if="item.type == 'move'">
                            <div class="">y：</div>
                            <el-input class="" v-model="item.y" placeholder="">
                                <template #append>px</template>
                            </el-input>
                        </div>

                        
                    </div>
                    <el-button type="primary" size="small" @click="addAction">新增动作</el-button>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script setup>
import useDrawStore from '@/store/modules/draw';
import { computed, ref } from 'vue';
import position from './pannelPeer/position.vue';
import size from './pannelPeer/size.vue';
import face from './pannelPeer/face.vue';

let drawStore = useDrawStore();
let compMap = {
    position,
    size,
    face
}

const schema = computed(() => {
    return drawStore.currentCompInfo.schema;
})

const isEmpty = computed(() => {
    return Object.keys(schema.value).length === 0;
})
const activeNames = computed(() => {
    return schema && schema.value.property ? Object.keys(schema.value.property).filter(key => schema.value.property[key].show) : []
})

const activeNames2 = ref(['action'])

const actionTypes = ref([
    {
        label: '读',
        value: 'speak'
    },
    {
        label: '移动',
        value: 'move'
    },
    // {
    //     label: '跑',
    //     value: 'run'
    // },
    // {
    //     label: '跳',
    //     value: 'jump'
    // },
])


const addAction = () => {
    schema.value.actions.push({
        type: 'speak',
        content: drawStore.currentConfInfo.content,
        duration: 0,
        easing: 'linear',
        delay: 0,
        iterations: 1,
        fill: 'forwards',
    })
}
const removeAction = (index) => {
    schema.value.actions.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.pannelPeer {
    padding: 10px;
    overflow: auto;

    .propertys {
        margin-top: 10px;
    }

    .actions {
        .collapse {
            .item__warpper {
                .action {
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 5px;
                    margin-bottom: 10px;
                    position: relative;
                    .delete {
                        position: absolute;
                        top: 0;
                        right: 0;
                        z-index: 100;
                        cursor: pointer;
                    }
                    .item {
                        display: flex;
                        margin-bottom: 10px;
                        align-items: center;
                        .content-label {
                            width: 94px;
                        }

                        .select {
                            display: inline-block;
                        }
                        .textarea {
                            display: inline-block;
                        }
                        .duration-txt {
                            width: 100px;
                        }
                        &.move {
                            .move-item {
                                display: flex;
                                align-items: center;
                            }
                        }
                        &.center {
                            align-items: center;
                        }
                    }
                }
            }
        }
    }
}</style>