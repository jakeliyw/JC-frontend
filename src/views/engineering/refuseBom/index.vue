<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryRefuse" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="mini" @click="addBom">新增bom</el-button>
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
          prop="c"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.FNUMBER)">{{ scope.row.FNUMBER }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="error">
            <el-step title="研发部门" />
            <el-step title="工程部" />
            <el-step title="成本经理" />
            <el-step title="信息部门" />
          </el-steps>
        </template>
        <!--审核状态-->
        <template v-slot:btnStates="clo">
          <el-tag v-if="clo.scope.row.FDOCUMENTSTATUS !== '重新审核'">{{ clo.scope.row.FDOCUMENTSTATUS }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.FDOCUMENTSTATUS }}</el-tag>
        </template>
        <!--禁用状态-->
        <template v-slot:tagSlot="clo">
          <el-tag v-if="clo.scope.row.FFORBIDSTATUS==='否'">{{ clo.scope.row.FFORBIDSTATUS }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.FFORBIDSTATUS }}</el-tag>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.FID)">重审bom</el-button>
          <el-button type="warning" size="mini" @click="editBom(clo.scope.row.FNUMBER)">修改bom</el-button>
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
        @pagination="handleGetBomList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryFailBomList, updateAgainReview } from '@/api/engineering/refuseBom'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { Forbid, toDocument } from '@/components/ToMxamineState'
export default {
  name: 'RefuseBom',
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
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '型号', prop: 'FMODEL', minWidth: '100px', align: 'center' },
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', minWidth: '150px', align: 'center' },
        { label: '仓库', prop: 'FSTOCK', align: 'center', minWidth: '110px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center', minWidth: '110px' },
        { label: '状态流程', type: 'state', prop: 'FSTATUS', align: 'center', minWidth: '250px' },
        { label: '禁用状态', type: 'tag', align: 'center' },
        { label: '审核状态', type: 'states', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '200px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetBomList()
  },
  methods: {
    // 进入物料主数据
    jumpMateriel(fname) {
      this.$router.push({ path: `/detailMateriel/${fname}` })
    },
    // 获取列表数据
    async handleGetBomList() {
      const DATA = {
        pageNum: this.pageNum,
        pageSize: this.size,
        ...this.searCollData
      }
      const { data: RES } = await queryFailBomList(DATA)
      this.tableData = RES.array.map(item => {
        return (toDocument(item), Forbid(item))
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryRefuse() {
      this.pageNum = 1
      this.handleGetBomList()
    },
    // 跳转新建bom
    addBom() {
      this.$router.push({ name: 'CreateBom' })
    },
    // 修改bom
    editBom(FID) {
      this.$router.push({ path: `/editBom/${FID}` })
    },
    // 重审bom
    async Retrial(FID) {
      const { message, code } = await updateAgainReview({ fid: FID })
      if (code !== 0) {
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'UntreatedBom' })
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
