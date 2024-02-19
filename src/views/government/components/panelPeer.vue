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
                            <div class="content-label">动作：</div>
                            <el-cascader
                                v-model="item.type"
                                :options="schema.actionTypes"
                                :props="{expandTrigger: 'hover'}"
                            />
                        </div>

                        <component :is="compMap[item.type.join('-')]" :customData="item" @change="change"></component>

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
import speak from './pannelPeer/actions/speak.vue';
import head from './pannelPeer/head.vue';
import body from './pannelPeer/body.vue';
import moveTranslate from './pannelPeer/actions/move-translate.vue'

let drawStore = useDrawStore();
let compMap = {
    position,
    size,
    face,
    head,
    body,
    speak,
    "move-translate": moveTranslate
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

const addAction = () => {
    schema.value.actions.push({
        type: ['speak'],
        content: drawStore.currentConfInfo.content,
        duration: 0,
        easing: 'linear',
        delay: 0,
        iterations: 1,
        shakeHead: false,
        scaleHead: false,
        scaleBody: false,
        randomFace: false,
        fill: 'forwards',
    })
}
const removeAction = (index) => {
    schema.value.actions.splice(index, 1)
}
const change = ({action, data}) => {
    console.log(action, data)
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