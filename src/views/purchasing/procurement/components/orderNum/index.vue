<template>
  <div class="content">
    <!--    销售订单号列表弹窗-->
    <el-dialog
      title="销售订单号"
      model
      :visible.sync="isstorklDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">销售订单号</span>
        <el-input v-model.trim="stork.fbillNo" class="input-width" size="mini" placeholder="请输入销售订单号" @keyup.enter.native="storkSearch" />
        <span class="materiel-code">客户订单号</span>
        <el-input v-model.trim="stork.fpaezText" class="input-width" size="mini" placeholder="请输入客户订单号" @keyup.enter.native="storkSearch" />
        <el-button size="mini" type="primary" @click="storkSearch">搜索</el-button>
        <el-button v-if="selece" size="mini" type="primary" @click="affirm">确认</el-button>
      </div>
      <jc-table
        :table-data="storklDialogData"
        :table-header="storkDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @selectionChange="storklSelectRow"
        @clickRow="storklSelect"
      >
        <el-table-column v-if="selece" type="selection" width="60px" align="center" />
        <template v-slot:tagSlot="clo">
          <el-tag v-if="clo.scope.row.fcloseStatus==='A'">否</el-tag>
          <el-tag v-else type="danger">是</el-tag>
        </template>
      </jc-table>
      <jc-pagination
        v-show="stork.total > 0"
        :total="stork.total"
        :page.sync="stork.pageNum"
        :limit.sync="stork.pageSize"
        @pagination="handleGetUntreated"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTSalOrderList } from '@/api/marketManage/marketOrder'
import { toMxAmina } from '@/components/ToMxamineState'
export default {
  components: {
    jcTable,
    jcPagination
  },
  props: {
    selece: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 客户列表数据分页
      isstorklDialog: true,
      stork: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fbillNo: '',
        fpaezText: ''
      },
      storklDialogData: [], // 销售数据
      storkDialogHeader: [
        { label: '订单时间', prop: 'fcreateDate', align: 'center', minWidth: '155px' },
        { label: '单据类型', prop: 'fbillType', align: 'center', minWidth: '110px' },
        { label: '销售订单号', prop: 'fbillNo', align: 'center', minWidth: '110px' },
        { label: '客户订单号', prop: 'fpaezText', align: 'center', minWidth: '110px', filterHeaders: true },
        { label: '客户分组', prop: 'fprimaryGroup', align: 'center' },
        { label: '客户', prop: 'customer', align: 'center' },
        { label: '产品数量', prop: 'fqty', align: 'center' },
        { label: '结算货币', prop: 'fsettleCurr', align: 'center' },
        { label: '销售部门', prop: 'fsaleDept', align: 'center' },
        { label: '销售员', prop: 'fsaler', align: 'center' },
        { label: '禁用状态', type: 'tag', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { XSDDH: '' },
      ddlx: '',
      val: []
    }
  },
  created() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取销售订单
    async handleGetUntreated() {
      const DATA = { ...this.stork, fdocumentStatus: 'C' }
      const { data: RES, data: total } = await queryTSalOrderList(DATA)
      this.storklDialogData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      // 筛选
      this.storkDialogHeader.forEach(res => {
        res.filters = []
        this.storklDialogData.forEach(item => {
          console.log(item)
          if (item[res.prop]) {
            res.filters.push({
              text: item[res.prop], value: item[res.prop]
            })
          }
        })
        const obj = {}
        const result = []
        res.filters.map(item => {
          if (!obj[item.text]) {
            console.log(item)
            result.push(item)
            obj[item.text] = true
          }
        })
        res.filters = result
      })
      this.stork.total = total.total
    },
    // 销售订单弹窗选中
    storklSelectRow(val) {
      this.val = val.map(item => {
        return item.fbillNo
      })
    },
    storklSelect(item) {
      this.val.push(item.fbillNo)
      this.affirm()
    },
    // 确认
    affirm() {
      this.prodValue.XSDDH = this.val
      this.prodValue.isstorklDialog = false
      this.$emit('xsddh', this.prodValue)
    },
    storkSearch() {
      this.stork.pageNum = 1
      this.handleGetUntreated()
    },
    // 关闭前回调
    handleClose() {
      this.$emit('xsddh', this.prodValue)
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
.materiel-form {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;

  .materiel-code {
    margin-right: 5px;
    font-weight: bold;
    font-size: 14px;
    min-width: 65px;
    color: #606266;
    line-height: 40px;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
