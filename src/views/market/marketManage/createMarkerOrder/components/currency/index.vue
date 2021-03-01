<template>
  <div class="content">
    <!--结算币别列表弹窗-->
    <el-dialog
      title="结算币别"
      model
      :visible.sync="isCurrencyDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">币别名称</span>
        <el-input v-model.trim="currency.fname" class="input-width" size="mini" placeholder="请输入币别名称" @keyup.enter.native="currencySearch" />
        <el-button size="mini" type="primary" @click="currencySearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="currencyDialogData"
        :table-header="currencyDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="currencySelectRow"
      >
        <el-table-column label="编码" prop="fnumber" align="center" />
        <el-table-column label="名称" prop="fname" align="center" />
        <el-table-column label="货币代码" prop="fcode" align="center" />
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fdocumentStatus=='C'">已审核</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="禁用状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fforbidStatus=='C'">已审核</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
      </jc-table>
      <jc-pagination
        v-show="currency.total > 0"
        :total="currency.total"
        :page.sync="currency.pageNum"
        :limit.sync="currency.pageSize"
        @pagination="queryTBdCurrency"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTBdCurrency } from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      // 结算币别
      isCurrencyDialog: true,
      currency: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      currencyDialogData: [],
      currencyDialogHeader: [],
      cellStyle: { padding: '5px 0' },
      prodValue: { fsettleCurrIdName: '', fsettleCurrId: '', isCurrencyDialog: true }
    }
  },
  created() {
    this.queryTBdCurrency()
  },
  methods: {
    // 查询结算币别
    async queryTBdCurrency() {
      this.isCurrencyDialog = true
      const DATA = this.currency
      const { data: RES } = await queryTBdCurrency(DATA)
      this.currencyDialogData = RES.array
      this.currency.total = RES.total
    },
    currencySearch() {
      this.currency.pageNum = 1
      this.queryTBdCurrency()
    },
    // 选择结算货币
    currencySelectRow(item) {
      this.prodValue.fsettleCurrIdName = item.fname
      this.prodValue.fsettleCurrId = item.fcurrencyId
      this.prodValue.isCurrencyDialog = false
      this.prodValue.fsysmbol = item.fsysmbol
      this.$emit('currency', this.prodValue)
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.isCurrencyDialog = false
      this.$emit('currency', this.prodValue)
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  @include listBom;
}
</style>

