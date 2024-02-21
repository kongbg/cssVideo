
const useDrawStore = defineStore(
  'draw',
  {
    state: () => ({
      drawConf: {},// 所有对话配置
      currentConfIndex: 0,// 当前配置索引
      currentConfInfo: {
        comps: []
      }, // 当前配置信息
      currentCompIndex: 0,// 当前组件索引
      currentCompInfo: {
        schema: {}
      },// 当前组件信息
      textData: {}, // 上传的文本信息

      drawConfigs: {
        confs: []
      }, // 所有对话配置
      textList: [], // 所有文本列表
      mode: 'desgin', // 模式
      dragElType: '', // 当前拖拽的元素类型


      // 
      videoTypes: [] // 视频总分类
    }),
    actions: {
      setVideoTypes (data) {
        this.videoTypes = data
      },
      setDragElType(data) {
        // console.log('setDragElType:', data)
        this.dragElType = data.type;
      },
      setDrawConf(data) {
        this.drawConf = data;
      },
      setCurrentConfIndex(index) {
        this.currentConfIndex = index;
      },
      setCurrentConfInfo(data) {
        this.currentConfInfo = data;
      },
      setCurrentCompIndex(index) {
        this.currentCompIndex = index;
      },
      setCurrentCompInfo(data) {
        this.currentCompInfo = data;
      },
      setTextData(data) {
        this.textData = data
      },

      setDrawConfigs(data) {
        this.drawConfigs = data
      },
      setTtextList(data) {
        this.textList = data
      },
      setMode(data) {
        this.mode = data
      }
    },
    getters: {
      confs: (state) => {
        return state.drawConfigs.confs
      }
    },
    // 开启数据持久化
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'draw',
          storage: localStorage,
        },
      ],
    }

  })

export default useDrawStore
