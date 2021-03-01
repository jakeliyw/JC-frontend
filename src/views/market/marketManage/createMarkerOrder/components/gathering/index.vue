<template>
  <div class="content">
    <!--收款条件列表弹窗-->
    <el-dialog
      title="订单收款条件"
      model
      :visible.sync="isgatheringDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">收款条件名称</span>
        <el-input v-model.trim="gathering.fname" class="input-width" size="mini" placeholder="请输入收款条件名称" @keyup.enter.native="gatheringSearch" />
        <el-button size="mini" type="primary" @click="gatheringSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="gatheringDialogData"
        :table-header="gatheringDialogHeader"
        serial
        :cell-style="cellStyle"
        table-height="53vh"
        @clickRow="gatheringSelectRow"
      />
      <jc-pagination
        v-show="gathering.total > 0"
        :total="gathering.total"
        :page.sync="gathering.pageNum"
        :limit.sync="gathering.pageSize"
        @pagination="querytReccondition"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { querytReccondition } from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      // 收款条件
      isgatheringDialog: true,
      gathering: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      gatheringDialogData: [],
      gatheringDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '收款条件名称', prop: 'fname', align: 'center' },
        { label: '多到期日设置标准', prop: 'fcapTion', align: 'center' },
        { label: '到期日计算日期', prop: 'standard', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center' }
      ],
      cellStyle: { padding: '5px 0' },
      prodValue: { frecConditionIdName: '', frecConditionId: '', isgatheringDialog: true }
    }
  },
  created() {
    this.querytReccondition()
  },
  methods: {
    // 收款条件
    async querytReccondition() {
      this.isgatheringDialog = true
      const DATA = this.gathering
      const { data: RES } = await querytReccondition(DATA)
      this.gatheringDialogData = RES.array
      this.gathering.total = RES.total
    },
    gatheringSearch() {
      this.gathering.pageNum = 1
      this.querytReccondition()
    },
    // 选择收款条件
    gatheringSelectRow(item) {
      this.prodValue.frecConditionIdName = item.fname
      this.prodValue.frecConditionId = item.frecConditionId
      this.prodValue.isgatheringDialog = false
      this.$emit('gathering', this.prodValue)
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.isgatheringDialog = false
      this.$emit('gathering', this.prodValue)
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  @include listBom;
}
</style>

