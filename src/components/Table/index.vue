<template>
  <el-table
    ref="table"
    v-loading="loading"
    :data="tableData"
    :border="tableBorder"
    :height="tableHeight"
    :stripe="true"
    :row-style="{ height: '10px' }"
    :cell-style="cellStyle"
    :highlight-current-row="true"
    style="width: 100%"
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
    <el-table-column v-if="serial" type="index" label="序号" width="60" align="center"/>
    <slot/>
    <el-table-column
      v-for="(col, index) of cpTableHeader"
      :key="index"
      :fixed="col.fixed"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :align="col.align || colAlign"
      :min-width="col.minWidth || colMinWidth"
      :show-overflow-tooltip="tooltip"
    >
<!--      操作-->
      <template slot-scope="scope">
        <!--    text      -->
        <span v-if="col.type === 'text' || !col.type">
          {{ scope.row[col.prop] }}
        </span>
        <!--        state-->
        <slot v-else-if="col.type === 'state'" name="btnState" :scope="scope" />
        <!--        button-->
        <slot v-else-if="col.type === 'btn'" name="btnSlot" :scope="scope" />
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
      default: 'calc(100vh - 340px)'
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
    colMinWidth: { // 单元格最小宽度
      type: String,
      default: 'auto'
    },
    serial: { // 是否显示序列号
      type: Boolean,
      default: false
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
      cpTableHeader: []
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
      // 用于多选表格，清空用户的选择
      this.$refs.table.clearSelection()
      if (selection.length > 0 && selection[0] === this.tableData[0]) {
        this.tableData.map(item => {
          this.$refs.table.toggleRowSelection(item)
        })
      }
      this.handleGetSelection()
    },
    // 获取勾选的值
    handleGetSelection() {
      this.$emit('selectionChange', this.$refs.table.selection)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
