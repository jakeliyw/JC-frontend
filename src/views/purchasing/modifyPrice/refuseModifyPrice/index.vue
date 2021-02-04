<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryRefuse" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="mini" @click="addPriceList">新增调价</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="error">
            <el-step title="研发审核" />
            <el-step title="财务审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.fid)">重审调价</el-button>
          <el-button type="warning" size="mini" @click="editPurchase(clo.scope.row.fid)">修改调价</el-button>
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
import { queryFailPurPatList, updateAgainReview } from '@/api/modifyPriceManagement/refuseModifyPrice'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
export default {
  name: 'RefuseModifyPrice',
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
      ftype: 5,
      fbillNo: 'fname',
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '单据编号', prop: 'fbillno', align: 'center' },
        { label: '调价名称', prop: 'fname', align: 'center' },
        { label: '调价原因', prop: 'fdataValue', align: 'center' },
        { label: '调价日期', prop: 'fdate', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '200px' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', minWidth: '150px' },
        { label: '生效时间', prop: 'fcreateDate', align: 'center' },
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
      const { data: RES } = await queryFailPurPatList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryRefuse() {
      this.pageNum = 1
      this.handleGetPurchaseList()
    },
    // 跳转新建
    addPriceList() {
      this.$router.push({ name: 'CreateModifyPrice' })
    },
    // 修改调价
    editPurchase(fid) {
      this.$router.push({ path: `/editModifyPrice/${fid}` })
    },
    // 重审调价
    async Retrial(fid) {
      const { message, code } = await updateAgainReview({ fid: fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'UntreatedModifyPrice' })
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
