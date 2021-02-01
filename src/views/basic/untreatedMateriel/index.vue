<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUnderReview" />
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
          min-width="180px"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.fnumber)">{{ scope.row.fnumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="fmodel" align="center" />
        <!--审核状态-->
        <template v-slot:btnStates="clo">
          <el-tag v-if="clo.scope.row.fdocumentStatus !== '重新审核'">{{ clo.scope.row.fdocumentStatus }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.fdocumentStatus }}</el-tag>
        </template>
        <!--禁用状态-->
        <template v-slot:tagSlot="clo">
          <el-tag v-if="clo.scope.row.fforbidStatus==='否'">{{ clo.scope.row.fforbidStatus }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.fforbidStatus }}</el-tag>
        </template>
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
            <el-step title="研发部审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="success" size="mini" @click="approval(clo.scope.row.fmaterialId)">通过</el-button>
          <el-button type="danger" size="mini" @click="approvalRejection(clo.scope.row.fmaterialId)">不通过</el-button>
          <el-button type="primary" size="mini" @click="detailMateriel(clo.scope.row.fnumber)">查询物料</el-button>
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
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { Disable, toMxAmina } from '@/components/ToMxamineState'
export default {
  name: 'UntreatedMateriel',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 0,
      fbillNo: 'fnumber', // 编码
      total: 0, // 总条目
      pageNum: 0, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'fdescripTion', minWidth: '300px', align: 'center' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center', minWidth: '120px' },
        { label: '单位', prop: 'funit', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center', minWidth: '110px' },
        { label: '状态流程', type: 'state', align: 'center', minWidth: '100px' },
        { label: '禁用状态', type: 'tag', align: 'center' },
        { label: '审核状态', type: 'states', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '250px', align: 'center' }
      ],
      // 表格数据
      tableData: [],
      fuserId: '' // 用户id
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
      this.fuserId = window.sessionStorage.getItem('fuserId')
      const DATA = {
        fuserId: this.fuserId,
        pageNum: this.pageNum,
        pageSize: this.size,
        ...this.searCollData
      }
      const { data: RES } = await queryUntreatedMaterialList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.total = RES.total
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
      const { code, message } = await updateMaterialReview({ fmaterial: FMATERIALID, fuserId: this.fuserId })
      if (code !== 0) {
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'MaterielList' })
      this.reload()
    },
    // 审批不通过
    async approvalRejection(FMATERIALID) {
      const { code, message } = await updateMaterialNotReview({ fmaterial: FMATERIALID, fuserId: this.fuserId })
      if (code !== 0) {
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'RefuseMateriel' })
      this.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
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
