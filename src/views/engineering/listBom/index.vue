<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编码</span>
        <el-input
          v-model="FNUMBER"
          class="input-content"
          placeholder="请输入物料编号"
          @keyup.enter.native="handleQueryBomList"
          size="mini"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryBomList">搜索</el-button>
        <el-button type="primary" size="mini" class="btn" @click="addBom">新增bom</el-button>
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
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.FNUMBER)">{{ scope.row.FNUMBER }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnState="clo">
          <el-tag>{{clo.scope.row.FDOCUMENTSTATUS}}</el-tag>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button v-if="false" type="warning" size="mini" @click="editBom(clo.scope.row.FNUMBER)">修改bom</el-button>
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
import { queryBomList } from '@/api/engineering/bomList'
import { toMxAmina } from '@/components/ToMxamineState'
import { queryFtypeInfo } from '@/api/engineering/deitalBom'
import { updateAgainReview } from '@/api/engineering/refuseBom'
export default {
  name: 'ListBom',
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
      cellStyle: { padding: '10 10' }, // 行高
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '400px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', minWidth: '100px', align: 'center' },
        { label: '发料方式', prop: 'FISSUETYPE', minWidth: '100px', align: 'center' },
        { label: '仓库', prop: 'FSTOCK', align: 'center' },
        { label: '使用组织', prop: 'FUSEORG', align: 'center' },
        { label: '生效时间', prop: 'FAPPROVEDATE', align: 'center' },
        { label: '审核状态',  prop: 'FDOCUMENTSTATUS', align: 'center' },
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
    jumpMateriel(FNUMBER) {
      this.$router.push({ path: `/queryMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetBomList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, FNUMBER: this.FNUMBER }
      const { data: RES, total } = await queryBomList(DATA)
      this.tableData = RES.map(item => {
        return toMxAmina(item)
      })
      this.total = total
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
    // 修改bom
    editBom(FNUMBER) {
      this.$router.push({ path: `/editBom/${FNUMBER}` })
    },
    // 反审核
    async Retrial(FID) {
      const { message, code } = await updateAgainReview({ fid: FID })
      if (code !== 0) {
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'UntreatedBom' })
      this.reload()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
