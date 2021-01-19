<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">价目名称</span>
        <el-input
          v-model.trim="fname"
          class="input-content"
          placeholder="请输入价目名称"
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
        <el-table-column prop="fsaleOrg" label="销售组织" align="center" min-width="130px" :show-overflow-tooltip="true" />
        <el-table-column prop="fnumber" label="编码" align="center" min-width="110px">
          <template slot-scope="scope">
            <el-link type="primary" @click="detailPurchase(scope.row.fid)">{{ scope.row.fnumber }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="fname" label="价目名称" align="center" />
        <el-table-column prop="fcurrency" label="币别" align="center" />
        <el-table-column prop="fisIncludedTax" label="含税" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.fisIncludedTax" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="fpriceObject" label="价目对象" align="center" />
        <el-table-column prop="fcreateDate" label="创建时间" align="center" min-width="155px" />
        <el-table-column label="状态流程" min-width="180px" align="center">
          <template slot-scope="clo">
            <el-steps :active="clo.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
              <el-step title="销售主管" />
              <el-step title="财务" />
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="230px" fixed="right" align="center">
          <template slot-scope="clo">
            <el-button type="success" size="mini" @click="untreated(clo.row.fid)">通过</el-button>
            <el-button type="danger" size="mini" @click="untreatedRejection(clo.row.fid)">不通过</el-button>
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
import jcTitle from '@/components/Title'
import {
  queryUntreatePriceList,
  reviewPrice,
  notReviewPrice
} from '@/api/marketManage/marketPriceList'

export default {
  name: 'MarkedUntreated',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      fname: '', // 价目名称
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
      const { data: RES } = await queryUntreatePriceList(DATA)
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
    async untreated(fid) {
      const { message, code } = await reviewPrice({ fid })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.reload()
    },
    // 审批不通过
    async untreatedRejection(fid) {
      const { message, code } = await notReviewPrice({ fid })
      if (code !== 0) {
        return
      }
      this.reload()
      this.$message.success(message)
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
