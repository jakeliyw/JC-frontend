<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编码</span>
        <el-input
          v-model="fnumber"
          class="input-content"
          placeholder="请输入物料编号"
          size="mini"
          @keyup.enter.native="handleQueryBomList"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryBomList">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table
        :data="tableData"
        border
        @row-click="openDetails"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.tableData1" border :show-header="false" row-key="fnumber" :tree-props="{children: 'child', hasChildren: 'hasChildren'}">>
              <el-table-column prop="index" label="序号" align="center" width="80px" />
              <el-table-column prop="fnumber" label="物料编码" align="center" :show-overflow-tooltip="true" />
              <el-table-column prop="fdescripTion" label="物料描述" align="center" min-width="200px" :show-overflow-tooltip="true" />
              <el-table-column prop="fmaterialCost" label="单价" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.fmaterialCost" :disabled="!scope.row.flg" />
                </template>
              </el-table-column>
              <el-table-column prop="fcreateDate" label="生效时间" align="center" />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.flg" type="primary" size="mini" @click="getIntoBom(scope.row.fnumber)">更新金额</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="index" label="序号" align="center" />
        <el-table-column prop="fnumber" label="物料编码" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="fdescripTion" label="物料描述" align="center" min-width="200px" :show-overflow-tooltip="true" />
        <el-table-column prop="fmaterialCost" label="单价" align="center" />
        <el-table-column prop="fcreateDate" label="生效时间" align="center" />
      </el-table>
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
import { queryFtypeInfo } from '@/api/engineering/deitalBom'
import { queryBomPriceList,
  queryBomChildPriceList } from '@/api/engineering/maintainPriceBom'
export default {
  name: 'MaintainPriceBom',
  inject: ['reload'],
  components: {
    jcPagination,
    jcTable
  },
  data() {
    return {
      fnumber: '', // 物料编码
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      cellStyle: { padding: '10 10' }, // 行高
      // 表格数据
      tableData: [],
      tableHeader: []
    }
  },
  mounted() {
    this.handleGetBomList()
  },
  methods: {
    // 获取列表数据
    async handleGetBomList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fnumber: this.fnumber }
      const { data: RES } = await queryBomPriceList(DATA)
      this.tableData = RES.array
      this.tableData.map((item, index) => {
        item.index = index + 1
        item.tableData1 = []
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryBomList() {
      this.pageNum = 1
      this.handleGetBomList()
    },
    // 更新金额
    async getIntoBom(fnumber) {
      // const { FTYPE, fMaterialId } = await queryFtypeInfo({ fnumber: fnumber })
    },
    // 点击行获取下级数据
    openDetails(row, column, event) {
      const DATA = { fid: row.fid }
      queryBomChildPriceList(DATA).then(res => {
        res.data.map((item, index) => {
          item.index = index + 1
        })
        this.tableData[row.index - 1].tableData1 = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
