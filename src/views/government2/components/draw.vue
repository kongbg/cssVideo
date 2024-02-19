<template>
    <div class="dh-draw__warpper">
        <div>
            <el-button @click="start" type="primary" size="small">播放</el-button>
            <el-button @click="preview" type="primary" size="small">预览</el-button>
        </div>
        
        <div ref="dh-draw-content" class="dh-draw-content" @dragover="dragover" @drop="drop">
            <comp-warpper
                v-for="(item, index) in comps"
                :key='item.id'
                :compData="item"
                :active="drawStore.currentCompIndex == index"
                >
                <!-- {{ `comp-${item.id}` }} -->
                <component class="comp"
                    :ref="`comp-${item.id}`"
                    :is="item.comp"
                    :width="dwidth"
                    :height="dheight"
                    :compData="item"
                    @change="compChange"
                    @click="compClick(item, index)">
                </component>
            </comp-warpper>
        </div>
    </div>
</template>
<script setup>
import { ref, shallowRef, getCurrentInstance, computed, nextTick } from 'vue';
import { deepClone } from '@/utils';
import { generateUniqueID, } from './utils'
const { proxy } = getCurrentInstance()
import compWarpper from './common/compWarpper.vue';
import person from './common/person/index.vue';
import background from './common/background/index.vue';
import useDrawStore from '@/store/modules/draw';
let drawStore = useDrawStore();

// 缓存组件，方便后续查询
let comMap = {
    background: shallowRef(background),
    person: shallowRef(person)
}

// 获取dh-draw-content宽高，传递给下级，当下级内容为空时设置宽高
let dwidth = ref(0);
let dheight = ref(0);
onMounted(() => {
    let dom = proxy.$refs['dh-draw-content'];
    dwidth.value = dom.offsetWidth || 0;
    dheight.value = dom.offsetHeight || 0;
})

let comps = computed(()=>{
    drawStore.currentConfInfo.comps.forEach(item => {
        item.comp = comMap[item.compName];
    })
    return drawStore.currentConfInfo.comps;
})

function preview() {
    console.log(drawStore.mode)
    drawStore.setMode('preview');
    nextConf(0)
}

function nextConf(index) {
    index = index !== undefined ? index : drawStore.currentConfIndex + 1;
    drawStore.setCurrentConfIndex(index);
    drawStore.setCurrentConfInfo(drawStore.confs[0]);
    drawStore.setCurrentCompIndex(0);
    drawStore.setCurrentCompInfo(drawStore.confs[index].comps[0]);
}

async function start() {

    // 初始化
    drawStore.setCurrentConfIndex(0);
    drawStore.setCurrentConfInfo(drawStore.confs[0]);
    drawStore.setCurrentCompIndex(0);
    drawStore.setCurrentCompInfo(drawStore.confs[0].comps[0]);


    let count = 0;
    console.time('start');
    while (count < drawStore.confs.length) {
        // 获取当前时间段内所有可操作组件
        let comp = drawStore.confs[count].comps;
        let plist = [];
        // 执行所有组件中的run方法，直到所有run执行完成后继续循环
        comp.forEach(async (item, index) => {
            // await nextTick();
            let refId = `comp-${item.id}`;
            let run = proxy.$refs[refId] && proxy.$refs[refId][0]?.run;
            if (run) {
                // console.log('has run')
                let p = new Promise(async (resolve, reject) => {
                    await run();
                    resolve(true);
                })
                plist.push(p);
            } else {
                // console.log('no run')
            };
        })
        if(plist.length) {
            await Promise.all(plist);
        }
        count++;
        if (count < drawStore.confs.length) {
            drawStore.setCurrentConfIndex(count);
            drawStore.setCurrentConfInfo(drawStore.confs[count]);
            drawStore.setCurrentCompIndex(0);
            drawStore.setCurrentCompInfo(drawStore.confs[count].comps[0]);
        }
        await sleep(1000);
    }
    console.log('循环结束');
    console.timeEnd('start');
}



/**
 * 初始化每个对话中可操作物料
 * @param {*} drawConf 对话配置项
 * @returns {*} drawConf 返回新增可操作物料配置
 */
async function updateComp(data) {
    let {type, url, options } = data;
    for(let i = 0; i < drawStore.currentConfInfo.comps.length; i++) {
        let item = drawStore.currentConfInfo.comps[i];
        if (type === 'background' && item.type === type){
            item.schema.property.background.value.image.url = url;
            break;
        }

        if (item.id) {
            let temp = deepClone(await getSchema(type));
            temp.property.position.value.x.value = options.x - options.px;
            temp.property.position.value.y.value = options.y - options.py;
            temp.property.background.value.image.url = url;
            // temp.actions = [
            //     {
            //         type: 'speak',
            //         content: drawStore.currentConfInfo.content,
            //         duration: 0,
            //         easing: 'linear',
            //         delay: 0,
            //         iterations: 1,
            //         fill: 'forwards'
            //     }
            // ]
            drawStore.currentConfInfo.comps.push(
                {
                    type,
                    id: generateUniqueID(),
                    compId: generateUniqueID(),
                    compName: type,
                    comp: null,
                    schema: temp
                }
            )
            break;
        }
    }
}

// 子组件内容改变
const compChange = (e) => {
    debugger
    let { action, data } = e;

    if (action === 'update') {
        let { compId, type, id } = data;
        updateComp({ compId, type, id });
    }

    // 当前帧执行完成，切换下一帧
    if (action == 'completed') {
        console.log('当前帧执行完成，切换下一帧')
    }
}

let schema = ref({});
// 选择当前帧的其他组件
async function compClick(data, index) {
    drawStore.setCurrentCompIndex(index)
    drawStore.setCurrentCompInfo(data);
}

// 获取schema
async function getSchema(path) {
    // todo 先从接口拿
    let schemaData = await import(`./common/${path}/schema.json`);
    return schemaData.default;
}

/**
 * 阻止默认事件，允许放置拖拽元素
 */
const dragover = (e) => {
    e.preventDefault();
}

// 放置拖拽元素
const drop = (e) => {
    let result = JSON.parse(e.dataTransfer.getData('text/plain'))
    let url = result.data.url;
    let type = result.parent.type;
    let options = {
        px: result.data.px,
        py: result.data.py,
        x: e.offsetX,
        y: e.offsetY
    }
    updateComp({ type, url , options});
}

let customStyle = ref({});
const positionChange = (data) => {
    debugger
    let { x, y, unit} = data;
    customStyle.value = {
        left: `${x}${unit}`,
        top: `${y}${unit}`
    }
}

function sleep(delay = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}

</script>
<style lang="scss" scoped>
.dh-draw__warpper {
    .dh-draw-content {
        // width: calc(100% - 4px);
        // height: 500px;

        // width: 540px;
        // height: 304px;

        width: 720px;
        height: 405px;
        position: relative;
    }
}
</style>