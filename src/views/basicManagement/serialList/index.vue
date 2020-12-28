<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">小类名称</span>
        <el-input
          v-model="serialName"
          class="input-content"
          placeholder="请输入物料编号"
          @keyup.enter.native="handleQuerySonClass"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQuerySonClass">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        serial
        :table-header="tableHeader"
        :cell-style="cellStyle"
      />
    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="getSonClass"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { querySerialList } from '@/api/basicManagement/serialList'
export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      serialName: '', // 产品描述
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableHeader: [
        { label: '小类名称', prop: 'SerialName', align: 'center' },
        { label: '小类密码', prop: 'SerialKey', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.getSonClass()
  },
  methods: {
    // 获取列表数据
    async getSonClass() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, serialName: this.serialName }
      const { data: RES, total } = await querySerialList(DATA)
      this.tableData = RES
      this.total = total
    },
    // 分页查询
    handleQuerySonClass() {
      this.pageNum = 1
      this.getSonClass()
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
