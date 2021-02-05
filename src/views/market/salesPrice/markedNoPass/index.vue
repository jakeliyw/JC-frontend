<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fname" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <template v-slot:tagSlot="col">
          <el-link type="primary" @click="particulars(col.scope.row.fid)">{{ col.scope.row.fnumber }}</el-link>
        </template>
        <template v-slot:billSlot="col">
          <el-checkbox v-model="col.scope.row.fisIncludedTax" disabled />
        </template>
        <template v-slot:btnStates="col">
          <el-steps :active="col.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
            <el-step title="销售主管" />
            <el-step title="财务" />
          </el-steps>
        </template>
        <template v-slot:btnState="col">
          <el-tag v-if="col.scope.row.fdocumentStatus !== '重新审核'">{{ col.scope.row.fdocumentStatus }}</el-tag>
          <el-tag v-else type="danger">{{ col.scope.row.fdocumentStatus }}</el-tag>
        </template>
        <template v-slot:btnSlot="col">
          <el-button type="danger" size="mini" @click="review(col.scope.row.fid)">重新审核</el-button>
          <el-button type="warning" size="mini" @click="detailPurchase(col.scope.row.fid)">修改价目</el-button>
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
  queryFailPriceList,
  againReviewPrice
} from '@/api/marketManage/marketPriceList'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { toMxAmina } from '@/components/ToMxamineState'
export default {
  name: 'MarkedNoPass',
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
      ftype: 7,
      fname: 'fname', // 价目名称
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表格数据
      tableData: [],
      tableHeader: [
        { label: '销售组织', prop: 'fsaleOrg', align: 'center', minWidth: '130px' },
        { label: '编码', type: 'tag', align: 'center', minWidth: '110px' },
        { label: '价目名称', prop: 'fname', align: 'center', minWidth: '100px' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '含税', type: 'bill', align: 'center' },
        { label: '价目对象', prop: 'fpriceObject', align: 'center', minWidth: '100px' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center', minWidth: '150px' },
        { label: '状态流程', type: 'states', align: 'center', minWidth: '180px' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '110px' },
        { label: '操作', type: 'btn', fixed: 'right', align: 'center', minWidth: '200px' }
      ]
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES } = await queryFailPriceList(DATA)
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
      this.$router.push({ path: `/MarkedEdit/${id}` })
    },
    // 审批通过
    async review(fid) {
      const { message, code } = await againReviewPrice({ fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.reload()
      this.$router.push({ name: 'MarkedUntreated' })
    },
    // 价目详情
    particulars(id) {
      this.$router.push({ path: `/marketDetail/${id}` })
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
