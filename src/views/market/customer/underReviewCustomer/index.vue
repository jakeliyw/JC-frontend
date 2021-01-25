<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUnderReview" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUnderReview">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
            <el-step title="研发审核" />
            <el-step title="财务审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" @click="detailCustomer(clo.scope.row.fcustId)">查询客户</el-button>
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
        @pagination="handleGetData"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryReviewList } from '@/api/marketManage/customer/underReviewCustomer'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
export default {
  name: 'UnderReviewCustomer',
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 6,
      fbillNo: 'fname',
      total: 0, // 总条目
      pageNum: 0, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '组织名称', prop: 'fuseorg', align: 'center' },
        { label: '客户编码', prop: 'fnumber', minWidth: '100px', align: 'center' },
        { label: '客户名称', prop: 'fname', align: 'center', minWidth: '200px' },
        { label: '客户分组', prop: 'fcustGroup', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', minWidth: '150px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '250px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    // 获取列表数据
    async handleGetData() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
      const { data: RES } = await queryReviewList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryUnderReview() {
      this.pageNum = 1
      this.handleGetData()
    },
    // 详情
    detailCustomer(fcustId) {
      this.$router.push({ path: `/detailCustomer/${fcustId}` })
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
      z-index: 999;
    }
  }
}
</style>
