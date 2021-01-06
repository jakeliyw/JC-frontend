<template>
  <div class="tab">
    <el-tabs v-model="activeName">
      <el-tab-pane label="明细信息" name="first">
        <jc-table
          :table-data="tabTwo.saleDetails"
          :table-header="tableHeader"
          serial
          :cell-style="cellStyle"
        >
          <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.fmaterialIdName" placeholder="请选择物料编码" size="mini">
                <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fmaterialIdName)" />
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMateriel(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true" />
          <el-table-column label="销售单位" prop="funitName" align="center" />
          <el-table-column label="销售数量" prop="fqty" min-width="140px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fqty"
                :min="1"
                size="mini"
                @change="handleChange"
              />
            </template>
          </el-table-column>
          <el-table-column label="是否赠品" prop="fisFree" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.fisFree" :value="scope.row.fisFree" @change="handleCheckedCitiesChange(scope.row.fisFree, scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column label="税率" prop="fentryTaxRate" min-width="140px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.ftaxRate"
                :min="0"
                size="mini"
                :disabled="scope.row.fisFree"
                @change="handleChange1"
              />
            </template>
          </el-table-column>
          <el-table-column label="要货时间" prop="fqty" min-width="220px" align="center">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.fdeliveryDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" placeholder="选择日期" />
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="fqty" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delectSale(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="收款计划" name="second">
        <jc-table
          :table-data="tabTwo.planDetails"
          :table-header="tableHeader"
          serial
          :cell-style="cellStyle"
        >
          <el-table-column label="是否预收" prop="fqty" align="center" width="80px">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.fneedRecAdvance" :value="scope.row.fneedRecAdvance" @change="check" />
            </template>
          </el-table-column>
          <el-table-column label="应收比例%" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.frecAdvanceRate"
                :min="0"
                :max="100"
                size="mini"
                @change="handleChange2"
              />
            </template>
          </el-table-column>
          <el-table-column label="应收金额" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.frecAdvanCeamount"
                :min="0"
                size="mini"
                @change="handleChange3"
              />
            </template>
          </el-table-column>
        </jc-table>
      </el-tab-pane>
    </el-tabs>
    <!--    物料弹窗-->
    <el-dialog
      title="物料列表"
      model
      :visible.sync="isMaterielDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">物料编码</span>
        <el-input v-model.trim="FNUMBER" class="input-width" size="mini" placeholder="请输入物料编码" @keyup.enter.native="handleMaterielSearch" />
        <span class="materiel-code">物料描述</span>
        <el-input v-model.trim="FDESCRIPTION" class="input-width" size="mini" placeholder="请输入物料描述" @keyup.enter.native="handleMaterielSearch" />
        <span class="materiel-code">物料规格</span>
        <el-input v-model.trim="FSPECIFICATION" class="input-width" size="mini" placeholder="请输入规格" @keyup.enter.native="handleMaterielSearch" />
        <el-button size="mini" type="primary" @click="handleMaterielSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="materielDialogData"
        :table-header="materielDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="materielSelectRow"
      />
      <jc-pagination
        v-show="materielPagination.total > 0"
        :total="materielPagination.total"
        :page.sync="materielPagination.pageNum"
        :limit.sync="materielPagination.pageSize"
        @pagination="handleGetMateriel"
      />
    </el-dialog>
  </div>
</template>

<script>
import { queryMaterialList } from '@/api/marketManage/marketOrder'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      activeName: 'first',
      tableHeader: [],
      isMaterielDialog: false,
      cellStyle: { padding: '10 10' },
      // 点击行的序号
      tableIndex: 0,
      rateIndex: '', // 行序号(第几行)
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      materielDialogData: [],
      materielDialogHeader: [
        { label: '使用组织', prop: 'fuseOrg', align: 'center' },
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '150px' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '型号', prop: 'fmodel', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' }
      ],
      tabTwo: {
        saleDetails: [ // 明细信息
          { fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: false, ftaxRate: '', fdeliveryDate: '', fmaterialIdName: '', funitName: '' }
        ],
        // 收款计划
        planDetails: [{ fneedRecAdvance: false, frecAdvanceRate: '0', frecAdvanCeamount: '0' }]
      }
    }
  },
  methods: {
    // 物料弹窗选中
    async materielSelectRow(item) {
      this.tabTwo.saleDetails[this.tableIndex].fmaterialId = item.fmaterialId
      this.tabTwo.saleDetails[this.tableIndex].fmaterialIdName = item.fnumber
      this.tabTwo.saleDetails[this.tableIndex].fdescripTion = item.fdescripTion
      this.tabTwo.saleDetails[this.tableIndex].funitId = item.funitId
      this.tabTwo.saleDetails[this.tableIndex].funitName = item.funitName
      this.isMaterielDialog = false
      this.$emit('visible', this.tabTwo)
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      if (index) {
        this.tableIndex = index
      }
      if (index === this.tabTwo.saleDetails.length - 1) {
        this.tabTwo.saleDetails.push(
          {
            fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: false, ftaxRate: '', fdeliveryDate: ''
          }
        )
      }
      const DATA = {
        pageNum: this.materielPagination.pageNum,
        pageSize: this.materielPagination.pageSize,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION
      }
      const { data: RES } = await queryMaterialList(DATA)
      this.materielDialogData = RES.array
      this.materielPagination.total = RES.total
      this.isMaterielDialog = true
    },
    // 搜索
    handleMaterielSearch() {
      this.materielPagination.pageNum = 1
      this.handleGetMateriel()
    },
    // 监听是否勾选赠品
    handleCheckedCitiesChange(val, index) {
      this.rateIndex = index
      if (val) {
        this.tabTwo.saleDetails[this.rateIndex].ftaxRate = ''
      }
      this.$emit('visible', this.tabTwo)
    },
    // 删除明细空行
    delectSale(index) {
      if (index === 0) {
        this.$message.error('不能删除第一行')
        return false
      }
      this.tabTwo.saleDetails.splice(index, 1)
      this.$emit('visible', this.tabTwo)
    },
    // 监听销售数量
    handleChange(value) {
      this.$emit('visible', this.tabTwo)
    }, // 监听税率
    handleChange1(value) {
      this.$emit('visible', this.tabTwo)
    }, // 监听应收比例
    handleChange2(value) {
      this.$emit('visible', this.tabTwo)
    }, // 监听应收金额
    handleChange3(value) {
      this.$emit('visible', this.tabTwo)
    },
    check(value) {
      this.$emit('visible', this.tabTwo)
    }
  }
}
</script>

<style scoped lang="scss">
.tab{
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
}
</style>
