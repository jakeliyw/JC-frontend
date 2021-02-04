<template>
  <el-table
    ref="table"
    v-loading="loading"
    :data="tableData"
    :border="tableBorder"
    :height="tableHeight"
    :row-style="{ height: '10px' }"
    :cell-style="cellStyle"
    :highlight-current-row="true"
    style="width: 100%"
    :header-cell-style="{background:'#E6EBFC', fontSize: '13px'}"
    :row-class-name="tabRowClassName"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @row-dblclick="openDetails"
  >
    <!--    全选-->
    <el-table-column
      v-if="tableSelection"
      align="center"
      type="selection"
      width="50"
    />
    <!--    id列-->
    <el-table-column v-if="serial" type="index" label="序号" width="80" align="center" />
    <slot />
    <el-table-column
      v-for="(col, index) of cpTableHeader"
      :key="index"
      :fixed="col.fixed"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :align="col.align || colAlign"
      :header-align="col.headerAlign"
      :min-width="col.minWidth || colMinWidth"
      :show-overflow-tooltip="tooltip"
      :sortable="sortable"
      :filters="col.filters"
      :filter-method="col.filterHeaders && filterHeader"
    >
      <!--      操作-->
      <template slot-scope="scope">
        <!--    text      -->
        <span v-if="col.type === 'text' || !col.type">
          {{ scope.row[col.prop] }}
        </span>
        <!--        state-->
        <slot v-else-if="col.type === 'state'" name="btnState" :scope="scope" />
        <!--        states-->
        <slot v-else-if="col.type === 'states'" name="btnStates" :scope="scope" />
        <!--        button-->
        <slot v-else-if="col.type === 'btn'" name="btnSlot" :scope="scope" />
        <!--        tag-->
        <slot v-else-if="col.type === 'tag'" name="tagSlot" :scope="scope" />
        <!--        tag-->
        <slot v-else-if="col.type === 'bill'" name="billSlot" :scope="scope" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Index',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tableData: { // 表格显示的数据
      type: Array,
      required: true
    },
    tableHeader: { // 表格头部数据
      type: Array,
      required: true
    },
    tableHeight: { // 表格高度
      type: [String, Number],
      default: 'calc(100vh - 300px)'
      // default: 'auto'
    },
    tableBorder: { // 表格边框
      type: Boolean,
      default: true
    },
    tableSelection: { // 表格多选
      type: Boolean,
      default: false
    },
    tooltip: { // 单元格内容过长显示省略号
      type: Boolean,
      default: true
    },
    sortable: { // 单元格是否排序
      type: Boolean,
      default: true
    },
    colMinWidth: { // 单元格最小宽度
      type: String,
      default: 'auto'
    },
    serial: { // 是否显示序列号
      type: Boolean,
      default: true
    },
    colAlign: { // 单元格对齐方式
      type: String,
      default: ''
    },
    commodity: { // 是否显示商品图片
      type: Boolean,
      default: false
    },
    cellStyle: {
      type: Object,
      default: function() {
        return { padding: '0 0' }
      }
    }
  },
  data() {
    return {
      cpTableHeader: [],
      filtrate: [] // 筛选数据
    }
  },
  watch: {
    tableHeader: {
      handler(val) {
        this.cpTableHeader = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 行事件
    openDetails(row) {
      this.$emit('clickRow', row)
    },
    // 勾选数据
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    // 勾选一个
    handleSelect() {
      this.handleGetSelection()
    },
    // 全选
    handleSelectAll(selection) {
      // 用于多选表格，清空用户的选择filtrate
      this.$refs.table.clearSelection()
      if (selection.length > 0 && selection[0]) {
        selection.map(item => {
          this.$refs.table.toggleRowSelection(item)
        })
      }
      // if (selection.length > 0 && selection[0] === this.filtrate[0]) {
      //   this.filtrate.map(item => {
      //     this.$refs.table.toggleRowSelection(item)
      //   })
      // }
      this.handleGetSelection()
    },
    // 获取勾选的值
    handleGetSelection() {
      this.$emit('selectionChange', this.$refs.table.selection)
    },
    tabRowClassName({ row, rowIndex }) {
      const index = rowIndex + 1
      if (index % 2 === 0) {
        return 'warning-row'
      }
    },
    // 筛选
    filterHeader(value, row, column) {
      this.filtrate = []
      const property = column['property']
      if (row[property] === value) {
        return this.filtrate.push(row)
      }
      return row[property] === value
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1366px) {
  .el-table{
    font-size: 12px;
  }
}
@media screen and (min-width: 1920px) {
  .el-table{
    font-size: 14px;
  }
}
.el-table {
  border: 1px solid #ccc;
  th{
    border-color: #ccc;
  }
  th.is-leaf{
    border-bottom: 1px solid #ccc;
  }
  th:last-child{
    border-right: none;
  }
  td{
    border-color: #ccc;
  }
  td:last-child{
    border-right: none;
  }
}
.el-input.is-disabled .el-input__inner{
  color: black;
}
.el-table .warning-row{
  background: #ececec;
}
</style>
