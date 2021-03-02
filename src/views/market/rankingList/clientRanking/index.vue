<template>
  <div class="content">
    <jc-title />
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        serial
        :cell-style="cellStyle"
        table-height="calc(100vh - 220px)"
      >
        <el-table-column label="客户编码" prop="" align="center" />
        <el-table-column label="客户名称" prop="" align="center" />
        <el-table-column label="所属部门" prop="" align="center" />
        <el-table-column label="销售收入" prop="" align="center" />
        <el-table-column label="销售利润" prop="" align="center" />
        <el-table-column label="毛利润率" prop="" align="center" />
        <el-table-column label="基准价差异利润" prop="" align="center" />
        <el-table-column label="销售排名" prop="" align="center" />
      </jc-table>
      <div class="footer">
        <jc-pagination
          :total="total"
          :page.sync="pageNum"
          :limit.sync="size"
          @pagination="cliRankingList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import jcTitle from '@/components/Title/index'
import jcTable from '@/components/Table/index'
import jcPagination from '@/components/Pagination/index'
export default {
  name: 'ClientRanking',
  components: {
    jcTitle,
    jcTable,
    jcPagination
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      cellStyle: { padding: '5px 0' },
      total: 0,
      pageNum: 1,
      size: 10
    }
  },
  mounted() {
    this.cliRankingList()
  },
  methods: {
    cliRankingList() {
      console.log('客户')
    }
  }
}
</script>
<style lang="scss" scope>
.content {
  @include listBom;
}
</style>
