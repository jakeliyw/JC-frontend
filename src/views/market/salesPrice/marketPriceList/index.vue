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
          @keyup.enter.native="handleQuerySonClass"
        />
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
        <el-table-column v-if="false" prop="fid" label="销售价目ID" min-width="80" align="center" />
        <el-table-column prop="fsaleOrg" label="销售组织" min-width="150" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="fnumber" label="编码" min-width="120" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="particulars(scope.row.fid)">{{ scope.row.fnumber }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="fname" label="销售价目名称" min-width="80" align="center" />
        <el-table-column prop="fcurrency" label="币别" min-width="80" align="center" />
        <el-table-column prop="fisIncludedTax" label="含税" min-width="100" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.fisIncludedTax" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="fpriceObject" label="价目对象" min-width="80" align="center" />
        <el-table-column prop="fcreateDate" label="创建时间" min-width="80" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="attributeArray" label="操作" min-width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="btn" size="mini" @click="particulars(scope.row.fid)">详情</el-button>
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
        @pagination="getSonClass"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import {
  querySalPriceList
} from '@/api/marketManage/marketPriceList'

export default {
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
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 销售数据
      tableHeader: []
    }
  },
  mounted() {
    this.getSonClass()
  },
  methods: {
    // 获取销售价目列表数据
    async getSonClass() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fbillNo: this.fbillNo }
      const { data: RES, data: total } = await querySalPriceList(DATA)
      this.tableData = RES.array
      this.total = total.total
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.getSonClass()
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
}
</style>
