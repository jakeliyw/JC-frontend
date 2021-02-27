<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryRefuse" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="mini" @click="addPriceList">新增价目</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        serial
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
        :page.sync="pageNum"
        :limit.sync="size"
        @pagination="handleGetPurchaseList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryFailPurPriceList, updateAgainReview } from '@/api/purchaseManagement/refusePriceList'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
export default {
  name: 'RefusePriceList',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 4,
      fbillNo: 'fname',
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '价目编码', prop: 'fnumbe', minWidth: '100px', align: 'center' },
        { label: '价目表名称', prop: 'fname', align: 'center', minWidth: '100px' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center', minWidth: '200px' },
        { label: '物料编码', prop: 'fnumber', minWidth: '120px', align: 'center' },
        { label: '物料型号', prop: 'fmodel', minWidth: '50px', align: 'center' },
        { label: '物料描述', prop: 'fdescripTion', minWidth: '250px', align: 'center' },
        { label: '物料规格', prop: 'fspecificaTion', minWidth: '100px', align: 'center' },
        { label: '是否含税', prop: 'fisIncludedTax', align: 'center', minWidth: '50px' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', minWidth: '150px' },
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
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
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
      const { message, code } = await updateAgainReview({ fid })
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
  .header{
    position:relative;
   .header-name{
      width: 100%;
    }
    .btn{
      transform: translateY(18%);
      margin-left: 410px!important;
    }
  }
}
</style>
