<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编号</span>
        <el-input
          v-model="FNUMBER"
          class="input-content"
          placeholder="请输入物料编号"
          size="mini"
          @keyup.enter.native="handleQueryUnderReview"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUnderReview">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <el-table-column
          label="物料编码"
          align="center"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.FNUMBER)">{{ scope.row.FNUMBER }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="finish">
            <el-step title="研发审核" />
            <el-step title="IE审核" />
            <el-step title="财务审核" />
            <el-step title="信息部审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="success" size="mini" @click="approval(clo.scope.row.FMATERIALID)">通过</el-button>
          <el-button type="danger" size="mini" @click="approvalRejection(clo.scope.row.FMATERIALID)">不通过</el-button>
          <el-button type="primary" size="mini" @click="detailMateriel(clo.scope.row.FNUMBER)">查询物料</el-button>
        </template>
      </jc-table>
    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="size"
        @pagination="handleGetMaterielList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import {
  queryUntreatedMaterialList,
  updateMaterialReview,
  updateMaterialNotReview
} from '@/api/basicManagement/untreatedMaterie'

export default {
  name: 'UntreatedMateriel',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      FNUMBER: '', // 产品描述
      total: 0, // 总条目
      pageNum: 0, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '单位', prop: 'FUNIT', align: 'center' },
        { label: '生效时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'FSTATUS', align: 'center', minWidth: '300px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '250px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetMaterielList()
  },
  methods: {
    // 进入物料主数据
    jumpMateriel(FNUMBER) {
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetMaterielList() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, FNUMBER: this.FNUMBER }
      const { data: RES, total } = await queryUntreatedMaterialList(DATA)
      this.tableData = RES
      this.total = total
    },
    // 分页查询
    handleQueryUnderReview() {
      this.pageNum = 1
      this.handleGetMaterielList()
    },
    // 进入物料 待做
    detailMateriel(FNUMBER) {
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 审批
    async approval(FMATERIALID) {
      const { code, message } = await updateMaterialReview({ fmaterial: FMATERIALID })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'MaterielList' })
      this.reload()
    },
    // 审批不通过
    async approvalRejection(FMATERIALID) {
      const { code, message } = await updateMaterialNotReview({ fmaterial: FMATERIALID })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'RefuseMateriel' })
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
