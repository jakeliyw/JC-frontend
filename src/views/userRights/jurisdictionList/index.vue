<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="getRoleList" />
        <el-button size="mini" type="primary" class="btn" @click="getRoleList">搜索</el-button>
        <el-button size="mini" type="primary" @click="insertTJQ">新增</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:btnSlot="col">
          <el-button type="warning" size="mini" @click="insertTJQ(col.scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteTJQ(col.scope.row)">删除</el-button>
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
    <!--新增/修改 审核权限弹窗-->
    <el-dialog :title="newINsert" :visible.sync="insertTJQVisible" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="用户" prop="fuserId">
          <el-select v-model.trim="form.fuserId" placeholder="请选择用户" size="mini" filterable>
            <el-option v-for="(item, index) in regionData" :key="index" :label="item.fname" :value="item.fuserId" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="ftype">
          <el-input v-model.trim="form.ftype" size="mini" />
        </el-form-item>
        <el-form-item label="原状态" prop="fvalueb">
          <el-input v-model.trim="form.fvalueb" size="mini" />
        </el-form-item>
        <el-form-item label="原流程" prop="fvaluea">
          <el-input v-model.trim="form.fvaluea" size="mini" />
        </el-form-item>
        <el-form-item label="审核后状态" prop="fvalued">
          <el-input v-model.trim="form.fvalued" size="mini" />
        </el-form-item>
        <el-form-item label="审核后流程" prop="fvaluec">
          <el-input v-model.trim="form.fvaluec" size="mini" />
        </el-form-item>
        <el-form-item label="描述" prop="fdepict">
          <el-input v-model.trim="form.fdepict" size="mini" />
        </el-form-item>
        <el-form-item label="审核人字段" prop="fvaluef">
          <el-input v-model.trim="form.fvaluee" size="mini" />
        </el-form-item>
        <el-form-item label="审核时间字段" prop="fvaluee">
          <el-input v-model.trim="form.fvaluef" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-button @click="insertTJQVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertTJxQuery">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryTJxQueryList, querySecUser, insertTJxQuery, updayeTJxQuery, deleteTJxQuery } from '@/api/userAdmin/jurisdictionList'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
export default {
  name: 'JuisdictionList',
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
        { label: '审核名称', prop: 'fname', align: 'center' },
        { label: '类型', prop: 'ftype', align: 'center' },
        { label: '原状态', prop: 'fvalueb', align: 'center' },
        { label: '原流程', prop: 'fvaluea', align: 'center' },
        { label: '审核后状态', prop: 'fvalued', align: 'center' },
        { label: '审核后流程', prop: 'fvaluec', align: 'center' },
        { label: '描述', prop: 'fdepict', align: 'center', minWidth: '150px' },
        { label: '审核人字段', prop: 'fvaluee', align: 'center' },
        { label: '审核时间字段', prop: 'fvaluef', align: 'center', minWidth: '120px' },
        { label: '操作', type: 'btn', minWidth: '150px', align: 'center' }
      ],
      // 行高
      cellStyle: { padding: '10 10' },
      newINsert: '新增审核权限',
      insertTJQVisible: false,
      form: {
        fuserId: '',
        ftype: '',
        fvalueb: '',
        fvaluea: '',
        fvalued: '',
        fvaluec: '',
        fdepict: '',
        fvaluef: '',
        fvaluee: '',
        fid: ''
      },
      regionData: [], // 角色数组
      rules: { // 验证不能为空
        fuserId: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ], ftype: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ], fvalueb: [
          { required: true, message: '请输原状态', trigger: 'blur' }
        ], fvaluea: [
          { required: true, message: '请输入原流程', trigger: 'blur' }
        ], fvalued: [
          { required: true, message: '请输入审核后状态', trigger: 'blur' }
        ], fvaluec: [
          { required: true, message: '请输入审核后流程', trigger: 'blur' }
        ], fdepict: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ], fvaluef: [
          { required: true, message: '请输入审核人字段', trigger: 'blur' }
        ], fvaluee: [
          { required: true, message: '请输入审核时间字段', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getRoleList()
    this.querySecUser()
  },
  methods: {
    insertTJQ(res) {
      this.form = {}
      if (!res.fid) {
        this.newINsert = '新增审核权限'
      } else {
        this.form = res
        this.newINsert = '修改审核权限'
      }
      this.insertTJQVisible = true
    },
    // 审核权限列表
    async getRoleList() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, ...this.searCollData }
      const { data: res } = await queryTJxQueryList(DATA)
      this.tableData = res.array
      this.total = res.total
    },
    // 选择用户数据
    async querySecUser() {
      const { data: res } = await querySecUser()
      this.regionData = res
    },
    // 新增/修改 审核权限
    insertTJxQuery() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.form.fid) {
          insertTJxQuery(this.form).then(res => {
            if (res.code === 0) {
              this.$message.success(res.message)
              this.getRoleList()
              this.insertTJQVisible = false
              this.form = {}
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          updayeTJxQuery(this.form).then(res => {
            if (res.code === 0) {
              this.$message.success('修改成功')
              this.getRoleList()
              this.insertTJQVisible = false
              this.form = {}
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    // 删除审核权限
    deleteTJQ(ev) {
      const DATA = { fid: ev.fid }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTJxQuery(DATA).then((res) => {
          if (res.code === 0) {
            this.getRoleList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
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
  .el-form-item {
    max-width: 70%;
    margin-bottom: 15px;
  }
}
</style>
