import { queryCriteria } from '@/api/search'

export default {
  data() {
    return {
      padlock: true,
      searCollData: {}, // 搜索数据
      selectData: [] // 搜索下拉框数据
    }
  },
  created() {
    this.queryCriteria()
  },
  methods: {
    // 搜索数据
    collect(ev) {
      this.searCollData = ev
    },
    // 获取搜索下拉框数据
    queryCriteria() {
      const DATA = {
        ftype: this.ftype
      }
      queryCriteria(DATA).then(res => {
        this.selectData = res.data.tJxSearch
      })
    }
  }
}
