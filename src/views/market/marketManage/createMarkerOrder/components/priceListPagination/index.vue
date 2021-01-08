<template>
  <div class="content">
    <!--价目列表-->
    <el-dialog
      title="价目表"
      model
      :visible.sync="openPriceList"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">供应商名称</span>
        <el-input v-model.trim="priceListPagination.fsupplier" class="input-width" size="mini" placeholder="请输入供应商名称" @keyup.enter.native="handlePriceList" />
        <el-button size="mini" type="primary" @click="handlePriceList">搜索</el-button>
      </div>
      <jc-table
        :table-data="priceListData"
        :table-header="priceListHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="priceListSelectRow"
      />
      <jc-pagination
        v-show="priceListPagination.total > 0"
        :total="priceListPagination.total"
        :page.sync="priceListPagination.pageNum"
        :limit.sync="priceListPagination.pageSize"
        @pagination="handlePriceList"
      />
    </el-dialog>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTPurPatLs } from '@/api/modifyPriceManagement/createModifyPrice'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      // 价目表分页
      openPriceList: false,
      priceListPagination: {
        pageNum: 1, // 当前页
        pageSize: 10, // 限制行数
        fsupplier: '', // 关键词
        total: 0 // 总条目
      },
      // 价目表
      priceListData: [],
      priceListHeader: [
        { label: '价目表', prop: 'fname', align: 'center' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '含税', prop: 'fisIncludedTax', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { fsalerIdName: '', fsalerId: '', ismarketlDialog: true }
    }
  },
  created() {
    this.handlePriceList()
  },
  methods: {
    // 价目表
    async handlePriceList() {
      this.openPriceList = true
      const { data: RES } = await queryTPurPatLs({ ...this.priceListPagination })
      this.priceListData = RES.array
      this.priceListPagination.total = RES.total
    },
    // 获取价目表
    priceListSelectRow(item) {
      this.prodValue.fpriceListIdName = item.fname
      this.prodValue.fpriceListId = item.fid
      this.prodValue.openPriceList = false
      this.$emit('priceList', this.prodValue)
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

