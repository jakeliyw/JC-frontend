<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="getRoleList" />
        <el-button size="mini" type="primary" class="btn" @click="getRoleList">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:btnSlot="col">
          <el-button type="primary" size="mini" @click="authority(col.scope.row.fpkId)">权限管理</el-button>
        </template>
      </jc-table>
    </div>
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="size"
        @pagination="getRoleList"
      />
    </div>
    <!--权限管理-->
    <el-dialog
      title="权限管理"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="fpkId"
        :default-checked-keys="treeTrue"
        :props="defaultProps"
        :check-strictly="true"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="roleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryTJxRoleList,
  queryRoleMeun } from '@/api/userAdmin/roleList'
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
      centerDialogVisible: false,
      ftype: 8,
      fbillNo: 'fname',
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableData: [], // 列表数据
      // 表头数据
      tableHeader: [
        { label: '角色名称', prop: 'name', align: 'center' },
        { label: '角色备注', prop: 'depict', align: 'center' },
        { label: '禁用状态', prop: 'isdisable', align: 'center' },
        { label: '创建时间', prop: 'createDate', align: 'center' },
        { label: '操作', type: 'btn', align: 'center' }
      ],
      // 行高
      cellStyle: { padding: '10 10' },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeTrue: []
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    disableUser() {
      console.log('禁用成功')
    },
    async getRoleList() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
      const { data: res } = await queryTJxRoleList(DATA)
      this.tableData = res.array
      this.total = res.total
    },
    // 权限管理
    authority(fpkid) {
      this.centerDialogVisible = true
      queryRoleMeun({ fpkId: fpkid }).then(res => {
        this.treeData = res.data
        res.data.filter((item) => {
          if (item.flg) {
            this.treeTrue.push(item.fpkId)
          }
          if (item.children && item.children.length > 0) {
            item.children.filter((item) => {
              if (item.flg) {
                this.treeTrue.push(item.fpkId)
              }
            })
          }
          return this.treeTrue
        })
      })
    },
    roleSubmit() {
      console.log('提交权限')
      this.centerDialogVisible = false
    },
    // 关闭前回调
    handleClose() {
      this.treeTrue = []
      this.centerDialogVisible = false
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
  .el-dialog{
    .el-tree{
      display: flex;
      flex-wrap: wrap;
      &::v-deep .el-tree-node{
        width: 50%;
      }
    }
  }
  .el-dialog__body {
    min-height: calc(100vh - 500px);
    overflow: auto;
  }
}
</style>
