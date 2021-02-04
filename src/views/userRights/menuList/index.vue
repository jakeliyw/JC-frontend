<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="getMenuList" />
        <el-button size="mini" type="primary" class="btn" @click="getMenuList">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      />
    </div>
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="size"
        @pagination="getMenuList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryTJxMenuList } from '@/api/userAdmin/menuList'
import { userDisable } from '@/components/ToMxamineState'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
export default {
  name: 'Index',
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 8,
      fbillNo: 'fname',
      total: 0, // 总条目
      pageNum: 1, // 当前页
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
    async getMenuList() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
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
  .header{
    position:relative;
   .header-name{
      width: 100%;
    }
    .btn{
      transform: translateY(18%);
      margin-left: 410px!important;
    }
  }
}
</style>
