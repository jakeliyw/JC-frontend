<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryRefuse" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="mini" @click="addMateriel">新增物料</el-button>
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
          <el-steps :active="clo.scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="error">
            <el-step title="研发部审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="warning" size="mini" @click="editMateriel(clo.scope.row)">修改物料</el-button>
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.fmaterialId)">重审物料</el-button>
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
        @pagination="handleGetMateriel"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryFailMaterialList, updateMaterialAgainReview } from '@/api/basicManagement/refuseMateriel'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { Disable, toMxAmina } from '@/components/ToMxamineState'
export default {
  name: 'RefuseMateriel',
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
      fbillNo: 'fnumber', // 产品描述
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'fdescripTion', minWidth: '300px', align: 'center' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center', minWidth: '120px' },
        { label: '单位', prop: 'funit', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center', minWidth: '110px' },
        { label: '状态流程', type: 'state', align: 'center', minWidth: '100px' },
        { label: '禁用状态', type: 'tag', align: 'center', minWidth: '100px' },
        { label: '审核状态', type: 'states', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', minWidth: '200px', align: 'center' }
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
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetMateriel() {
      const DATA = {
        pageNum: this.pageNum,
        pageSize: this.size,
        ...this.searCollData
      }
      const { data: res } = await queryFailMaterialList(DATA)
      this.tableData = res.array.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.total = res.total
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
    // 修改物料
    editMateriel(row) {
      this.$router.push({
        name: 'EditMateriel',
        query: {
          fnumber: row.fnumber,
          fmaterialId: row.fmaterialId
        }
      })
    },
    // 重审物料
    async Retrial(FMATERIALID) {
      const fuserId = window.sessionStorage.getItem('fuserId')
      const { code, message } = await updateMaterialAgainReview({ fmaterial: FMATERIALID, fuserId })
      if (code !== 0) {
        this.$message.warning(message)
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'UntreatedMateriel' })
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
    }
  }
}
</style>
