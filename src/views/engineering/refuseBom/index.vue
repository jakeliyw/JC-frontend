<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编号</span>
        <el-input
          v-model="fname"
          class="input-content"
          placeholder="请输入物料编号"
          @keyup.enter.native="handleQueryRefuse"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="medium" class="btn" @click="addBom">新增bom</el-button>
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
          prop="FNUMBER"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.FNUMBER)">{{ scope.row.FNUMBER }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="error">
            <el-step title="研发审核" />
            <el-step title="IE审核" />
            <el-step title="财务审核" />
            <el-step title="信息部审核" />
          </el-steps>
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
import { queryFailBomList, updateAgainReview } from '@/api/engineering/refuseBom'
export default {
  name: 'RefuseBom',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      fname: '', // 产品描述
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'FDESCRIPTION', width: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', width: '100px', align: 'center' },
        { label: '仓库', prop: 'FSTOCK', align: 'center' },
        { label: '价格清单', prop: 'PRICELIST', align: 'center' },
        { label: '使用组织', prop: 'FUSEORG', align: 'center' },
        { label: '生效时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'FSTATUS', align: 'center', minWidth: '300px' },
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
      this.$router.push({ path: `/queryMateriel/${fname}` })
    },
    // 获取列表数据
    async handleGetBomList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fname: this.fname }
      const { data: RES, total } = await queryFailBomList(DATA)
      this.tableData = RES
      this.total = total
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
      this.$message.success(message)
      this.$router.push({ name: 'UntreatedBom' })
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
