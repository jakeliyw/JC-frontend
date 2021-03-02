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
        <el-table-column label="产品编码" align="center" />
        <el-table-column label="产品名称" align="center" />
        <el-table-column label="销售总数量" align="center" />
        <el-table-column label="内销销售数量" align="center" />
        <el-table-column label="外销销售数量" align="center" />
        <el-table-column label="电商销售数量" align="center" />
        <el-table-column label="产品销售排名" align="center" />
      </jc-table>
      <div class="footer">
        <jc-pagination
          :total="total"
          :page.sync="pageNum"
          :limit.sync="size"
          @pagination="proRankingList"
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
  name: 'ProductRanking',
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
    this.proRankingList()
  },
  methods: {
    proRankingList() {
      console.log('产品')
    }
  }
}
</script>
<style lang="scss" scope>
.content {
  @include listBom;
}
</style>
