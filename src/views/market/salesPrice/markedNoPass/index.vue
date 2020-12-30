<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">价目名称</span>
        <el-input
          v-model="fname"
          class="input-content"
          placeholder="请输入销售订单号"
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
        :cell-style="cellStyle"
      >
        <el-table-column prop="fsaleOrg" label="销售组织" align="center" min-width="120px" />
        <el-table-column prop="fnumber" label="编码" align="center" />
        <el-table-column prop="fname" label="销售价目名称" align="center" />
        <el-table-column prop="fcurrency" label="币别" align="center" />
        <el-table-column prop="fisIncludedTax" label="含税" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.fisIncludedTax" />
          </template>
        </el-table-column>
        <el-table-column prop="fpriceObject" label="价目对象" align="center" />
        <el-table-column prop="fcreateDate" label="创建时间" align="center" />
        <el-table-column label="状态流程" min-width="150px" align="center">
          <template slot-scope="clo">
            <el-steps :active="clo.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
              <el-step title="销售主管" />
              <el-step title="财务" />
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180px" fixed="right" align="center">
          <template slot-scope="clo">
            <el-button type="success" size="mini" @click="review(clo.row.fid)">重新审核</el-button>
            <el-button type="primary" size="mini" @click="detailPurchase(clo.row.fid)">详情</el-button>
          </template>
        </el-table-column>

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
import {
  queryFailPriceList,
  againReviewPrice
} from '@/api/marketManage/marketPriceList'

export default {
  name: 'MarkedNoPass',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      fname: '', // 销售订单号
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableHeader: [],
      // 表格数据
      tableData: [],
      cellStyle: { padding: '10 10' }
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fname: this.fname }
      const { data: RES } = await queryFailPriceList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 详情
    detailPurchase(id) {
      this.$router.push({ path: `/marketDetail/${id}` })
    },
    // 审批通过
    async review(fid) {
      const { message, code } = await againReviewPrice({ fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
