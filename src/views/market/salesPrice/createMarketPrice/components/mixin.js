import { querySalPriceMaterial } from '@/api/marketManage/marketPriceList'
import { querySalOrderLog } from '@/api/marketManage/marketOrder'

export default {
  methods: {
    // 获取出厂价
    async querySalPriceMaterial() {
      const DATA = { fmaterialId: this.tableData[this.tableIndex].fmaterialId }
      const { data: RES } = await querySalPriceMaterial(DATA)
      // 销售系数和表格数据
      // const fpriceBase = (this.tableData[this.tableIndex].fpriceBase) / 100
      this.tableData[this.tableIndex].fmaterialId = RES.fmaterialId
      this.tableData[this.tableIndex].fmaterialIdName = RES.fnumber
      this.tableData[this.tableIndex].fdescripTion = RES.fdescripTion
      this.tableData[this.tableIndex].funit = RES.funitName
      this.tableData[this.tableIndex].deliveryPrice = RES.deliveryPrice
      this.tableData[this.tableIndex].fdownPrice = RES.fdownPrice

      this.tableData[this.tableIndex].fdownPrice1 = (RES.fdownPrice / 0.5).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice2 = (RES.fdownPrice / 0.55).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice3 = (RES.fdownPrice / 0.6).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice4 = (RES.fdownPrice / 0.65).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice5 = (RES.fdownPrice / 0.7).toFixed(4)

      this.tableData[this.tableIndex].fdownPrice11 = (RES.fdownPrice / 0.5 * this.rate).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice12 = (RES.fdownPrice / 0.55 * this.rate).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice13 = (RES.fdownPrice / 0.6 * this.rate).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice14 = (RES.fdownPrice / 0.65 * this.rate).toFixed(4)
      this.tableData[this.tableIndex].fdownPrice15 = (RES.fdownPrice / 0.7 * this.rate).toFixed(4)
      // // 基准价
      // this.tableData[this.tableIndex].fdownPrice = (RES.deliveryPrice * (1 + fpriceBase)).toFixed(4)
    },
    // 获取其它
    async handleOther() {
      const id = this.$route.params.id
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fid: id }
      const { data: RES } = await querySalOrderLog(DATA)
      this.otherUrlObject = RES.operator
      this.total = RES.total
      this.otherLogTableData = RES.array
    }
  }
}
