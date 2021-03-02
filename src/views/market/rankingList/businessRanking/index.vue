<template>
  <div class="content">
    <jc-title />
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        serial
        table-height="calc(100vh - 220px)"
        :cell-style="cellStyle"
      >
        <el-table-column label="业务编码" align="center" />
        <el-table-column label="业务名字" align="center" />
        <el-table-column label="业务联系方式" align="center" />
        <el-table-column label="业务所属部门" align="center" />
        <el-table-column label="业务销售业绩" align="center" />
        <el-table-column label="业务年度任务业绩" align="center" />
        <el-table-column label="年度任务完成率" align="center" />
      </jc-table>
      <div class="footer">
        <jc-pagination
          :total="total"
          :page.sync="pageNum"
          :limit.sync="size"
          @pagination="busRankingList"
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
  name: 'BusinessRanking',
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
    this.busRankingList()
  },
  methods: {
    busRankingList() {
      console.log('业务')
    }
  }
}
</script>
<style lang="scss" scope>
.content {
  @include listBom;
}
</style>
