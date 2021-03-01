<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        serial
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
          <el-steps :active="clo.scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="finish">
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
          <el-button type="success" size="mini" @click="approval(clo.scope.row.FID)">通过</el-button>
          <el-button type="danger" size="mini" @click="approvalRejection(clo.scope.row.FID)">不通过</el-button>
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
import { queryUntreatedBomList, updateReview, updateNotReview } from '@/api/engineering/untreatedBom'
import { queryFtypeInfo } from '@/api/engineering/deitalBom'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { toDocument, Forbid } from '@/components/ToMxamineState'
export default {
  name: 'UntreatedBom',
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
      tableHeader: [
        { label: '型号', prop: 'FMODEL', minWidth: '100px', align: 'center' },
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', minWidth: '150px', align: 'center' },
        { label: '仓库', prop: 'FSTOCK', align: 'center', minWidth: '110px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center', minWidth: '110px' },
        { label: '状态流程', type: 'state', prop: 'FSTATUS', align: 'center', minWidth: '230px' },
        { label: '禁用状态', type: 'tag', align: 'center', minWidth: '100px' },
        { label: '审核状态', type: 'states', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '250px', align: 'center' }
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
      const { data: RES } = await queryUntreatedBomList(DATA)
      this.tableData = RES.array.map(item => {
        return (toDocument(item), Forbid(item))
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetBomList()
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
    },
    // 审批
    async approval(FID) {
      const { message, code } = await updateReview({ fid: FID })
      if (code !== 0) {
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'UnderReviewBom' })
      this.reload()
    },
    // 审批不通过
    async approvalRejection(FID) {
      const { message, code } = await updateNotReview({ fid: FID })
      if (code !== 0) {
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'RefuseBom' })
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
