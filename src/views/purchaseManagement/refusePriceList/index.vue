<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">供应商名称</span>
        <el-input
          v-model="fname"
          class="input-content"
          placeholder="请输入供应商名称"
          @keyup.enter.native="handleQueryRefuse"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="medium" class="btn" @click="addPriceList">新增价目</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        serial
        :table-header="tableHeader"
      >
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="error">
            <el-step title="研发审核" />
            <el-step title="财务审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.fid)">重审价目</el-button>
          <el-button type="warning" size="mini" @click="editPurchase(clo.scope.row.fid)">修改价目</el-button>
        </template>
      </jc-table>
    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetPurchaseList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryFailPurPriceList, updateAgainReview } from '@/api/purchaseManagement/refusePriceList'
export default {
  name: 'RefusePriceList',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      fname: '', // 产品描述
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '价目编码', prop: 'fnumber', width: '100px', align: 'center' },
        { label: '价目表名称', prop: 'fname', width: '200px', align: 'center' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center' },
        { label: '是否含税', prop: 'fisIncludedTax', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '生效时间', prop: 'fcreateDate', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', width: '300px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '200px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetPurchaseList()
  },
  methods: {
    // 获取列表数据
    async handleGetPurchaseList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fname: this.fname }
      const { data: RES } = await queryFailPurPriceList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryRefuse() {
      this.pageNum = 1
      this.handleGetPurchaseList()
    },
    // 跳转新建采购
    addPriceList() {
      this.$router.push({ name: 'CreatePurchasePrice' })
    },
    // 修改采购
    editPurchase(fid) {
      this.$router.push({ path: `/editPurchasePrice/${fid}` })
    },
    // 重审采购
    async Retrial(fid) {
      const { message, code } = await updateAgainReview({ fid: fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'UntreatedPriceList' })
      this.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
