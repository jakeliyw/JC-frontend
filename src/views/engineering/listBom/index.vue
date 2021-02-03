<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryBomList" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryBomList">搜索</el-button>
        <el-button type="primary" size="mini" @click="addBom">新增bom</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <el-table-column
          label="物料编码"
          align="center"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.FNUMBER)">{{ scope.row.FNUMBER }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnState="clo">
          <el-tag>{{ clo.scope.row.FDOCUMENTSTATUS }}</el-tag>
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
          <el-button size="mini" type="warning" @click="queryReportForm(clo.scope.row.FNUMBER)">查看报表</el-button>
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.FID)">反审核</el-button>
          <el-button type="primary" size="mini" @click="getIntoBom(clo.scope.row.FNUMBER)">进入bom</el-button>
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
import { queryBomList } from '@/api/engineering/bomList'
import { Forbid, toDocument } from '@/components/ToMxamineState'
import { queryFtypeInfo } from '@/api/engineering/deitalBom'
import { updateNotReview } from '@/api/engineering/untreatedBom'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
export default {
  name: 'ListBom',
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
      cellStyle: { padding: '10 10' }, // 行高
      // 表头
      tableHeader: [
        { label: '型号', prop: 'FMODEL', minWidth: '100px', align: 'center' },
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', minWidth: '120px', align: 'center' },
        { label: '仓库', prop: 'FSTOCK', align: 'center' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center', minWidth: '110px' },
        { label: '禁用状态', type: 'tag', align: 'center' },
        { label: '审核状态', type: 'states', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '300px', align: 'center' }
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
    jumpMateriel(FNUMBER) {
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetBomList() {
      const DATA = {
        pageNum: this.pageNum,
        pageSize: this.size,
        ...this.searCollData
      }
      const { data: RES } = await queryBomList(DATA)
      this.tableData = RES.array.map(item => {
        return (toDocument(item), Forbid(item))
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryBomList() {
      this.pageNum = 1
      this.handleGetBomList()
    },
    // 跳转新建bom
    addBom() {
      this.$router.push({ name: 'CreateBom' })
    },
    // 查看报表
    queryReportForm(FNUMBER) {
      this.$router.push({ path: `/reportForm/${FNUMBER}` })
    },
    // 反审核
    async Retrial(FID) {
      const fuserId = window.sessionStorage.getItem('fuserId')
      const { message, code } = await updateNotReview({ fid: FID, fuserId })
      if (code !== 0) {
        this.$message.warning(message)
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'RefuseBom' })
      this.reload()
    },
    // 进入bom
    async getIntoBom(FNUMBER) {
      const { FTYPE, fMaterialId } = await queryFtypeInfo({ fnumber: FNUMBER })
      if (FTYPE === 0) {
        this.$router.push({ path: `/detailBom/${FNUMBER}` })
        this.$message.success({ message: '进入bom' })
      } else {
        this.$router.push({ path: `/detailMateriel/${fMaterialId}` })
        this.$message.success({ message: '进入物料清单' })
      }
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
