<template>
    <div class="numes-list">
        <div class="createVideo">
            <el-button type="primary" size="small" @click="openCreateVideoDialog">新增</el-button>
        </div>
        <el-collapse class="collapse videoType" v-model="activeVideoType">
            <div v-if="!drawStore.videoTypes.length">空</div>
            <el-collapse-item class="item__warpper" :title="item.name" :name="item.id" v-for="(item, vindex) in drawStore.videoTypes" :key="item.id">
                <div class="upload-text">
                    <el-upload class="upload-demo" :auto-upload="false" :show-file-list="false" :on-change="data=>handleChange(data, vindex)">
                        <el-button type="primary" size="small">新增</el-button>
                    </el-upload>
                </div>
                <div class="texts">
                    <div :class="['t-item', videoId == child.id ? 'active' : '']" v-for="(child, index) in  item.list" :key="child.id"
                        @click="videoClick(child)">
                        <span>{{ index + 1 }}</span>
                        <span class="name">{{ child.name }}</span>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        
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


        <el-dialog
            v-model="createVideoDialog"
            title="Tips"
            width="500"
        >
            <div class="name-warp">
                <div class="label">视频分类名称：</div>
                <div class="value">
                    <el-input v-model="videoTypeName"/>
                </div>
            </div>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="createVideoDialog = false">取消</el-button>
                <el-button type="primary" @click="createVideo">
                确认
                </el-button>
            </div>
            </template>
        </el-dialog>
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
                url: "assets/images/person/1/1.png",
                // headUrl: "assets/images/person/1/1_head_93x80@7.png",
                headUrl: "assets/images/person/1/1_head_93x80x42x42x15x28x0x7.png",
                bodyUrl: "assets/images/person/1/1_body_93x112.png",
                compName: "person",
            },
            {
                id: '6fdok0uk',
                name: "人物2",
                url: "assets/images/person/2/2.png",
                headUrl: "assets/images/person/2/2_head_54x65x25x25x18x32x0x10.png",
                bodyUrl: "assets/images/person/2/2_body_54x68.png",
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

let drawConfigs = ref({});

// 视频相关
let createVideoDialog = ref(false);
let videoTypeName = ref('')
let videoId = ref('');
const activeVideoType =  ref([])
const openCreateVideoDialog = () => {
    createVideoDialog.value = true;
}
const videoClick = (data) => {
    videoId.value = data.id;
}
const createVideo = () => {
    let videoTypes = drawStore.videoTypes;
    let id = generateUniqueID();
    let obj = {
        id,
        name: videoTypeName.value,
        list: []
    }
    videoTypes.push(obj)
    drawStore.setVideoTypes(videoTypes);
    activeVideoType.value.push(id)
    createVideoDialog.value = false;
    videoTypeName.value = '';
}

// 上传结束
const handleChange = (data, index) => {
    let current = drawStore.videoTypes[index];
    let id = generateUniqueID();
    let name = data.raw.name.replace('.txt', '');
    
    const reader = new FileReader();
    if (typeof FileReader === "undefined") {
        alert("您的浏览器不支持FileReader接口");
    }
    reader.onload = async (e) => {
        const text = e.target.result;
        // 解析配置文件
        let {confs} = await parseStr(text);
        current.list.push({ id, name, content: text, confs });
        videoId.value = id;
        drawStore.setVideoTypes(drawStore.videoTypes);


        drawConfigs.value = Object.assign(drawConfigs.value, { id, name, confs })
        drawStore.setDrawConfigs(drawConfigs.value);
        console.log(drawStore.videoTypes)
        console.log(drawConfigs)
    };
    reader.readAsText(data.raw, "utf-8");
};
const parseStr = async (text) => {
    let confs = [];
    let speaks = {};
    let splitList = [];

    // console.log('原文：',text)

    function splitStr (str, type) {
        // 抹平 '\r\n', '\n' 差异
        str = str.replace('/\r/\n', '\n').replace('/\r', '\n');
        // console.log('处理后：',str)
        let tempStr = str.split("\n").filter((item) => item.trim() !== "");
        tempStr = tempStr.map(item => {
            let arr = item.split("：").filter(str => !!str);
            if (arr.length) {
                return {
                    content: [
                        {
                            id: generateUniqueID(),
                            speak: arr[0],
                            content: arr.length > 1 ? arr[1] : '' 
                        }
                    ]
                }
            }
        })
        if (type == 2) {
            let temp = [];
            tempStr.forEach(element => {
                temp.push(element.content[0])
            });
            return temp
        }
        return tempStr;
    }

    if (text.indexOf('###part') > -1) {
        let tempList = text.split('###part').filter(item => !!item);
        splitList = tempList.map(item => {
            return {
                content: splitStr(item, 2)
            }
        })

    } else {
        splitList = splitStr(text);
    }

    console.log('splitList:', splitList)



    
    
    const bgSchmea = (await import('./common/background/schema.json')).default
    const personSchmea = (await import('./common/person/schema.json')).default
    splitList.forEach(async (item, index) => {
        let comps = [];
        // 提取对话中的人物情况
        item.content.forEach(item => {
            let { speak } = item;
            if (!speaks[speak]){
                speaks[speak] = {};
            }

            let info = comps.find(item => {
                return item.speak == speak;
            })
            if (!info) {
                if (speak == '背景') {
                    let schema = deepClone(bgSchmea);
                    schema.actions = [
                        {
                            type: ['speak'],
                            content: item,
                            duration: 0,
                            easing: 'linear',
                            delay: 0,
                            iterations: 1,
                            shakeHead: false,
                            scaleHead: false,
                            scaleBody: false,
                            randomFace: false,
                            fill: 'forwards',
                        }
                    ]
                    comps.push(
                        {
                            type: 'background',
                            speak,
                            id: generateUniqueID(),
                            compId: generateUniqueID(),
                            compName: 'background',
                            comp: null,
                            schema
                        }
                    )
                } 
                // else {
                //     console.log('新增任务组件')
                //     let schema = deepClone(personSchmea);
                //     schema.name = speak;
                //     schema.actions = [
                //         {
                //             type: ['speak'],
                //             content: [item],
                //             duration: 0,
                //             easing: 'linear',
                //             delay: 0,
                //             iterations: 1,
                //             shakeHead: false,
                //             scaleHead: false,
                //             scaleBody: false,
                //             randomFace: false,
                //             fill: 'forwards',
                //         }
                //     ]
                //     comps.push(
                //         {
                //             type: 'person',
                //             speak,
                //             id: generateUniqueID(),
                //             compId: generateUniqueID(),
                //             compName: 'person',
                //             comp: null,
                //             schema
                //         }
                //     )
                // }
            } else {
                info.schema.actions.push(
                    {
                        type: ['speak'],
                        content: item,
                        duration: 0,
                        easing: 'linear',
                        delay: (info.schema.actions.length * 5),
                        iterations: 1,
                        shakeHead: false,
                        scaleHead: false,
                        scaleBody: false,
                        randomFace: false,
                        fill: 'forwards',
                    }
                )
            }
        })

        // // 自动创建人物
        // Object.keys(speaks).forEach(key => {
        //     if (key == '背景') {
        //         comps.push(
        //             {
        //                 type: 'background',
        //                 id: generateUniqueID(),
        //                 compId: generateUniqueID(),
        //                 compName: 'background',
        //                 comp: null,
        //                 schema: deepClone(bgSchmea)
        //             }
        //         )
        //     }
        // })

        confs.push(
            {
                id: generateUniqueID(),// id
                content: item.content,// 说话内容
                comps //组件
            }
        );
        
    });
    console.log(confs, speaks)
    return { confs, speaks};
};
const onDragStart = (data, parent, e) => {
    // console.log('onDragStart:', data, parent)
    data.px = e.offsetX
    data.py = e.offsetY
    drawStore.setDragElType(parent)
    e.dataTransfer.setData("text/plain", JSON.stringify({ ...data, type: parent.type }));
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

    .createVideo {
        text-align: right;
        margin: 10px;
        margin-bottom: 0;
    }
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
