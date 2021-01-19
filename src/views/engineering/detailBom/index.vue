<template>
  <div class="content">
    <jc-title />
    <el-card class="header-card">
      <div class="tool">
        <el-button size="mini" disabled>刷新</el-button>
        <el-button size="mini" type="primary" disabled>保存bom</el-button>
      </div>
      <div class="organization">
        <span class="text-margin">创建组织</span>
        <el-select v-model="team" placeholder="请选择" size="mini" class="input-width" disabled />
        <span class="text-margin">使用组织</span>
        <el-input v-model="company" placeholder="请输入组织" size="mini" class="input-width" disabled />
        <div class="summation">物料成本:
          <span class="color-text">{{ FMATERIALCOST }}元</span>
        </div>
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleOther">
      <el-tab-pane label="主产品" name="product">
        <jc-form ref="createBomForm" :option-value="prodValue" :options="prodOptions" label-width="100px">
          <el-input
            v-model="prodValue.FNUMBER"
            size="mini"
            placeholder="请选择编码"
            disabled
            class="input-width"
          >
            <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="jumpMateriel" />
          </el-input>
        </jc-form>
        <jc-table
          :table-data="sonTableData"
          :cell-style="cellStyle"
          serial
          :table-header="sonTableHeader"
          table-height="calc(100vh - 600px)"
        >
          <el-table-column v-if="false" label="子物料ID" prop="FMATERIALID" align="center" />
          <el-table-column label="物料编码" prop="FNUMBER" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.FNUMBER" placeholder="请选择物料编码" disabled size="mini" class="input-width">
                <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.FNUMBER)" />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物料描述"
            prop="FDESCRIPTION"
            width="250px"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料规格"
            prop="FSPECIFICATION"
            align="center"
            width="150px"
          />
          <el-table-column label="发料方式" prop="FISSUENAME" align="center" width="150px">
            <template slot-scope="scope">
              <el-select v-model="scope.row.FISSUENAME" placeholder="请选择" disabled size="mini" class="input-width" />
            </template>
          </el-table-column>
          <el-table-column label="用量" prop="FDOSAGE" align="center" width="200px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.FDOSAGE" :precision="4" :step="0.0001" :min="0.0000" disabled size="mini" class="input-width" />
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="FPRICE" align="center" width="200px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.FPRICE" :precision="4" :step="0.0001" :min="0.0000" disabled size="mini" class="input-width" />
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="money" align="center" width="150px">
            <template slot-scope="scope">
              {{ parseInt((scope.row.FPRICE * scope.row.FDOSAGE) * 100) / 100 }}
            </template>
          </el-table-column>
          <el-table-column label="子项类型" prop="FMATERIALNAME" align="center" width="150px">
            <template slot-scope="scope">
              <el-select :value="scope.row.FMATERIALNAME" placeholder="请选择" disabled size="mini" class="input-width" />
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="date" width="200px" align="center">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.FCREATEDATE"
                type="date"
                size="mini"
                style="width: 150px"
                placeholder="选择日期"
                disabled
                class="input-width"
              />
            </template>
          </el-table-column>
          <template v-slot:btnSlot="clo">
            <el-button type="primary" size="mini" @click="getIntoBom(clo.scope.row.FNUMBER)">进入bom</el-button>
          </template>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="其它" name="other">
        <jc-form :option-value="otherUrlObject" :options="otherOptions" />
        <jc-table
          :table-header="logTableHeader"
          :table-data="otherLogTableData"
          :cell-style="cellStyle"
          table-height="calc(100vh - 720px)"
        />
        <jc-pagination
          v-show="otherPagination.total > 0"
          :total="otherPagination.total"
          :page.sync="otherPagination.pageNum"
          :limit.sync="otherPagination.pageSize"
          @pagination="handleOther"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcForm from '@/components/Form'
import jcTitle from '@/components/Title'
import jcPagination from '@/components/Pagination'
import { queryBomchildList, queryFtypeInfo, queryBomLog } from '@/api/engineering/deitalBom'
import JumpMateriel from '@/components/JumpMateriel'
export default {
  name: 'DetailBom',
  components: {
    jcTable,
    jcForm,
    jcTitle,
    jcPagination
  },
  mixins: [JumpMateriel],
  data() {
    return {
      cellStyle: { padding: '10 10' }, // 行高
      activeName: 'product', // 默认主产品 product Other
      // 子表数据
      sonTableData: [],
      // 子项表头
      sonTableHeader: [
        { label: '操作', type: 'btn', fixed: 'right', width: '100px', align: 'center' }
      ],
      prodValue: {}, // 产品表单值
      prodOptions: {}, // 产品表单元素
      otherLogTableData: [], // 日志数据
      otherPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      FMATERIALCOST: '', // 物料成本
      logTableHeader: [
        { label: '日期', prop: 'createDate', align: 'center' },
        { label: '操作人', prop: 'fname', align: 'center' },
        { label: '部门', prop: 'fdeaprt', align: 'center' },
        { label: 'IP地址', prop: 'fip', align: 'center' },
        { label: '行为', prop: 'fdescribe', align: 'center' }
      ],
      team: 1,
      otherUrlObject: {}, // 其它审核人
      otherOptions: {}, // 其它
      FID: '', // 父类物料ID
      company: ''
    }
  },
  computed: {
    // 材料成本
    Summation() {
      const num = this.sonTableData.map(item => {
        item.money = item.FPRICE * item.FDOSAGE
        return item.money
      })
      const total = num.reduce((total, num) => {
        return total + num
      }, 0)
      return parseInt(total * 100) / 100
    }
  },
  mounted() {
    this.handleSetForm()
  },
  methods: {
    // 进入bom
    async getIntoBom(FNUMBER) {
      const { FTYPE, fMaterialId } = await queryFtypeInfo({ fnumber: FNUMBER })
      if (FTYPE === 0) {
        const materielCode = this.$route.params.FNUMBER
        if (materielCode === FNUMBER) {
          this.$message.error('没有查询到下层bom')
          return
        }
        this.$router.push({ path: `/detailBom/${FNUMBER}` })
        this.$message.success('进入bom')
      } else {
        this.$router.push({ path: `/detailMateriel/${fMaterialId}` })
        this.$message.success('进入物料清单')
      }
    },
    // 获取其它
    async handleOther() {
      const RES = await queryBomLog({ ...this.otherPagination, fid: this.FID })
      this.otherLogTableData = RES.data.array
      this.otherPagination.total = RES.data.total
      this.otherUrlObject = RES.data.operator
      this.otherOptions = {
        fcheck1: {
          label: '研发审核人',
          disabled: 'disabled'
        },
        fcheck2: {
          label: '打样审核人',
          disabled: 'disabled'
        },
        fcheck3: {
          label: '工程审核人',
          disabled: 'disabled'
        },
        fcheck4: {
          label: '成本审核人',
          disabled: 'disabled'
        },
        fcheck5: {
          label: '成本审核人',
          disabled: 'disabled'
        },
        fcheck6: {
          label: '工厂审核人',
          disabled: 'disabled'
        },
        fcheck7: {
          label: '信息化审核人',
          disabled: 'disabled'
        },
        fcheck8: {
          label: '总裁审核人',
          disabled: 'disabled'
        },
        fcheckDate1: {
          label: '研发审核时间',
          disabled: 'disabled'
        },
        fcheckDate2: {
          label: '打样审核时间',
          disabled: 'disabled'
        },
        fcheckDate3: {
          label: '工程审核时间',
          disabled: 'disabled'
        },
        fcheckDate4: {
          label: '成本审核时间',
          disabled: 'disabled'
        },
        fcheckDate5: {
          label: '成本审核时间',
          disabled: 'disabled'
        },
        fcheckDate6: {
          label: '工厂审核时间',
          disabled: 'disabled'
        },
        fcheckDate7: {
          label: '信息化审核时间',
          disabled: 'disabled'
        },
        fcheckDate8: {
          label: '总裁审核时间',
          disabled: 'disabled'
        },
        fcreateDate: {
          label: '创建时间',
          disabled: 'disabled'
        },
        fcreator: {
          label: '创建人',
          disabled: 'disabled'
        }
      }
    },
    // Form表单
    async handleSetForm() {
      const { data: RES } = await queryBomchildList({ fnumber: this.$route.params.FNUMBER })
      this.FID = RES.FID
      this.FMATERIALCOST = RES.FMATERIALCOST
      this.team = RES.FCREATEORG
      this.company = RES.FUSEORG
      this.sonTableData = RES.child
      // 物料form
      this.prodValue = RES
      this.prodValue.FMATERIALCOST = this.Summation
      this.prodOptions = {
        FMATERIALCOST: {
          label: '材料成本',
          disabled: 'disabled'
        },
        FLABORCOST: {
          label: '人工成本',
          disabled: 'disabled'
        },
        FBARCODE: {
          label: '条码',
          disabled: 'disabled'
        },
        FOLDNUMBER: {
          label: '旧物料编码',
          disabled: 'disabled'
        },
        FUNIT: {
          label: '物料单位',
          disabled: 'disabled'
        },
        FTAXRATE: {
          label: '税率',
          disabled: 'disabled'
        },
        FDEFAULTROUTING: {
          label: '工艺',
          disabled: 'disabled'
        },
        FMAKINGS: {
          label: '材质',
          disabled: 'disabled'
        },
        FGROSSWEIGHT: {
          label: '毛重',
          disabled: 'disabled'
        },
        FNETWEIGHT: {
          label: '净重',
          disabled: 'disabled'
        },
        FWEIGHTUNIT: {
          label: '重量单位',
          disabled: 'disabled'
        },
        FVOLUME: {
          label: '体积',
          disabled: 'disabled'
        },
        FNUMBER: {
          label: '物料编码',
          type: 'slot',
          disabled: 'disabled'
        },
        FSPECIFICATION: {
          label: '物料规格',
          disabled: 'disabled'
        },
        FDESCRIPTION: {
          label: '物料描述',
          type: 'textarea',
          disabled: 'disabled'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include bomCreate;
}
</style>
