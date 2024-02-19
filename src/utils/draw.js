/**
 * 加载本地图片地址
 * @param {*} path 例如：assets/images/bg1.jpeg
 * @returns
 */
export function getImgUrl(path) {
    return new URL(`../${path}`, import.meta.url).href;
}