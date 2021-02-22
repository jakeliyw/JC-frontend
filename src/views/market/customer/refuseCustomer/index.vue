<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryRefuse" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="mini" @click="addPriceList">新增客户</el-button>
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
            <el-step title="销售审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.fcustId)">重审客户</el-button>
          <el-button type="warning" size="mini" @click="editPurchase(clo.scope.row.fcustId)">修改客户</el-button>
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
import { queryFailList, againReviewCustomer } from '@/api/marketManage/customer/refuseCustomer'
import search from '@/components/Search'
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
      ftype: 8,
      fbillNo: 'fname',
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '组织名称', prop: 'fuseorg', align: 'center' },
        { label: '客户编码', prop: 'fnumber', minWidth: '100px', align: 'center' },
        { label: '客户名称', prop: 'fname', align: 'center', minWidth: '200px' },
        { label: '客户分组', prop: 'fcustGroup', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', minWidth: '150px' },
        { label: '操作', type: 'btn', minWidth: '250px', align: 'center' }
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
      const { data: RES } = await queryFailList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryRefuse() {
      this.pageNum = 1
      this.handleGetPurchaseList()
    },
    // 跳转
    addPriceList() {
      this.$router.push({ name: 'CreateCustomer' })
    },
    // 修改
    editPurchase(fcustId) {
      this.$router.push({ path: `/editCustomer/${fcustId}` })
    },
    // 重审
    async Retrial(fcustId) {
      const { message, code } = await againReviewCustomer({ fcustId })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'UntreatedCustomer' })
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
