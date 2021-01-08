<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">销售订单号</span>
        <el-input
          v-model.trim="fbillNo"
          class="input-content"
          size="mini"
          placeholder="请输入销售订单号"
          @keyup.enter.native="handleQuerySonClass"
        />
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
        <el-table-column v-if="false" prop="fid" label="销售订单ID" min-width="80" align="center" />
        <el-table-column prop="fcreateDate" label="销售订单时间" min-width="150" align="center" />
        <el-table-column prop="fbillType" label="订单类型" min-width="120" align="center" />
        <el-table-column prop="fbillNo" label="销售订单号" min-width="100" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="particulars(scope.row.fid)">{{ scope.row.fbillNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="fprimaryGroup" label="客户分组" min-width="80" align="center" />
        <el-table-column prop="customer" label="客户" min-width="80" align="center" />
        <el-table-column prop="fqty" label="订单产品数量" min-width="100" align="center" />
        <el-table-column prop="fsettleCurr" label="结算货币" min-width="80" align="center" />
        <el-table-column prop="fsaleDept" label="销售部门" min-width="80" align="center" />
        <el-table-column prop="fsaler" label="销售员" min-width="80" align="center" />
        <el-table-column prop="fcloseStatus" label="关闭状态" min-width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.fcloseStatus=='A'">正常</el-tag>
            <el-tag v-else type="info">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="attributeArray" label="操作" min-width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" class="btn" size="medium" @click="particulars(scope.row.fid)">详情</el-button>
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
        @pagination="getSonClass"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import {
  queryTSalOrderList
} from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      fbillNo: '', // 销售订单号
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
    this.getSonClass()
  },
  methods: {
    // 获取订单列表数据
    async getSonClass() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fbillNo: this.fbillNo }
      const { data: RES, data: total } = await queryTSalOrderList(DATA)
      this.tableData = RES.array
      this.total = total.total
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.getSonClass()
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
}
.inTheBtn{
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
