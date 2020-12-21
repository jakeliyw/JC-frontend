<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编号</span>
        <el-input
          v-model="FNUMBER"
          class="input-content"
          placeholder="请输入物料编号"
          @keyup.enter.native="handleQueryRefuse"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="medium" @click="addMateriel" class="btn">新增物料</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        serial
        :table-header="tableHeader"
      >
        <el-table-column
          label="物料编码"
          align="center"
        >
          <template slot-scope="scope">
            <span @click="jumpMateriel(scope.row.FNUMBER)" class="jumpMateriel">{{scope.row.FNUMBER}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态流程"
          width="300px"
          align="center"
          prop="FSTATUS"
        >
          <template slot-scope="scope">
            <el-steps :active="scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="error">
              <el-step title="研发审核"></el-step>
              <el-step title="IE审核"></el-step>
              <el-step title="财务审核"></el-step>
              <el-step title="信息部审核"></el-step>
            </el-steps>
          </template>
        </el-table-column>
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" @click="queryMateriel(clo.scope.row.FNUMBER)">查询物料</el-button>
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.FMATERIALID)">重审物料</el-button>
        </template>
      </jc-table>

    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetMateriel"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryFailMaterialList, updateMaterialAgainReview } from '@/api/basicManagement/refuseMateriel'
export default {
  name: 'RefuseMateriel',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      FNUMBER: '', // 产品描述
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'FDESCRIPTION', width: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '单位', prop: 'FUNIT', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '200px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetMateriel()
  },
  methods: {
    // 进入物料主数据
    jumpMateriel(FNUMBER) {
      this.$router.push({ path: `/queryMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetMateriel() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, FNUMBER: this.FNUMBER }
      const { data: res, total } = await queryFailMaterialList(DATA)
      this.tableData = res
      this.total = total
    },
    // 搜索
    handleQueryRefuse() {
      this.pageNum = 1
      this.handleGetMateriel()
    },
    // 跳转新建物料
    addMateriel() {
      this.$router.push({ name: 'CreateMateriel' })
    },
    // 查询物料详情
    queryMateriel(FNUMBER) {
      this.$router.push({ path: `/queryMateriel/${FNUMBER}` })
    },
    // 重审物料
    async Retrial(FMATERIALID) {
      const { code, message } = await updateMaterialAgainReview({ fmaterial: FMATERIALID })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'UntreatedMateriel' })
      this.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
