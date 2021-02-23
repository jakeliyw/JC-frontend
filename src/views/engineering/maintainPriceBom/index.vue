<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryBomList" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryBomList">搜索</el-button>
        <el-button type="primary" size="mini" @click="renovate()">更新全部</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table
        :data="tableData"
        border
        row-key="loking"
        :cell-style="cellStyle"
        height="calc(100vh - 300px)"
        :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
        :header-cell-style="{background:'#E6EBFC', fontSize: '13px'}"
      >
        <el-table-column prop="index" label="序号" align="center" />
        <el-table-column prop="fnumber" label="物料编码" align="center" min-width="120px" />
        <el-table-column
          prop="fdescripTion"
          label="物料描述"
          align="center"
          min-width="240px"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="fdosage" label="用量" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.fdosage!==null" v-model="scope.row.fdosage" :min="0" size="mini" />
            <el-input v-if="scope.row.fdosage===null" v-model="scope.row.fdosage" size="mini" disabled style="width: 130px" />
          </template>
        </el-table-column>
        <el-table-column prop="fprice" label="单价" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.row.fprice <= scope.row.fixedPrice"
              v-model="scope.row.fprice"
              :disabled="!scope.row.flg"
              :min="0"
              :max="scope.row.fixedPrice"
              size="mini"
            />
            <el-input-number
              v-if="scope.row.fprice > scope.row.fixedPrice"
              v-model="scope.row.fprice"
              :disabled="!scope.row.flg"
              :min="0"
              :max="scope.row.fprice"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column prop="flaborCost" label="人工成本" align="center" />
        <el-table-column
          prop="fcreateDate"
          label="生效时间"
          align="center"
          min-width="130px"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" align="center" fixed="right" min-width="90px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.levels == '1'" type="primary" size="mini" @click="renovateAlone(scope.row)">更新
            </el-button>
          </template>
        </el-table-column>
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
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import {
  queryBomPriceList,
  renovateBom,
  renovateAloneBom
} from '@/api/engineering/maintainPriceBom'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
export default {
  name: 'MaintainPriceBom',
  inject: ['reload'],
  components: {
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
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      cellStyle: { padding: '5px' }, // 行高
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
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES } = await queryBomPriceList(DATA)
      this.tableData = RES.array
      // 添加序号
      this.tableData.map((item, index) => {
        item.index = index + 1 // 一级列表序号 1,2
        item.fixedPrice = item.fprice
        item.child.map((ite, index1) => {
          ite.index = item.index + '-' + (index1 + 1) // 二级列表序号 1-1
          if (ite.child) {
            ite.child.map((it, index2) => {
              it.index = ite.index + '-' + (index2 + 1) // 三级列表序号 1-1-1
              if (it.child) {
                it.child.map((i, index3) => {
                  i.index = it.index + '-' + (index3 + 1) // 四级列表序号 1-1-1-1
                })
              }
            })
          }
        })
      })
      this.total = RES.total
    },
    // 搜索
    handleQueryBomList() {
      this.pageNum = 1
      this.handleGetBomList()
    },
    // 更新单个金额
    async renovateAlone(data) {
      const DATA = {}
      DATA.fmaterialId = data.fmaterialId
      DATA.fnumber = data.fnumber
      DATA.fprice = data.fprice
      DATA.fid = data.fid
      DATA.fdosage = data.fdosage
      DATA.flaborCost = data.flaborCost
      DATA.child = []
      data.child.map(item => {
        DATA.child.push({
          fmaterialId: item.fmaterialId,
          fnumber: item.fnumber,
          fprice: item.fprice,
          fid: item.fid,
          fdosage: item.fdosage,
          flaborCost: item.flaborCost,
          child: item.child
        })
      })
      await renovateAloneBom(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.handleGetBomList()
        }
      })
    },
    // 更新全部金额
    async renovate() {
      const DATA = []
      this.tableData.map(item => {
        DATA.push({
          fmaterialId: item.fmaterialId,
          fnumber: item.fnumber,
          fprice: item.fprice,
          fid: item.fid,
          fdosage: item.fdosage,
          flaborCost: item.flaborCost,
          child: item.child
        })
      })
      await renovateBom(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.handleGetBomList()
        }
      })
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
