

export function speak(str) {
    return new Promise((resolve, reject) => {
        // console.log('getVoices:', window.speechSynthesis.getVoices())
        // 创建一个新的SpeechSynthesisUtterance对象
        const utterance = new SpeechSynthesisUtterance();
        utterance.lang = 'zh-CN'; // 设置语言为中文
        utterance.text = str; // 设置要读出的文本

        // 使用默认的语音合成器进行朗读
        speechSynthesis.speak(utterance);
        utterance.onend = () => {
            resolve(true)
        }
    })
}

export function sleep(delay = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}


// 唯一id
export function generateUniqueID() {
    let uniqueID = Math.floor(Math.random() * Date.now()).toString(36);
    return uniqueID;
}