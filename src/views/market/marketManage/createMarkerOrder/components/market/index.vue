<template>
  <div class="content">
    <!--销售员列表弹窗-->
    <el-dialog
      title="销售员列表"
      model
      :visible.sync="ismarketlDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">销售员名称</span>
        <el-input v-model.trim="market.fname" class="input-width" size="mini" placeholder="请输入销售员名称" @keyup.enter.native="marketSearch" />
        <el-button size="mini" type="primary" @click="marketSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="marketDialogData"
        :table-header="marketDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="marketlSelectRow"
      />
      <jc-pagination
        v-show="market.total > 0"
        :total="market.total"
        :page.sync="market.pageNum"
        :limit.sync="market.pageSize"
        @pagination="querySalesperson"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { querySalesperson } from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      // 销售员分页
      market: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      ismarketlDialog: true,
      marketDialogData: [],
      marketDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '销售员名称', prop: 'fname', align: 'center' },
        { label: '销售员部门', prop: 'fdeptName', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { fsalerIdName: '', fsalerId: '', ismarketlDialog: true }
    }
  },
  created() {
    this.querySalesperson()
  },
  methods: {
    // 查询销售员
    async querySalesperson() {
      this.ismarketlDialog = true
      const DATA = this.market
      const { data: RES } = await querySalesperson(DATA)
      this.marketDialogData = RES.array
      this.market.total = RES.total
    },
    marketSearch() {
      this.market.pageNum = 1
      this.querySalesperson()
    },
    // 选择销售员
    marketlSelectRow(item) {
      this.prodValue.fsalerIdName = item.fname
      this.prodValue.fsalerId = item.fsalerId
      this.prodValue.ismarketlDialog = false
      this.$emit('market', this.prodValue)
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  @include listBom;
}
.materiel-form {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;

  .materiel-code {
    margin-right: 5px;
    font-weight: bold;
    font-size: 14px;
    min-width: 65px;
    color: #606266;
    line-height: 40px;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
</style>

