<template>
    <div class="wall__warpper">
        <img class="bg" src="../../../assets/images/wall.jpg" alt="">
        <div class="text__warpper">
            <!-- <div class="print-title" :style="titStyle">{{ printStr }}</div> -->
            <div class="print-title" :style="titStyle">{{ str }}</div>
        </div>
        <div v-if="false" class="ranking">
            <div class="items">
                <div class="item" v-for="(item, index) in 3" >
                    <div class="index"> {{ index + 1 }}</div>
                    <div class="name">sfsfsdfsdf认为人</div>
                    <div v-if="index != 0" class="num">9</div>
                    <div v-if="index == 0" class="tip">请截图</div>
                </div>
            </div>
            <div class="roll__wrapper">
                <div ref="roll" class="items roll roll">
                    <div class="item" v-for="(item, index) in 20">
                        <div class="index"> {{ index + 4 }}</div>
                        <div class="name">sfsfsdfsdf认为人</div>
                        <div class="num">9</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
const { proxy } = getCurrentInstance();

// 定义需要打印的文案
let str = ref('天下兴亡，匹夫有责有责。');
// 计算文案长度
let titStyle = computed(() => {
    let len = str.value.length+1;
    let time = Math.round(len * (5000/12) / 1000)
    return {
        width: `${len}em`,
        animationDuration: `${time}s, 0.5s`,
        animationTimingFunction: `steps(${len})`
    }
})


function sleep(delay = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}

</script>

<style lang="scss" scoped>
.wall__warpper {
    position: relative;
    width: 60%;
    margin: 0 auto;

    .bg {
        width: 100%;
    }

    .text__warpper {
        position: absolute;
        left: 3%;
        bottom: 55%;
    }

    .ranking {
        position: absolute;
        top: 20px;
        right: 20px;
        overflow: hidden;
        height: 150px;
        width: 160px;
        border: 1px solid #000;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px 0;

        .items {
            .item {
                display: flex;
                padding: 0 10px;
                color: #fff;

                .index {
                    margin-right: 10px;
                    height: 21px;
                    line-height: 23px;
                }

                .name {
                    margin-right: 15px;
                    width: 90px;
                    /* 限制容器宽度 */
                    white-space: nowrap;
                    /* 不换行 */
                    overflow: hidden;
                    /* 隐藏溢出部分 */
                    text-overflow: ellipsis;
                    /* 使用省略号表示被省略的部分 */
                }

                .tip {
                    font-size: 10px;
                    width: 37px;
                    height: 21px;
                    line-height: 21px;
                }
            }

            &.roll {
                // height: 76px;
                overflow: auto;

                &::-webkit-scrollbar {
                    display: none;
                }
            }
        }
    }

    .roll__wrapper {
        position: relative;
        overflow: hidden;

        .roll {
            top: 0px;
            animation: scrollText1 20s infinite linear;

            div {
                height: 21px;
            }

            &:hover {
                animation-play-state: paused;
            }
        }
    }
    @keyframes scrollText1 {
        0% {
            transform: translateY(0px);
        }

        100% {
            transform: translateY(-420px);
        }
    }


    .print-title {
        font-size: 50px;
        color: red;
        // 本例12个文字(加标点符号)；有多少个文字，width就是多少个em
        // width: 13em;
        // 加上两个动画，一个是打字动画，使用steps让字一个一个的出现，注意step和字数保持一致，光标动画也是同理
        // animation: printWords 5s steps(1) infinite, cursor 0.5s steps(1) infinite;
        // 要设置不允许换行，且溢出隐藏
        white-space: nowrap;
        overflow: hidden;
        // 使用右边框作为打印的指针光标
        border-right: 1px solid #000;
        // mix-blend-mode: overlay;
    }

    @keyframes printWords {
        0% {
            width: 0;
        }
    }

    @keyframes cursor {
        50% {
            border-color: transparent;
        }
    }
}
</style>