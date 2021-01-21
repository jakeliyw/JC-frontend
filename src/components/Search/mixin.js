import { queryCriteria } from '@/api/search'

export default {
  created() {
    this.queryCriteria()
  },
  methods: {
    queryCriteria() {
      queryCriteria().then(res => {
        this.selectData = res.data
      })
    }
  }
}
