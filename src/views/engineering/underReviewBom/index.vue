<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编号</span>
        <el-input
          v-model="FNUMBER"
          class="input-content"
          placeholder="请输入物料编号"
          @keyup.enter.native="handleQueryUnderReview"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQueryUnderReview">搜索</el-button>
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
          :show-overflow-tooltip="true"
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
          <el-button v-show="false" type="success" size="mini" @click="approval">通过</el-button>
          <el-button v-show="false" type="danger" size="mini" @click="approvalRejection">不通过</el-button>
          <el-button type="primary" size="mini" @click="getIntoBom(clo.scope.row.FNUMBER)">进入bom</el-button>
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
        @pagination="handleGetBomList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryReviewBomList } from '@/api/engineering/underReviewBom'
import { queryFtypeInfo } from '@/api/engineering/deitalBom'

export default {
  name: 'UnderReviewBom',
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      FNUMBER: '', // 产品描述
      total: 0, // 总条目
      currentPage: 0, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '仓库', prop: 'FSTOCK', align: 'center' },
        { label: '价格清单', prop: 'PRICELIST', align: 'center' },
        { label: '使用组织', prop: 'FUSEORG', align: 'center' },
        { label: '生效时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'FSTATUS', align: 'center', minWidth: '300px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
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
      this.$router.push({ path: `/queryMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetBomList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, FNUMBER: this.FNUMBER }
      const { data: res, total } = await queryReviewBomList(DATA)
      this.tableData = res
      this.total = total
    },
    // 搜索
    handleQueryUnderReview() {
      this.pageNum = 1
      this.handleGetBomList()
    },
    // 进入bom
    async getIntoBom(FNUMBER) {
      const { FTYPE, fMaterialId } = await queryFtypeInfo({ fnumber: FNUMBER })
      if (FTYPE === 0) {
        this.$router.push({ path: `/detailBom/${FNUMBER}` })
        this.$message.success('进入bom')
      } else {
        this.$router.push({ path: `/queryMateriel/${fMaterialId}` })
        this.$message.success('进入物料清单')
      }
    },
    // 审批
    approval() {
      this.$router.push({ name: 'underReviewBom' })
      console.log('审批成功')
    },
    // 审批不通过
    approvalRejection() {
      console.log('审批不通过')
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
