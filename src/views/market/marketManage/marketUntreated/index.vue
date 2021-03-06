<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
        serial
      >
        <template v-slot:billSlot="clo">
          <el-link type="primary" @click="detailPurchase(clo.scope.row.fid)">{{ clo.scope.row.fbillNo }}</el-link>
        </template>
        <template v-slot:btnStates="clo">
          <el-steps :active="clo.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
            <el-step title="销售员" />
            <el-step title="销售主管" />
          </el-steps>
        </template>
        <template v-slot:tagSlot="clo">
          <el-tag v-if="clo.scope.row.fcloseStatus==='A'">否</el-tag>
          <el-tag v-else type="danger">是</el-tag>
        </template>
        <template v-slot:btnState="clo">
          <el-tag v-if="clo.scope.row.fdocumentStatus !== '重新审核'">{{ clo.scope.row.fdocumentStatus }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.fdocumentStatus }}</el-tag>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="success" size="mini" @click="approval(clo.scope.row.fid)">通过</el-button>
          <el-button type="danger" size="mini" @click="approvalRejection(clo.scope.row.fid)">不通过</el-button>
          <el-button type="primary" size="mini" @click="detailPurchase(clo.scope.row.fid)">详情</el-button>
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
        @pagination="handleGetUntreated"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcTitle from '@/components/Title'
import jcPagination from '@/components/Pagination'
import {
  queryUntreateSalorderList,
  reviewSalorder,
  notReviewSalorder
} from '@/api/marketManage/marketOrder'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
import { toMxAmina } from '@/components/ToMxamineState'
export default {
  name: 'MarketUntreated',
  inject: ['reload'],
  components: {
    jcTable,
    jcTitle,
    jcPagination,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 6,
      fbillNo: 'fbillNo', // 销售订单号
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableHeader: [
        { label: '订单时间', prop: 'fcreateDate', align: 'center', minWidth: '155px' },
        { label: '单据类型', prop: 'fbillType', align: 'center', minWidth: '110px' },
        { label: '销售订单号', type: 'bill', align: 'center', minWidth: '110px' },
        { label: '客户订单号', prop: 'fpaezText', align: 'center', minWidth: '110px' },
        { label: '客户分组', prop: 'fprimaryGroup', align: 'center', minWidth: '100px' },
        { label: '客户', prop: 'customer', align: 'center' },
        { label: '产品数量', prop: 'fqty', align: 'center', minWidth: '100px' },
        { label: '结算货币', prop: 'fsettleCurr', align: 'center', minWidth: '100px' },
        { label: '销售部门', prop: 'fsaleDept', align: 'center', minWidth: '100px' },
        { label: '销售员', prop: 'fsaler', align: 'center', minWidth: '100px' },
        { label: '状态流程', type: 'states', align: 'center', minWidth: '180px' },
        { label: '禁用状态', type: 'tag', align: 'center', minWidth: '100px' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', align: 'center', fixed: 'right', minWidth: '230px' }
      ],
      cellStyle: { padding: '0' },
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES } = await queryUntreateSalorderList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 详情
    detailPurchase(id) {
      this.$router.push({ path: `/marketParticulars/${id}` })
    },
    // 审批通过
    async approval(fid) {
      const DATA = {
        fid: fid
      }
      const { message, code } = await reviewSalorder(DATA)
      if (code === 0) {
        this.$message.success(message)
        this.reload()
        this.$router.push({ name: 'MarketAudit' })
      }
    },
    // 审批不通过
    async approvalRejection(fid) {
      const DATA = {
        fid: fid
      }
      const { message, code } = await notReviewSalorder(DATA)
      if (code === 0) {
        this.handleGetUntreated()
        this.$message.success(message)
        this.$router.push({ name: 'MarketNoPass' })
      }
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
