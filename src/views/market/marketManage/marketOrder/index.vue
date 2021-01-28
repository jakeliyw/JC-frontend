<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQuerySonClass" />
        <el-button type="primary" class="btn" size="mini" @click="handleQuerySonClass">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
        serial
      >
        <el-table-column v-if="false" prop="fid" label="销售订单ID" min-width="80px" align="center" />
        <el-table-column prop="fcreateDate" label="销售订单时间" min-width="150px" align="center" />
        <el-table-column prop="fbillType" label="单据类型" min-width="120px" align="center" />
        <el-table-column prop="fbillNo" label="销售订单号" min-width="100px" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="particulars(scope.row.fid)">{{ scope.row.fbillNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="fpaezText" label="客户订单号" min-width="100px" align="center" />
        <el-table-column
          prop="fprimaryGroup"
          label="客户分组"
          min-width="80px"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="customer" label="客户" min-width="100px" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="fqty" label="订单产品数量" min-width="100px" align="center" />
        <el-table-column prop="fsettleCurr" label="结算货币" min-width="80px" align="center" />
        <el-table-column prop="fsaleDept" label="销售部门" min-width="80px" align="center" />
        <el-table-column prop="fsaler" label="销售员" min-width="80px" align="center" />
        <el-table-column prop="fcloseStatus" label="禁用状态" min-width="80px" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.fcloseStatus==='A'">否</el-tag>
            <el-tag v-else type="danger">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" min-width="100px">
          <template slot-scope="clo">
            <el-tag v-if="clo.row.fdocumentStatus !== '重新审核'">{{ clo.row.fdocumentStatus }}</el-tag>
            <el-tag v-else type="danger">{{ clo.row.fdocumentStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="attributeArray" label="操作" min-width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="btn" size="mini" @click="particulars(scope.row.fid)">详情</el-button>
          </template>
        </el-table-column>
      </jc-table>
    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetUntreated"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import {
  queryTSalOrderList
} from '@/api/marketManage/marketOrder'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { toMxAmina } from '@/components/ToMxamineState'

export default {
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 6,
      fbillNo: 'fbillNo', // 销售订单号
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 销售数据
      tableHeader: []
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取订单列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES, data: total } = await queryTSalOrderList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      this.total = total.total
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 订单详情
    particulars(id) {
      this.$router.push({ path: `/marketParticulars/${id}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;

  .header {
    position: relative;

    .header-name {
      width: 100%;
    }

    .btn {
      transform: translateY(18%);
      margin-left: 410px !important;
      z-index: 999;
    }
  }
}

.inTheBtn {
  transform: translateY(-15px);
}

.tag-mar {
  margin-right: 3px;
  margin-bottom: 3px;
}

.tag-mar:hover {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
