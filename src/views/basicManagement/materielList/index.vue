<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编号</span>
        <el-input
          v-model="pagination.fnumber"
          class="input-content"
          placeholder="请输入物料编码"
          @keyup.enter.native="searchMaterialList"
        />
        <el-button type="primary" size="medium" class="btn" @click="searchMaterialList">搜索</el-button>
        <el-button type="primary" size="medium" class="btn" @click="addMateril">新增物料</el-button>
      </div>
    </div>
    <div class="mainPage">
      <div class="left-mainPage">
        <el-tree
          node-key="id"
          ref="my-tree"
          :data="materialGroupL"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :current-node-key="currentNodeKey"
          accordion
        />
      </div>
      <div class="right-mainPage">
        <jc-table
          :table-header="materialTableHeader"
          :table-data="materialTableData"
          serial
          :cell-style="cellStyle"
        >
          <el-table-column
            label="物料编码"
            align="center"
            min-width="200px"
          >
            <template slot-scope="scope">
              <span @click="jumpMateriel(scope.row.FNUMBER)" class="jumpMateriel">{{scope.row.FNUMBER}}</span>
            </template>
          </el-table-column>
          <template v-slot:btnSlot="clo">
            <el-button type="primary" size="mini" @click="queryMateriel(clo.scope.row.FNUMBER)">查询物料</el-button>
            <el-button type="danger" size="mini" @click="deleteMateriel(clo.scope.row.FMATERIALID)" v-if="false">删除物料</el-button>
          </template>
        </jc-table>
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
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTJxLargeitemtypeGroup, queryTBdMaterialList, deleteMaterial } from '@/api/basicManagement/materielList'
import { toMxAmina, Disable } from '@/components/ToMxamineState'
export default {
  name: 'MaterielList',
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      FMATERIALGROUP: '', // 物料分组
      materialGroupL: [], // tree组数据
      currentNodeKey: '',
      cellStyle: { padding: '10 10' }, // 行高
      pagination: {
        fnumber: '', // 物料编号
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      total: 0, // 总条目
      materialTableHeader: [
        { label: '使用组织', prop: 'FUSEORG', align: 'center', minWidth: '200px' },
        { label: '物料描述', prop: 'FDESCRIPTION', align: 'center', minWidth: '400px' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center', minWidth: '200px' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '审核状态', prop: 'FDOCUMENTSTATUS', align: 'center' },
        { label: '禁用状态', prop: 'FFORBIDSTATUS', align: 'center' },
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
      this.$router.push({ path: `/queryMateriel/${FNUMBER}` })
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
        fnumberGroup: this.currentNodeKey
      }
      const { data: RES, total } = await queryTBdMaterialList(DATA)
      this.materialTableData = RES.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.total = total
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
    queryMateriel(FNUMBER) {
      this.$router.push({ path: `/queryMateriel/${FNUMBER}` })
    },
    // 删除物料
    async deleteMateriel(FMATERIALID) {
      const { code, message } = await deleteMaterial({ fmaterial: FMATERIALID })
      if (code === 0) {
        this.$message.success(message)
        this.getMaterialList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
.mainPage{
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  .left-mainPage{
    width: 200px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ebeef5;
  }
  .right-mainPage{
    width: 70vw;
    margin-left: 10px;
  }
}
</style>
