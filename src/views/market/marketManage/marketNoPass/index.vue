<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" :msg2="padlocktr" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
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
          <el-button type="warning" size="mini" @click="approval(clo.scope.row.fid)">重新审核</el-button>
          <el-button type="danger" size="mini" @click="revisePurchase(clo.scope.row.fid)">修改订单</el-button>
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
  queryFailSalorderList,
  againReviewSalorder
} from '@/api/marketManage/marketOrder'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { toMxAmina } from '@/components/ToMxamineState'

export default {
  name: 'MarketNoPass',
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
        { label: '客户分组', prop: 'fprimaryGroup', align: 'center' },
        { label: '客户', prop: 'customer', align: 'center', filters: [] },
        { label: '产品数量', prop: 'fqty', align: 'center' },
        { label: '结算货币', prop: 'fsettleCurr', align: 'center' },
        { label: '销售部门', prop: 'fsaleDept', align: 'center' },
        { label: '销售员', prop: 'fsaler', align: 'center' },
        { label: '状态流程', type: 'states', align: 'center', minWidth: '180px' },
        { label: '禁用状态', type: 'tag', align: 'center' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', align: 'center', fixed: 'right', minWidth: '200px' }
      ],
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
      const { data: RES } = await queryFailSalorderList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      this.tableHeader.forEach(res => {
        res.filters = []
        this.tableData.forEach(item => {
          if (item[res.prop]) {
            res.filters.push({
              text: item[res.prop], value: item[res.prop]
            })
          }
        })
        const obj = {}
        const result = []
        res.filters.map(item => {
          if (!obj[item.text]) {
            result.push(item)
            obj[item.text] = true
          }
        })
        res.filters = result
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.padlocktr = '1'
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 修改订单
    revisePurchase(id) {
      this.$router.push({ path: `/marketRevising/${id}` })
    },
    // 重新审核
    async approval(fid) {
      const { message, code } = await againReviewSalorder({ fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.reload()
      this.$router.push({ name: 'MarketUntreated' })
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
      z-index: 999;
    }
  }
}
</style>
