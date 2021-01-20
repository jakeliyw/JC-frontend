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
          @keyup.enter.native="handleQueryRefuse"
        />
        <span class="parentItemNo">物料规格</span>
        <el-input
          v-model="fspecificaTion"
          class="input-content"
          placeholder="请输入物料规格"
          size="mini"
          @keyup.enter.native="handleQueryRefuse"
        />
        <span class="parentItemNo">型号</span>
        <el-input
          v-model="fmodel"
          class="input-content"
          placeholder="请输入型号"
          size="mini"
          @keyup.enter.native="handleQueryRefuse"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryRefuse">搜索</el-button>
        <el-button type="primary" size="mini" class="btn" @click="addMateriel">新增物料</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <el-table-column label="型号" prop="FMODEL" align="center" />
        <el-table-column
          label="物料编码"
          align="center"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.FNUMBER)">{{ scope.row.FNUMBER }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.FSTATUS" align-center class="font-style" finish-status="success" process-status="error">
            <el-step title="研发部审核" />
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="warning" size="mini" @click="editMateriel(clo.scope.row)">修改物料</el-button>
          <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.FMATERIALID)">重审物料</el-button>
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
export default {
  name: 'RefuseMateriel',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      FNUMBER: '', // 产品描述
      fmodel: '', // 型号
      fspecificaTion: '', // 物料规格
      total: 0, // 总条目
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '物料描述', prop: 'FDESCRIPTION', minWidth: '300px', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '单位', prop: 'FUNIT', align: 'center' },
        { label: '生效时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'FSTATUS', align: 'center', minWidth: '300px' },
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
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetMateriel() {
      const DATA = {
        pageNum: this.pageNum,
        pageSize: this.size,
        FNUMBER: this.FNUMBER,
        fspecificaTion: this.fspecificaTion,
        fmodel: this.fmodel
      }
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
    // 修改物料
    editMateriel(row) {
      this.$router.push({
        name: 'EditMateriel',
        query: {
          FNUMBER: row.FNUMBER,
          FMATERIALID: row.FMATERIALID
        }
      })
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
