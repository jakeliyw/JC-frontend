<template>
  <div class="content">
    <el-dialog
      title="物料列表"
      model
      :visible.sync="isMaterialDialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">物料编码</span>
        <el-input
          v-model.trim="FNUMBER"
          class="input-width"
          size="mini"
          placeholder="请输入物料编码"
          @keyup.enter.native="handleMaterielSearch"
        />
        <span class="materiel-code">物料描述</span>
        <el-input
          v-model.trim="FDESCRIPTION"
          class="input-width"
          size="mini"
          placeholder="请输入物料描述"
          @keyup.enter.native="handleMaterielSearch"
        />
        <span class="materiel-code">物料规格</span>
        <el-input
          v-model.trim="FSPECIFICATION"
          class="input-width"
          size="mini"
          placeholder="请输入规格"
          @keyup.enter.native="handleMaterielSearch"
        />
        <el-button size="mini" type="primary" @click="handleMaterielSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="materielDialogData"
        :table-header="materielDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="materielSelectRow"
      />
      <jc-pagination
        v-show="materielPagination.total > 0"
        :total="materielPagination.total"
        :page.sync="materielPagination.pageNum"
        :limit.sync="materielPagination.pageSize"
        @pagination="handleGetMateriel"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { querySalMaterialList } from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    jcPagination
  },
  props: {
    msg: {
      type: Number,
      default: 2
    }, msg1: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isMaterialDialog: true,
      // 点击行的序号
      tableIndex: 0,
      rateIndex: '', // 行序号(第几行)
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      materielDialogData: [],
      materielDialogHeader: [
        { label: '物料编码', prop: 'fnumber', align: 'center', minWidth: '140px' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center', minWidth: '120px' },
        { label: '型号', prop: 'fmodel', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'left', minWidth: '180px' },
        { label: '单价', prop: 'fprice', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { isMaterialDialog: false }
    }
  },
  watch: {
    msg() {
      this.tableIndex = this.msg
    }
  },
  mounted() {
    this.handleGetMateriel()
  },
  methods: {
    // 物料弹窗选中
    async materielSelectRow(item) {
      this.prodValue = item
      item.isMaterialDialog = false
      this.$emit('material', this.prodValue)
    },
    // 打开物料编码
    async handleGetMateriel() {
      const DATA = {
        pageNum: this.materielPagination.pageNum,
        pageSize: this.materielPagination.pageSize,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION,
        fid: this.msg1
      }
      // 发起请求
      const { data: RES } = await querySalMaterialList(DATA)
      this.materielDialogData = RES.array
      this.materielPagination.total = RES.total
      this.isMaterialDialog = true
    },
    // 搜索
    handleMaterielSearch() {
      this.materielPagination.pageNum = 1
      this.handleGetMateriel()
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.ismarketlDialog = false
      this.$emit('material', this.prodValue)
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

