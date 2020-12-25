<template>
  <div class="content">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="调价" name="modifyPrice" class="layout">
        <div class="header">
          <el-button size="mini" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" disabled>保存调价</el-button>
        </div>
        <jc-form ref="zrf" :option-value="optionValue" :options="options">
          <el-input v-model="optionValue.fdataValue" class="input-width" size="mini" disabled>
            <i slot="suffix" class="el-input__icon el-icon-search" />
          </el-input>
        </jc-form>
        <jc-table
          :table-data="modifyPriceTable"
          :table-header="modifyPriceHeader"
          serial
          :cell-style="cellStyle"
        >
          <el-table-column label="价目表" prop="fname" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fname" size="mini" placeholder="请选择价目表" disabled>
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="含税" prop="fisIncludedTax" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.fisIncludedTax" disabled />
            </template>
          </el-table-column>
          <el-table-column label="物料编码" prop="fnumber" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fnumber" size="mini" placeholder="请选择物料编码" disabled>
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="调前单价" prop="fprice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fprice"
                size="mini"
                :precision="3"
                :step="0.1"
                :min="0"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="调后单价" prop="fafterPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fafterPrice"
                size="mini"
                :precision="3"
                :step="0.1"
                :min="0.1"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="调前含税单价" prop="ftaxPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.ftaxPrice"
                size="mini"
                :precision="3"
                :step="0.1"
                :min="0.1"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="调后含税单价" prop="fafterTaxPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fafterTaxPrice"
                size="mini"
                :precision="3"
                :step="0.1"
                :min="0.1"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="调前税率" prop="ftaxRate" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.ftaxRate" size="mini" :precision="3" :step="0.1" :min="0" disabled />
            </template>
          </el-table-column>
          <el-table-column label="调后税率" prop="fafterTaxRate" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fafterTaxRate"
                size="mini"
                :precision="3"
                :step="0.1"
                :min="0.1"
                disabled
              />
            </template>
          </el-table-column>
          <template v-slot:btnSlot>
            <el-button type="danger" size="mini" disabled>删除调价</el-button>
          </template>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="其它" name="other">
        <h2>待开发</h2>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcTable from '@/components/Table'
import { queryTPurPatDetailList } from '@/api/modifyPriceManagement/detailModifyPrice'
import { queryTOrgOrganizationsL } from '@/api/engineering/createBom'
export default {
  name: 'DetailModifyPrice',
  components: {
    jcForm,
    jcTable
  },
  data() {
    return {
      activeName: 'modifyPrice',
      teamList: [], // 组织数
      modifyPriceTable: [
        {
          fid: '', // 价目ID
          fmaterialId: '', // 物料ID
          fname: '', // 价目表
          fisIncludedTax: false, // 含税
          fnumber: '', // 物料编码
          fafterPrice: '', // 调后单价
          fafterTaxPrice: '', // 调后含税单价
          fafterTaxRate: '', // 调后税率
          fsupplier: '', // 供应商名称
          fcurrency: '', // 币别
          fdescripTion: '', // 描述
          fspecificaTion: '', // 规格型号
          fprice: '', // 调前单价
          ftaxPrice: '', // 调前含税单价
          ftaxRate: '', // 调前税率
          fupPrice: 0, // 上限
          fdownPrice: 0 // 下限
        }
      ], // 调价表数据
      modifyPriceHeader: [
        { label: '价格上限', prop: 'fupPrice', align: 'center' },
        { label: '价格下限', prop: 'fdownPrice', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '200px' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '规格型号', prop: 'fspecificaTion', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ], // 调价表头数据
      cellStyle: { padding: '10 10' }, // 行高
      optionValue: {}, // 表单值
      options: {} // 表单控件
    }
  },
  mounted() {
    this.getForm()
  },
  methods: {
    async getForm() {
      const FID = this.$route.params.id
      const { data: RES } = await queryTPurPatDetailList({ fid: FID })
      this.modifyPriceTable = RES.detail
      const { data: TEAMlIST } = await queryTOrgOrganizationsL()
      this.teamList = TEAMlIST.map(item => {
        return { label: item.FNAME, value: item.FPKID }
      })
      this.optionValue = {
        fcreateOrgId: 1, // 组织
        fdataValue: RES.fdataValue, // 调价原因名称
        fname: RES.fname, // 名称
        billCode: RES.fbillno, // 单据编号
        fdescription: RES.fdescripTion // 描述
      }
      this.options = {
        fcreateOrgId: {
          label: '创建组织',
          type: 'select',
          span: 6,
          disabled: 'disabled',
          selectItems: this.teamList
        },
        fdataValue: {
          label: '调价原因',
          type: 'slot',
          span: 6,
          disabled: 'disabled',
          rules: [{ required: true, message: '调价原因不可为空', trigger: 'blur' }]
        },
        fname: {
          label: '名称',
          span: 6,
          disabled: 'disabled',
          rules: [{ required: true, message: '名称不可为空', trigger: 'blur' }]
        },
        billCode: {
          label: '单据编号',
          span: 6,
          disabled: 'disabled'
        },
        fdescription: {
          label: '描述',
          span: 6,
          disabled: 'disabled',
          type: 'textarea',
          rules: [{ required: true, message: '描述不可为空', trigger: 'blur' }]
        }
      }
    },
    refresh() {
      location.reload()
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;

  .layout {
    display: flex;
    flex-direction: column;

    .header {
      margin-bottom: 20px;
    }
  }
}
.el-input__icon {
  cursor: pointer;
}
</style>
