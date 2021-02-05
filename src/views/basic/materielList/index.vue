<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="searchMaterialList" />
        <el-button type="primary" size="mini" class="btn" @click="searchMaterialList">搜索</el-button>
        <el-button type="primary" size="mini" @click="addMateril">新增物料</el-button>
      </div>
    </div>
    <div class="mainPage">
      <div class="left-mainPage">
        <el-tree
          ref="my-tree"
          node-key="id"
          :data="materialGroupL"
          :props="defaultProps"
          :current-node-key="currentNodeKey"
          accordion
          @node-click="handleNodeClick"
        />
      </div>
      <div class="right-mainPage">
        <jc-table
          :table-header="materialTableHeader"
          :table-data="materialTableData"
          :cell-style="cellStyle"
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
          <template v-slot:btnState="clo">
            <el-tag v-if="clo.scope.row.fdocumentStatus !== '重新审核'">{{ clo.scope.row.fdocumentStatus }}</el-tag>
            <el-tag v-else type="danger">{{ clo.scope.row.fdocumentStatus }}</el-tag>
          </template>
          <!--禁用状态-->
          <template v-slot:tagSlot="clo">
            <el-tag v-if="clo.scope.row.fforbidStatus==='否'">{{ clo.scope.row.fforbidStatus }}</el-tag>
            <el-tag v-else type="danger">{{ clo.scope.row.fforbidStatus }}</el-tag>
          </template>
          <template v-slot:btnSlot="clo">
            <el-button type="primary" size="mini" @click="detailMateriel(clo.scope.row.fnumber)">查询物料</el-button>
            <el-button type="danger" size="mini" @click="Retrial(clo.scope.row.fmaterialId)">反审核</el-button>
          </template>
        </jc-table>
        <div class="footer">
          <jc-pagination
            v-show="total > 0"
            :total="total"
            :page.sync="pagination.pageNum"
            :limit.sync="pagination.pageSize"
            @pagination="getMaterialList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryTJxLargeitemtypeGroup, queryTBdMaterialList } from '@/api/basicManagement/materielList'
import { toMxAmina, Disable } from '@/components/ToMxamineState'
import { updateMaterialNotReview } from '@/api/basicManagement/untreatedMaterie'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
export default {
  name: 'MaterielList',
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
      materialGroupL: [], // tree组数据
      currentNodeKey: '',
      cellStyle: { padding: '5 10' }, // 行高
      pagination: {
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      total: 0, // 总条目
      materialTableHeader: [
        { label: '物料描述', prop: 'fdescripTion', align: 'center', minWidth: '400px' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center', minWidth: '120px' },
        { label: '单位', prop: 'funit', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center', minWidth: '110px' },
        { label: '禁用状态', type: 'tag', align: 'center', minWidth: '100px' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '200px', align: 'center' }
      ], // 表头数据
      materialTableData: [], // 表格数据
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    currentNodeKey(value) {
      if (value.toString()) {
        this.$refs['my-tree'].setCurrentKey(value)
      } else {
        this.$refs['my-tree'].setCurrentKey(null)
      }
    }
  },
  mounted() {
    this.getMaterialGroupL()
    this.getMaterialList()
  },
  methods: {
    // 进入物料主数据
    jumpMateriel(FNUMBER) {
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 搜索物料
    searchMaterialList() {
      this.pageNum = 1
      this.getMaterialList()
    },
    // 树形筛选
    async handleNodeClick(data) {
      this.currentNodeKey = data.value
      this.getMaterialList()
    },
    // 获取物料数据
    async getMaterialList() {
      const DATA = {
        ...this.pagination,
        ...this.searCollData,
        fnumberGroup: this.currentNodeKey
      }
      const { data: RES } = await queryTBdMaterialList(DATA)
      this.materialTableData = RES.array.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.total = RES.total
    },
    // 获取树型控件数据
    async getMaterialGroupL() {
      const { data: RES } = await queryTJxLargeitemtypeGroup()
      this.materialGroupL = RES
    },
    // 新增物料
    addMateril() {
      this.$router.push({ name: 'CreateMateriel' })
    },
    // 查询物料
    detailMateriel(FNUMBER) {
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 反审核
    async Retrial(FMATERIALID) {
      const fuserId = window.sessionStorage.getItem('fuserId')
      const { code, message } = await updateMaterialNotReview({ fmaterial: FMATERIALID, fuserId })
      if (code !== 0) {
        this.$message.warning(message)
        return
      }
      this.$message.success({ message })
      this.$router.push({ name: 'RefuseMateriel' })
      this.reload()
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and (max-width: 1920px) {
  .right-mainPage{
    width: 70vw;
    margin-left: 10px;
  }
}
@media screen and (min-width: 2560px) {
  .right-mainPage{
    width: 80vw;
    margin-left: 10px;
  }
}

.mainPage {
  margin-top: 10px;
  display: flex;
  flex-direction: row;

  .left-mainPage {
    width: 15vw;
    height: calc(100vh - 220px);
    overflow: auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #ebeef5;
  }
}
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
