<template>
    <div class="numes-list">
        <div class="upload-text">
            <el-upload class="upload-demo" :auto-upload="false" :show-file-list="false" :on-change="handleChange">
                <el-button type="primary" size="small">新增</el-button>
            </el-upload>
        </div>
        <div class="texts">
            <div :class="['t-item', textId == item.id ? 'active' : '']" v-for="(item, index) in  drawStore.textList" :key="item.id"
                @click="textClick(item)">
                <span>{{ index + 1 }}</span>
                <span class="name">{{ item.name }}</span>
            </div>
        </div>
        <el-collapse class="collapse" v-model="activeNames">
            <el-collapse-item class="item__warpper" :title="item.name" :name="item.id" v-for="item in lists" :key="item.id">
                <div class="items" :class="item.type">
                    <div class="item clearfix" draggable="true" v-for="child in item.list" :key="child.id"
                        @dragstart="(e) => onDragStart(child, item, e)"
                        @drag="ondrag">
                        <div class="imgs" :style="imgStyle(child)"></div>
                        <div class="name">{{ child.name }}</div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { deepClone } from '@/utils';
import { getImgUrl } from '@/utils/draw'
import { generateUniqueID } from './utils';
import Image from "@/components/Image";
import useDrawStore from "@/store/modules/draw";
let drawStore = useDrawStore();
let lists = ref([
    {
        id: 'c9tfzfx7',
        type: "background",
        name: "背景",
        list: [
            {
                id: 'f2ow0woz',
                name: "背景1",
                url: "assets/images/background/1_1.jpg",
                compName: "background",
            },
            {
                id: 'cc7z8t8g',
                name: "背景2",
                url: "assets/images/background/1_2.jpg",
                compName: "background",
            },
        ],
    },
    {
        id: '6b782wns',
        type: "person",
        name: "人物",
        list: [
            {
                id: '6fdok0uf',
                name: "人物1",
                url: "assets/images/person/1.png",
                compName: "person",
            },
            {
                id: '6fdok0ug',
                name: "人物1",
                url: "assets/images/person/2.png",
                compName: "person",
            },
            {
                id: '6fdok0jf',
                name: "人物1",
                url: "assets/images/person/3.png",
                compName: "person",
            },
        ],
    },
    {
        id: '33pllx82',
        type: "face",
        name: "表情",
        list: [
            {
                id: 'ks8tklwa',
                name: "表情1",
                url: "assets/images/face/1.png",
                compName: "face",
            },
            {
                id: 'ks8tklwf',
                name: "表情2",
                url: "assets/images/face/2.png",
                compName: "face",
            },
            {
                id: 'ks8hklwa',
                name: "表情3",
                url: "assets/images/face/3.png",
                compName: "face",
            },
            {
                id: 'ks8tklwa',
                name: "表情4",
                url: "assets/images/face/4.png",
                compName: "face",
            },
            {
                id: 'ks8tllwa',
                name: "表情5",
                url: "assets/images/face/5.png",
                compName: "face",
            },
            {
                id: 'ks8uklwa',
                name: "表情6",
                url: "assets/images/face/6.png",
                compName: "face",
            },
        ],
    },
    {
        id: 'des0950y',
        type: "weapon",
        name: "武器",
        list: [],
    },
    {
        id: 'orxnp4v',
        type: "effect",
        name: "特效",
        list: [],
    }
]);

const activeNames = ref(['c9tfzfx7', '6b782wns', '33pllx82', 'des0950y', 'orxnp4v']);

let textList = ref([]);
let textId = ref(1);
const textClick = (data) => {
    drawStore.setTextData(data);
    textId.value = data.id;
};

let drawConfigs = ref({});

// 上传结束
const handleChange = (data) => {
    let id = data.raw.uid;
    let name = data.raw.name;
    const reader = new FileReader();
    if (typeof FileReader === "undefined") {
        alert("您的浏览器不支持FileReader接口");
    }
    reader.onload = async (e) => {
        const text = e.target.result;

        textList.value.push({ id, name });
        drawStore.setTtextList(textList.value);

        // 解析配置文件
        let {confs} = await parseStr(text);
        drawConfigs.value = Object.assign(drawConfigs.value, { id, name, confs })
        drawStore.setDrawConfigs(drawConfigs.value);
    };
    reader.readAsText(data.raw, "utf-8");
};
const parseStr = async (text) => {
    let confs = [];
    let speaks = {};
    const list = text.split("\n").filter((item) => item.trim() !== "");
    const bgSchmea = (await import('./common/background/schema.json')).default
    list.forEach(async (item, index) => {
        let arr = item.split("：");
        if (arr.length) {
            let speak = arr[0]?.trim();
            let content = arr[1]?.trim();

            if (!speaks[speak]){
                speaks[speak] = {};
            }

            confs.push(
                {
                    id: generateUniqueID(),// id
                    speak,// 说话人
                    content,// 说话内容
                    comps: [
                        // 每个组件都有默认带有一个背景组件
                        {
                            type: 'background',
                            id: generateUniqueID(),
                            compId: generateUniqueID(),
                            compName: 'background',
                            comp: null,
                            schema: deepClone(bgSchmea)
                        }
                    ]// 组件
                }
            );
        }
    });
    return { confs, speaks};
};
const onDragStart = (data, parent, e) => {
    data.px = e.offsetX
    data.py = e.offsetY
    e.dataTransfer.setData("text/plain", JSON.stringify({ data, parent }));
};
const ondrag = (e) => {
    // console.log("ondrag", e);
}

const imgStyle = computed(()=>(data)=>{
    if (data.url) {
        return {
            backgroundImage: `url(${getImgUrl(data.url)})`
        }
    } else {
        return {}
    }
})
</script>
<style lang="scss" scoped>
.numes-list {
    height: calc(100% - 84px);
    overflow: auto;
    .upload-text {
        text-align: right;
        margin: 10px;
        margin-bottom: 0;
    }

    .texts {
        height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px 0;

        .t-item {
            padding: 0 10px;
            height: 24px;
            line-height: 24px;
            margin-bottom: 10px;
            cursor: pointer;

            &.active {
                color: #409eff;
            }

            .name {
                display: inline-block;
                margin-left: 10px;
            }
        }
    }

    .collapse {
        .item__warpper {
            padding: 0 5px;

            .items {
                display: flex;
                flex-wrap: wrap;

                .item {
                    flex-shrink: 0;
                    margin-right: 10px;
                    margin-bottom: 15px;
                    text-align: center;
                    cursor: pointer;
                    &:nth-child(2n) {
                        margin-right: 0;
                    }

                    .imgs {
                        width: 100px;
                        height: 100px;
                        position: relative;
                        background-origin: content;
                        /*从content区域开始显示背景*/
                        background-position: 50% 50%;
                        /*图片上下左右居中*/
                        background-size: contain;
                        /*保持图像本身的宽高比例，将图片缩放到宽度或高度正好适应定义背景的区域*/
                        background-repeat: no-repeat;

                        img {
                            width: 100%;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                }

                &.face {
                    .item {
                        // height: 40px;

                        .imgs {
                            width: 50px;
                            height: 50px;
                            img {
                                position: static;
                                transform: none;
                            }
                        }
                    }
                }

                &.weapon {
                    .item {
                        height: 200px;

                        .imgs {
                            height: auto;

                            img {
                                position: static;
                                transform: none;
                            }
                        }
                    }
                }

                &.effect {
                    .item {
                        height: 200px;

                        .imgs {
                            height: auto;

                            img {
                                position: static;
                                transform: none;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
