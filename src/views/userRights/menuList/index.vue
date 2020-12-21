<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <h3 class="materiel-name">菜单列表</h3>
        <span class="parentItemNo">菜单名称</span>
        <el-input
          v-model="SUBJECTION"
          class="input-content"
          placeholder="请输入菜单"
          @keyup.enter.native="getMenuList"
        />
        <el-button size="medium" type="primary" class="btn" @click="getMenuList">搜索</el-button>
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
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleQueryMenuList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTJxMenuList } from '@/api/userAdmin/menuList'
import { userDisable } from '@/components/ToMxamineState'

export default {
  name: 'Index',
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      SUBJECTION: '',
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableData: [], // 列表数据
      // 表头数据
      tableHeader: [
        { label: '菜单名称', prop: 'NAME', align: 'center' },
        { label: '权限类型', prop: 'MASTERTYPE', align: 'center' },
        { label: '路由地址', prop: 'URL', align: 'center' },
        { label: '按钮权限', prop: 'PERMISSION', align: 'center' },
        { label: '隶属关系', prop: 'SUBJECTION', align: 'center' },
        { label: '禁用状态', prop: 'ISDISABLE', align: 'center' },
        { label: '创建时间', prop: 'CREATEDATE', align: 'center' }
      ],
      // 行高
      cellStyle: { padding: '10 10' }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    handleQueryMenuList() {
      this.pageNum = 1
      this.getMenuList()
    },
    async getMenuList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, SUBJECTION: this.SUBJECTION }
      const { data: res, total } = await queryTJxMenuList(DATA)
      this.tableData = res.map(item => {
        return userDisable(item)
      })
      this.total = total
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
</style>
