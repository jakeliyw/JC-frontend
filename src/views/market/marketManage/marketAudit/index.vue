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
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import {
  queryReviewSalorderList
} from '@/api/marketManage/marketOrder'
import searData from '@/components/Search/mixin'
import search from '@/components/Search'
import { toMxAmina } from '@/components/ToMxamineState'

export default {
  name: 'MarketAudit',
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
        { label: '销售员', prop: 'fsaler', align: 'center', minWidth: '90px' },
        { label: '状态流程', type: 'states', align: 'center', minWidth: '180px' },
        { label: '禁用状态', type: 'tag', align: 'center', minWidth: '100px' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', align: 'center', fixed: 'right', minWidth: '80px' }
      ],
      // 表格数据
      tableData: [],
      cellStyle: { padding: '0' },
      i: '',
      tableFilters: []
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES } = await queryReviewSalorderList(DATA)
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
