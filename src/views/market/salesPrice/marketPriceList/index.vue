<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fname" @seek="collect" @hand="handleQuerySonClass" />
        <el-button type="primary" class="btn" size="mini" @click="handleQuerySonClass">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
        serial
      >
        <template v-slot:tagSlot="col">
          <el-link type="primary" @click="particulars(col.scope.row.fid)">{{ col.scope.row.fnumber }}</el-link>
        </template>
        <template v-slot:billSlot="col">
          <el-checkbox v-model="col.scope.row.fisIncludedTax" disabled />
        </template>
        <template v-slot:btnState="col">
          <el-tag v-if="col.scope.row.fdocumentStatus !== '重新审核'">{{ col.scope.row.fdocumentStatus }}</el-tag>
          <el-tag v-else type="danger">{{ col.scope.row.fdocumentStatus }}</el-tag>
        </template>
        <template v-slot:btnSlot="col">
          <el-button type="primary" class="btn" size="mini" @click="particulars(col.scope.row.fid)">详情</el-button>
          <el-button type="danger" size="mini" @click="untreatedRejection(col.scope.row.fid)">反审核</el-button>

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
  notReviewPrice,
  querySalPriceList
} from '@/api/marketManage/marketPriceList'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { toMxAmina } from '@/components/ToMxamineState'
export default {
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
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 销售数据
      tableHeader: [
        { label: '销售组织', prop: 'fsaleOrg', align: 'center', minWidth: '130px' },
        { label: '编码', type: 'tag', align: 'center', minWidth: '110px' },
        { label: '价目名称', prop: 'fname', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '含税', type: 'bill', align: 'center' },
        { label: '价目对象', prop: 'fpriceObject', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center', minWidth: '150px' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '110px' },
        { label: '操作', type: 'btn', fixed: 'right', align: 'center', minWidth: '160px' }
      ]
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取销售价目列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES, data: total } = await querySalPriceList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      this.total = total.total
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 价目详情
    particulars(id) {
      this.$router.push({ path: `/marketDetail/${id}` })
    },
    // 反审核
    async untreatedRejection(fid) {
      const DATA = {
        fid: fid,
        fuserId: window.sessionStorage.getItem('fuserId')
      }
      const { message, code } = await notReviewPrice(DATA)
      if (code === 0) {
        this.handleGetUntreated()
        this.$message.success(message)
        this.$router.push({ name: 'MarkedNoPass' })
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
      z-index: 999;
    }
  }
}
</style>
