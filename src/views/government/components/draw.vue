<template>
    <div class="dh-draw__warpper">
        <div>
            <el-button @click="start" type="primary" size="small">播放</el-button>
            <el-button @click="preview" type="primary" size="small">预览</el-button>
            <el-button @click="clear" type="primary" size="small">清空</el-button>
        </div>

        <div id="dh-draw-content" ref="dh-draw-content" :class="['dh-draw-content', drawStore.mode == 'preview' ? 'preview' : '']" @dragover="(e)=>dragover(e, drawStore.dragElType)" @drop="drop">
            <comp-warpper
                v-for="(item, index) in comps"
                :key='item.id'
                :compData="item"
                :active="drawStore.currentCompIndex == index"
                >
                <component class="comp"
                    :id="item.id"
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
import { ref, shallowRef, getCurrentInstance, computed, nextTick, onMounted } from 'vue';
import { deepClone } from '@/utils';
import { generateUniqueID, } from './utils'
const { proxy } = getCurrentInstance()
import compWarpper from './common/compWarpper.vue';
import person from './common/person/index.vue';
import background from './common/background/index.vue';
import useDrawStore from '@/store/modules/draw';
import { useRoute } from "vue-router"
let drawStore = useDrawStore();

drawStore.setMode('desgin');

onMounted(()=>{
    const route = useRoute(); 
    console.log('route:', route)
    const { query } = route;
    const mode = query.mode;
    if (mode === 'preview') {
        preview()
    }
})

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
    // console.log(drawStore.mode)
    drawStore.setMode('preview');
    start()
    // nextConf(0)
}
const clear = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
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
                console.log('has run')
                let p = new Promise(async (resolve, reject) => {
                    await run();
                    resolve(true);
                })
                plist.push(p);
            } else {
                console.log('no run')
            };
        })
        if(plist.length) {
            let res = await Promise.all(plist);
            console.log('23:', res)
        }
        count++;
        if (count < drawStore.confs.length) {
            drawStore.setCurrentConfIndex(count);
            drawStore.setCurrentConfInfo(drawStore.confs[count]);
            drawStore.setCurrentCompIndex(0);
            drawStore.setCurrentCompInfo(drawStore.confs[count].comps[0]);
        }
        await sleep(200);
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
    // console.log('drawStore.currentConfInfo.comps:', drawStore.currentConfInfo.comps)
    let { targetType, targetId, sourceType, options } = data;
    // console.log(targetType, targetId, sourceType, options)
    // 非背景组件拖入背景中-修改背景
    if (sourceType === 'background' && targetType === 'background') {
        console.log('非背景组件拖入背景中-修改背景')
        let info = drawStore.currentConfInfo.comps.find(item => {
            return item.id === targetId;
        })
        if (info) {
            info.schema.property.background.value.image.url = options.url;
        }
    }

    // 非背景组件拖入背景中-新增
    if(sourceType != 'background' && targetType === 'background') {
        // 非背景组件拖入背景中
        let temp = deepClone(await getSchema(sourceType));
        
        temp.property.position.value.x.value = options.x - options.px;
        temp.property.position.value.y.value = options.y - options.py;
        temp.property.background.value.image.url = options.url;

        if (options.headUrl) temp.property.head.value.image.value = options.headUrl;
        if (options.bodyUrl) temp.property.body.value.image.value = options.bodyUrl;

        let playload = {
            type: sourceType,
            id: generateUniqueID(),
            compId: generateUniqueID(),
            compName: sourceType,
            comp: null,
            schema: temp
        }
        drawStore.currentConfInfo.comps.push(playload)

        console.log('非背景组件拖入背景中-新增', playload)

        compClick(playload, drawStore.currentConfInfo.comps.length - 1)
    }

    // 非背景组件拖入非背景中-修改局部
    if(sourceType != 'background' && targetType != 'background') {
        console.log('非背景组件拖入非背景中-修改局部')
        let info = drawStore.currentConfInfo.comps.find(item => {
            return item.id === targetId;
        })
        console.log('info:', info)
        if (info) {
            info.schema.property[sourceType].value.image.value = options.url
        }
    }
}

// 子组件内容改变
const compChange = (e) => {
    debugger
    let { action, data } = e;

    if (action === 'update') {
        console.log('子组件内容改变:', data)
        updateComp(data);
    }

    // 当前场景执行完成，切换下一帧
    if (action == 'completed') {
        console.log('当前场景执行完成，切换下一帧')
    }
}

let schema = ref({});
// 选择当前场景的其他组件
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
const dragover = (e, dragElType) => {
    // console.log('111阻止默认事件，允许放置拖拽元素:',e, dragElType)
    let allowType = ['background', 'person'];
    if (allowType.includes(dragElType)) {
        e.preventDefault();
    }
}

// 放置拖拽元素
const drop = (e) => {
    let classList = [...e.target.classList]
    let targetType = classList.includes('backgroundImg') ? 'background' : '';
    let targetId = e.target.id;
    let jsonStr = e.dataTransfer.getData('text/plain');
    if (jsonStr.includes('{')&&jsonStr.includes('}')) {
        let data = JSON.parse(e.dataTransfer.getData('text/plain'))
        let options = {
            ...data,
            x: e.offsetX,
            y: e.offsetY
        }
        updateComp({ targetType, targetId, sourceType: data.type, options });
    }
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
        &.preview {
            position: fixed;
            z-index: 1002;
            top: 0;
            left: 0;
        }
    }
}
</style>