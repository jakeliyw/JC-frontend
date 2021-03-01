<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="getRoleList" />
        <el-button size="mini" type="primary" class="btn" @click="getRoleList">搜索</el-button>
        <el-button size="mini" type="primary" @click="addDialogVisible = true">新增</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        serial
        :cell-style="cellStyle"
      >
        <template v-slot:btnSlot="col">
          <el-button type="primary" size="mini" @click="authority(col.scope.row.fpkId)">权限管理</el-button>
          <el-button type="danger" size="mini" @click="delectRole(col.scope.row.fpkId)">删除</el-button>
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
        node-key="menuId"
        :default-checked-keys="treeTrue"
        :props="defaultProps"
        :check-strictly="true"
        @check-change="handleCheckChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="roleSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!--新增角色-->
    <el-dialog
      title="权限管理"
      :visible.sync="addDialogVisible"
      width="50%"
      center
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :model="addRole" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="addRole.name" size="mini" />
        </el-form-item>
        <el-form-item label="角色描述" prop="depict">
          <el-input v-model.trim="addRole.depict" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryTJxRoleList,
  queryRoleMeun,
  inserRole,
  updateRoleMeun,
  deleteRole } from '@/api/userAdmin/roleList'
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
      addDialogVisible: false, // 新增角色
      centerDialogVisible: false, // 权限管理
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

      treeTrue: [],
      treeSubData: {
        roleId: '', // 角色ID
        children: []
      }, // 权限管理提交数据
      addRole: {
        name: '',
        depict: ''
      },
      rules: { // 验证不能为空
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ], depict: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
      const { data: res } = await queryTJxRoleList(DATA)
      this.tableData = res.array
      this.total = res.total
    },
    // 权限管理
    authority(fpkid) {
      this.treeTrue = []
      this.treeSubData.roleId = fpkid
      this.centerDialogVisible = true
      queryRoleMeun({ fpkId: fpkid }).then(res => {
        this.treeData = res.data
        res.data.filter((item) => {
          if (item.flg) {
            this.treeTrue.push(item.menuId)
            this.treeSubData.children.push({ menuId: item.menuId })
          }
          if (item.children && item.children.length > 0) {
            item.children.filter((item) => {
              if (item.flg) {
                this.treeTrue.push(item.menuId)
                this.treeSubData.children.push({ menuId: item.menuId })
              }
            })
          }
          return this.treeTrue
        })
      })
    },
    // 修改权限(修改数据结构)
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.treeSubData.children.push({ menuId: data.menuId })
      } else {
        this.treeSubData.children.forEach((item, index) => {
          if (item.fpkId === data.fpkId) {
            this.treeSubData.children.splice(index, 1)
          }
        })
      }
    },
    // 修改权限
    roleSubmit() {
      const DATA = { ...this.treeSubData }
      updateRoleMeun(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.centerDialogVisible = false
          this.getRoleList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 新增角色提交
    addRoleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return
        }
        const DATA = { ...this.addRole }
        inserRole(DATA).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.addDialogVisible = false
            this.getRoleList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 删除角色
    delectRole(id) {
      this.$confirm('确定要删除该角色么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ roleId: id }).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.getRoleList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 新增角色 关闭前回调
    addHandleClose() {
      this.addRole = {}
      this.addDialogVisible = false
    },
    // 权限管理 关闭前回调
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
  .el-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-form-item {
      min-width: 363px;
      margin-bottom: 15px;
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
