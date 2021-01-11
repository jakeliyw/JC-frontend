<template>
  <div class="content">
    <jc-title/>
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">调价名称</span>
        <el-input
          v-model="fname"
          class="input-content"
          placeholder="请输入调价名称"
          size="mini"
          @keyup.enter.native="handleQueryUntreated"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
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
          <el-button type="success" size="mini" @click="approval(clo.scope.row.fid)">通过</el-button>
          <el-button type="danger" size="mini" @click="approvalRejection(clo.scope.row.fid)">不通过</el-button>
          <el-button type="primary" size="mini" @click="detailPurchase(clo.scope.row.fid)">详情调价</el-button>
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
  queryUntreatePurPatList,
  reviewPurPat,
  updateNotReview
} from '@/api/modifyPriceManagement/untreatedModifyPrice'

export default {
  name: 'UntreatedModifyPrice',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      fname: '', // 产品描述
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableHeader: [
        { label: '调价编码', prop: 'fbillno', align: 'center' },
        { label: '调价名称', prop: 'fname', align: 'center' },
        { label: '调价日期', prop: 'fdate', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '200px' },
        { label: '采购组织', prop: 'fpurchaseOrg', align: 'center' },
        { label: '生效时间', prop: 'fcreateDate', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', minWidth: '150px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '250px', align: 'center' }
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
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fname: this.fname }
      const { data: RES } = await queryUntreatePurPatList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 详情调价
    detailPurchase(fid) {
      this.$router.push({ path: `/detailModifyPrice/${fid}` })
    },
    // 审批通过
    async approval(fid) {
      const { message, code } = await reviewPurPat({ fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'ModifyPriceList' })
      this.reload()
    },
    // 审批不通过
    async approvalRejection(fid) {
      const { message, code } = await updateNotReview({ fid })
      if (code !== 0) {
        return
      }
      this.reload()
      this.$message.success(message)
      this.$router.push({ name: 'RefuseModifyPrice' })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
