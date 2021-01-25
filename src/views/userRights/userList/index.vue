<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="getUserList" />
        <el-button size="mini" type="primary" class="btn" @click="getUserList">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:tagSlot="col">
          <el-tag v-if="col.scope.row.roleId">{{ col.scope.row.role }}</el-tag>
          <el-tag v-else type="danger">{{ col.scope.row.role }}</el-tag>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="distribution(clo.scope.row)">分配角色</el-button>
          <el-switch
            v-if="hasPerm('user:disable')"
            v-model="clo.scope.row.fforbidStatus"
            active-text="启用"
            inactive-text="禁用"
            @change="disableUser(clo.scope.row)"
          />
        </template>
      </jc-table>
    </div>
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="size"
        @pagination="getUserList"
      />
    </div>
    <!--分配角色弹窗-->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="活动区域" label-width="100px">
          <el-select v-model.trim="region" placeholder="请选择角色" filterable>
            <el-option v-for="(item, index) in regionData" :key="index" :label="item.role" :value="item.roleId" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryTEngBomList, updateUserDisable, queryRoleList, distributionRole } from '@/api/userAdmin/userList'
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
      dialogFormVisible: false, // 分配角色弹窗
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableData: [], // 列表数据
      userDisable: true,
      // 表头数据
      tableHeader: [
        { label: '用户名称', prop: 'fname', align: 'center' },
        { label: '部门分组', prop: 'fprimaryGroup', align: 'center' },
        { label: '角色', type: 'tag', align: 'center' },
        { label: '手机号码', prop: 'fphone', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', width: '250px', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      region: '', // 选择角色
      regionData: [], // 角色数组
      fuserId: '' // 用户ID
    }
  },
  mounted() {
    this.getUserList()
    this.queryRoleList()
  },
  methods: {
    // 启用禁止用户
    async disableUser(row) {
      const DATA = { fforbidStatus: row.fforbidStatus, fuserId: row.fuserId }
      const { code, message } = await updateUserDisable(DATA)
      if (code !== 0) {
        return
      }
      this.$message.success(message)
    },
    // 用户列表
    async getUserList() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
      const { data: res } = await queryTEngBomList(DATA)
      this.tableData = res.array.map(item => {
        return userDisable(item)
      })
      this.total = res.total
    },
    // 角色列表
    async queryRoleList() {
      const { data: RES } = await queryRoleList()
      this.regionData = RES
    },
    // 分配角色弹窗
    distribution(it) {
      this.dialogFormVisible = true
      this.fuserId = it.fuserId
      if (it.roleId) {
        this.region = it.role
      } else {
        this.region = ''
      }
    },
    // 分配角色
    distributionRole() {
      const DATA = { roleId: this.region, fuserId: this.fuserId }
      distributionRole(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.dialogFormVisible = false
          this.getUserList()
        } else {
          this.$message.error(res.message)
        }
      })
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
      z-index: 999;
    }
  }
}
</style>
