import { queryMaterialDetail } from '@/api/basicManagement/materielList'

export default {
  methods: {
    // 跳转物料主数据
    jumpMateriel() {
      if (!this.prodValue.FNUMBER.trim()) {
        this.$message.error('物料编码为空,不能跳转！')
        return
      }
      queryMaterialDetail({ fnumber: this.prodValue.FNUMBER }).then(res => {
        if (res.code === 0) {
          this.$router.push({ path: `/detailMateriel/${this.prodValue.FNUMBER}` })
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 子物料编码跳转bom数据
    sonJumpMateriel(FNUMBER) {
      if (!FNUMBER) {
        this.$message.error('物料编码为空,不能跳转！')
        return
      }
      queryMaterialDetail({ fnumber: FNUMBER }).then(res => {
        if (res.code === 0) {
          this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
        }
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
