<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="(item, index) of oneMaterielData" :key="index" :label="item.largeName" :name="item.largeCode">
        <div class="table-content">
          <jc-table
            :table-data="tableData"
            :table-header="tableHeader"
            :cell-style="cellStyle"
            table-height="calc(100vh - 330px)"
          >
            <el-table-column prop="fnumber" label="物料编码" align="center" min-width="180px" />
            <el-table-column prop="fdescripTion" label="物料描述" align="center" min-width="500px" />
            <el-table-column prop="foldnumber" label="旧物料编码" align="center" min-width="100px" />
            <el-table-column prop="fmodel" label="型号" align="center" min-width="100px" />
            <el-table-column prop="fname" label="供应商" align="center" min-width="150px" />
            <el-table-column prop="fspecificaTion" label="规格" align="center" min-width="120px" />
            <el-table-column prop="fthickness" label="厚度" align="center" />
            <el-table-column prop="fcreateDate" label="价格有效期" align="center" min-width="110px" />
            <el-table-column label="价格" align="center">
              <el-table-column prop="fprice" label="净价" align="center" />
              <el-table-column prop="ftaxRate" label="税率" align="center" />
              <el-table-column prop="ftaxPrice" label="含税价" align="center" />
            </el-table-column>
            <el-table-column prop="unitName" label="计价单位" align="center" />
            <el-table-column prop="fsettleType" label="付款方式" align="center" min-width="100px" />
            <el-table-column prop="Stirng" label="最小起订量" align="center" min-width="100px" />
            <el-table-column prop="Stirng" label="采购周期" align="center" />
            <el-table-column prop="Stirng" label="账期" align="center" min-width="100px" />
          </jc-table>
          <jcPagination
            v-show="total > 0"
            :total="total"
            :page.sync="page"
            :limit.sync="size"
            @pagination="getRoleList"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryLargeList } from '@/api/encodingRules/codeComparative'
import { queryPurPricePrice } from '@/api/mrpView'
import jcTitle from '@/components/Title'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'

export default {
  name: 'Maintenance',
  components: {
    jcTitle,
    jcTable,
    jcPagination
  },
  data() {
    return {
      total: 12,
      page: 1,
      size: 10,
      activeName: '50', // 第一个选项卡
      largeCode: '', // 选择的大类名称
      oneMaterielData: [], // tabs标签
      tableData: [], // 列表数据
      tableHeader: [],
      cellStyle: { padding: '10 10' } // 行高
    }
  },
  watch: {
    // 监听切换选项卡
    activeName(val) {
      this.tableData = []
      this.largeCode = val
      this.getRoleList()
    }
  },
  mounted() {
    this.queryLargeList()
  },
  methods: {
    // 查询编码对照表数据
    async getRoleList() {
      const DATA = { largeCode: this.largeCode, pageNum: this.page, pageSize: this.size }
      const { data: RES } = await queryPurPricePrice(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 查询大类列表
    async queryLargeList() {
      const { data: RES } = await queryLargeList()
      for (const item of RES) {
        if (item.largeName.indexOf('成品-') !== -1) {
          this.oneMaterielData.push(item)
          // 赋值
          this.largeCode = this.oneMaterielData[0].largeCode
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('成品部件') !== -1) {
          this.oneMaterielData.push(item)
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('半成品') !== -1) {
          this.oneMaterielData.push(item)
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('主材') !== -1 || item.largeName.indexOf('五金') !== -1 || item.largeName.indexOf('功能') !== -1) {
          this.oneMaterielData.push(item)
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('主材') === -1 && item.largeName.indexOf('五金') === -1 && item.largeName.indexOf('功能') === -1 && item.largeName.indexOf('半成品') === -1 && item.largeName.indexOf('成品部件') === -1 && item.largeName.indexOf('成品-') === -1) {
          this.oneMaterielData.push(item)
        }
      }
      this.getRoleList()
    }
  }
}
</script>
<style lang="scss">
.el-tabs__nav{
  white-space: initial
}
.el-tabs .el-tabs__item{
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
}
 .el-table th{
  padding: 5px 0;
}
</style>
<style scoped lang="scss">
.content {
  @include listBom;
}
</style>
