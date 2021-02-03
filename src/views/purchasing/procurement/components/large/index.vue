<template>
  <div class="content">
    <!--    销售订单号列表弹窗-->
    <el-dialog
      title="大类列表"
      model
      :visible.sync="isstorklDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">大类名称</span>
        <el-input v-model.trim="stork.largeName" class="input-width" size="mini" placeholder="请输入大类名称" @keyup.enter.native="storkSearch" />
        <el-button size="mini" type="primary" @click="storkSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="storklDialogData"
        :table-header="storkDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="storklSelectRow"
      />
      <jc-pagination
        v-show="stork.total > 0"
        :total="stork.total"
        :page.sync="stork.pageNum"
        :limit.sync="stork.pageSize"
        @pagination="handleGetUntreated"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryLargehanList } from '@/api/encodingRules/categories'
import { toMxAmina } from '@/components/ToMxamineState'
export default {
  components: {
    jcTable,
    jcPagination
  },
  props: {
    msg: {
      type: String,
      default: ''
    },
    msg2: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 客户列表数据分页
      isstorklDialog: true,
      stork: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        largeName: ''
      },
      storklDialogData: [], // 销售数据
      storkDialogHeader: [
        { label: '大类类型', prop: 'largeCode', align: 'center', minWidth: '155px' },
        { label: '大类名称', prop: 'largeName', align: 'center', minWidth: '110px' },
        { label: '中类组合', type: 'mediumName', align: 'center', minWidth: '110px' },
        { label: '小类组合', prop: 'typeArray', align: 'center', minWidth: '110px' },
        { label: '物料属性组合', prop: 'attributeArray', align: 'center', minWidth: '110px' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { largeCode: '' }
    }
  },
  created() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取销售订单
    async handleGetUntreated() {
      const DATA = { pageNum: this.stork.pageNum, pageSize: this.stork.pageSize, largeName: this.stork.largeName }
      const { data: RES, data: total } = await queryLargehanList(DATA)
      this.storklDialogData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      this.stork.total = total.total
    },
    // 大类列表弹窗选中
    storklSelectRow(val) {
      this.prodValue = val
      this.$emit('large', this.prodValue)
    },
    storkSearch() {
      this.stork.pageNum = 1
      this.handleGetUntreated()
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.isstorklDialog = false
      this.$emit('large', this.prodValue)
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
