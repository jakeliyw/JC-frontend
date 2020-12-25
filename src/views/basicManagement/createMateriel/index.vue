<template>
  <div class="content">
    <el-card class="header-card">
      <div class="tool">
        <el-button size="mini" @click="refresh">刷新</el-button>
        <el-button size="mini" type="primary" @click="preservation">保存物料</el-button>
      </div>
      <div class="organization">
        <jc-form :option-value="organizationValue" :options="organization" />
        <jc-form :option-value="oneMaterial" :options="oneMaterial">
          <el-select
            v-model="oneMaterialValue.LargeCode"
            size="mini"
            placeholder="请选择一类物料"
            filterable
            default-first-option
            style="width: 200px"
            @change="selectLargeName"
          >
            <el-option
              v-for="item in oneMaterielData"
              :key="item.LargeCode"
              :label="item.LargeName"
              :value="item.LargeCode"
            />
          </el-select>
        </jc-form>
        <jc-form :option-value="toMaterialValue" :options="toMaterial">
          <el-select
            v-model="toMaterialValue.MediumCode"
            size="mini"
            placeholder="请选择二类物料"
            filterable
            default-first-option
            style="width: 200px"
          >
            <el-option
              v-for="item of toMaterielData"
              :key="item.MediumCode"
              :label="item.MediumName"
              :value="item.MediumCode"
              @click.native="openMaterialDialog"
            />
          </el-select>
        </jc-form>
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基础" name="basic">
        <span class="title-background">基本信息</span>
        <el-divider />
        <div class="information">
          <div class="images">
            <el-upload
              :action="actionUrl"
              :show-file-list="false"
              :on-change="getFile"
              :auto-upload="false"
              class="upload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
          <div class="basics">
            <jc-form :option-value="basicValue" :options="basic" />
          </div>
        </div>
        <span class="title-background">控制信息</span>
        <el-divider />
        <div class="control">
          <el-checkbox label="允许资产" :disabled="assetsDisabled" :value="assetsChecked" @change="assets" />
          <el-checkbox label="允许库存" :disabled="checkoutDisabled" :value="stockChecked" @change="stock" />
          <el-checkbox label="允许生产" :disabled="checkoutDisabled" :value="productionChecked" @change="production" />
          <el-checkbox v-model="purchaseChecked" label="允许采购" />
          <el-checkbox label="允许销售" :disabled="checkoutDisabled" :value="saleChecked" @change="sale" />
          <el-checkbox label="允许委外" :disabled="checkoutDisabled" :value="outsourcingChecked" @change="outsourcing" />
        </div>
        <span v-show="isMaterial" class="title-background">物料属性</span>
        <el-divider v-if="isMaterial" />
        <div class="materielAttribute">
          <div v-for="(item, index) of materielProperty" :key="index" class="materielContent">
            <h4 class="dialog-span">{{ item.attribute }}</h4>
            <el-select
              v-model="item.value"
              class="span-title"
              size="mini"
              placeholder="请选择物料属性"
              filterable
              default-first-option
            >
              <el-option
                v-for="list of item.handrail"
                :key="list.value"
                :label="list.label"
                :value="list.value"
              />
            </el-select>
          </div>
        </div>
        <span class="title-background">重量信息</span>
        <el-divider />
        <jc-form :option-value="weightValue" :options="weight">
          <el-input v-model="weightValue.FNAME" size="mini" class="finance-input" placeholder="请选择重量单位">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleFweightList" />
          </el-input>
        </jc-form>
        <span class="title-background">尺寸信息</span>
        <el-divider />
        <jc-form :option-value="dimensionalValue" :options="dimensional">
          <el-input v-model="dimensionalValue.FNAME" size="mini" class="finance-input" placeholder="请选择尺寸单位">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleFvolumeList" />
          </el-input>
        </jc-form>
      </el-tab-pane>
      <el-tab-pane label="其它" name="log">
        <jc-other
          :other-url-object="{}"
          :other-log-table-data="[]"
        />
      </el-tab-pane>
    </el-tabs>
    <!--    单位、重量、尺寸弹窗-->
    <jc-popup
      v-model="weightPagination.FNAME"
      :dialog-title="dialogTitle"
      :open-dialog="openDialog"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchCompany"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '重量单位'"
          :cell-style="cellStyle"
          :table-data="weightTableData"
          :table-header="tableHeader"
          :table-height="0"
        >
          <template v-slot:btnSlot="clo">
            <el-button size="mini" type="primary" @click="weightSelect(clo.scope.row)">重量单位选中</el-button>
          </template>
        </jc-table>
        <jc-table
          v-show="dialogTitle === '尺寸单位'"
          :cell-style="cellStyle"
          :table-data="sizeTableData"
          :table-header="tableHeader"
          :table-height="0"
        >
          <template v-slot:btnSlot="clo">
            <el-button size="mini" type="primary" @click="sizeSelect(clo.scope.row)">尺寸单位选中</el-button>
          </template>
        </jc-table>
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="type === '重量单位'"
          v-show="total > 0"
          :total="total"
          :page.sync="weightPagination.pageNum"
          :limit.sync="weightPagination.pageSize"
          @pagination="handleFweightList"
        />
        <jc-pagination
          v-else-if="type === '尺寸单位'"
          v-show="total > 0"
          :total="total"
          :page.sync="sizePagination.pageNum"
          :limit.sync="sizePagination.pageSize"
          @pagination="handleFvolumeList"
        />
      </template>
    </jc-popup>
    <!--    物料弹窗-->
    <el-dialog
      title="物料选择"
      :visible.sync="openMaterial"
      width="92%"
      :close-on-click-modal="false"
      close-on-press-escape
      @close="resetMateriel"
    >
      <div class="dialog-content">
        <div class="large-class">
          <h4 class="dialog-span">一类物料</h4>
          <el-select
            v-model="oneMaterialValue.LargeCode"
            class="span-title"
            size="mini"
            disabled
          >
            <el-option
              v-for="item of oneMaterielData"
              :key="item.LargeCode"
              :label="item.LargeName"
              :value="item.LargeCode"
            />
          </el-select>
        </div>
        <div class="large-class">
          <h4 class="dialog-span">二类物料</h4>
          <el-select
            v-model="toMaterialValue.MediumCode"
            size="mini"
            disabled
            style="width: 200px"
          >
            <el-option
              v-for="item of toMaterielData"
              :key="item.MediumCode"
              :label="item.MediumName"
              :value="item.MediumCode"
            />
          </el-select>
        </div>
        <div class="sub-class">
          <div v-for="(item, index) of threeMaterielData" :key="index" class="content">
            <h4 class="dialog-span">{{ item.attribute }}</h4>
            <el-select
              v-model="item.value"
              class="span-title"
              size="mini"
              placeholder="请选择三类物料"
              filterable
              default-first-option
              @change="createSerial"
            >
              <el-option
                v-for="list of item.handrail"
                :key="list.value"
                :label="list.label"
                :value="list.value"
              />
            </el-select>
          </div>
        </div>
        <div class="large-class">
          <h4 class="dialog-span">流水号</h4>
          <el-input
            v-model="serialNumber"
            class="span-title"
            size="mini"
            disabled
            placeholder="自动生成流水号"
          />
        </div>
      </div>
      <jc-table
        :table-data="contrastDataTable"
        :table-header="contrastHeader"
        serial
        table-height="200px"
      />
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="contrastPagination.pageNum"
        :limit.sync="contrastPagination.pageSize"
        @pagination="openMaterialDialog"
      />
      <span slot="footer">
        <el-button size="small" @click="openMaterial = false">取消</el-button>
        <el-button size="small" type="primary" @click="materialSelection">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcPopup from '@/views/basicManagement/createMateriel/components/Popup'
import jcOther from '@/components/Other'
import jcFormFunction from '@/components/Form/FormFunction'
import {
  queryTOrgOrganizationsL,
  queryFweightList,
  queryFvolumeList,
  queryOneMaterialNumber,
  queryUnitList,
  queryTwoMaterialNumber,
  queryThreeMaterialNumber,
  queryCoodingNumber,
  insertMaterialDetail,
  queryMaterialAttribute,
  queryMaterialAttributes
} from '@/api/basicManagement/createMateriel'

export default {
  name: 'CreateMateriel',
  components: {
    jcForm,
    jcPopup,
    jcTable,
    jcPagination,
    jcOther
  },
  mixins: [jcFormFunction],
  data() {
    return {
      actionUrl: '/tBdMaterial/insertMaterialDetail',
      activeName: 'basic', // 选项卡默认
      openDialog: false, // 重量、单位、尺寸弹窗
      openMaterial: false, // 物料弹窗
      FDESCRIPTION: '', // 描述后端返回值
      isMaterial: false, // 物料属性显示与隐藏
      assetsChecked: false, // 资产默认不打勾
      stockChecked: true, // 库存默认不打勾
      productionChecked: true, // 生产默认不打勾
      purchaseChecked: true, // 采购默认不打勾
      saleChecked: true, // 销售默认不打勾
      outsourcingChecked: true, // 允许委外
      assetsDisabled: true, // 资产禁用
      checkoutDisabled: false, // 单选框禁用
      useOrganization: '', // 使用组织
      cellStyle: { padding: '10 10' }, // 行高
      popupTitle: '', // 查询条件文本
      dialogTitle: '', // 弹窗标题
      total: 0, // 条目
      materialCode: '', // 物料编码
      type: '', // 判断分页
      serialNumber: '', // 流水号
      oneMaterielData: [], // 一类物料
      toMaterielData: [], // 二类物料
      threeMaterielData: [], // 三类物料
      weightPagination: {
        FNAME: '', // 单位名称
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      sizePagination: {
        FNAME: '', // 单位名称
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      contrastPagination: {
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      weightTableData: [], // 重量单位数据
      sizeTableData: [], // 尺寸单位
      // 基本单位
      basicUnit: [],
      protect: [
        {
          label: 'A级',
          value: 'A级'
        },
        {
          label: 'B级',
          value: 'B级'
        },
        {
          label: 'C级',
          value: 'C级'
        }
      ],
      tableHeader: [
        { label: '基本单位编码', prop: 'FNUMBER', align: 'center' },
        { label: '基本单位名称', prop: 'FNAME', align: 'center ' },
        { label: '基准计量单位', prop: 'FISBASEUNIT', align: 'center' },
        { label: '数据状态', prop: 'FDOCUMENTSTATUS', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '150px', align: 'center' }
      ],
      contrastHeader: [
        { label: '组织', prop: 'FUSEORG', align: 'center' },
        { label: '物料编码', prop: 'FNUMBER', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', align: 'center' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '物料属性', prop: 'FSPECIFICATION', align: 'center' }
      ],
      contrastDataTable: [],
      materielProperty: [], // 颜色属性
      dimensionalValue: {}, // 尺寸值
      dimensional: {}, // 尺寸控件
      weightValue: {}, // 重量数据
      weight: {}, // 重量控件
      basicValue: {}, // 基本数据
      basic: {}, // 基本控件
      organizationValue: {}, // 组织值
      organization: {}, // 组织控件
      oneMaterialValue: {}, // 一类物料值
      oneMaterial: {}, // 一类物料控件
      toMaterialValue: {}, // 二类物料值
      toMaterial: {}, // 二类物料控件
      thereMaterialValue: '', // 三类物料值
      thereMaterial: {} // 三类物料控件
    }
  },
  computed: {
    newObj() {
      const { FLENGTH, FWIDTH, FHEIGHT } = this.dimensionalValue
      return { FLENGTH, FWIDTH, FHEIGHT }
    }
  },
  watch: {
    newObj(val) {
      this.dimensionalValue.FLENGTH = val.FLENGTH
      this.dimensionalValue.FWIDTH = val.FWIDTH
      this.dimensionalValue.FHEIGHT = val.FHEIGHT
      const { FLENGTH, FWIDTH, FHEIGHT } = val
      const LONG = JSON.stringify(FLENGTH)
      const WIDE = JSON.stringify(FWIDTH)
      const HIGH = JSON.stringify(FHEIGHT)
      const SIZE = ''
      this.basicValue.FDESCRIPTION = SIZE.concat(`${this.FDESCRIPTION}*${LONG}`, `*${WIDE}`, `*${HIGH}`)
    }
  },
  mounted() {
    this.handleControl()
    this.getOneMaterielData()
    this.getBasicUnit()
  },
  methods: {
    // 允许资产
    assets() {
      this.assetsChecked = !this.assetsChecked
      if (this.assetsChecked) {
        this.purchaseChecked = true
        this.stockChecked = false
        this.productionChecked = false
        this.saleChecked = false
        this.outsourcingChecked = false
        this.checkoutDisabled = true
      } else if (!this.assetsChecked) {
        this.purchaseChecked = false
        this.stockChecked = false
        this.productionChecked = false
        this.saleChecked = false
        this.outsourcingChecked = false
        this.checkoutDisabled = false
      }
    },
    // 允许库存
    stock() {
      this.stockChecked = !this.stockChecked
      if (this.stockChecked) {
        this.assetsDisabled = true
      } else if (!this.outsourcingChecked && !this.saleChecked && !this.productionChecked && !this.stockChecked) {
        this.assetsDisabled = false
      }
    },
    // 允许生产
    production() {
      this.productionChecked = !this.productionChecked
      if (this.productionChecked) {
        this.assetsDisabled = true
      } else if (!this.outsourcingChecked && !this.saleChecked && !this.productionChecked && !this.stockChecked) {
        this.assetsDisabled = false
      }
    },
    // 允许销售
    sale() {
      this.saleChecked = !this.saleChecked
      if (this.saleChecked) {
        this.assetsDisabled = true
      } else if (!this.outsourcingChecked && !this.saleChecked && !this.productionChecked && !this.stockChecked) {
        this.assetsDisabled = false
      }
    },
    // 允许委外
    outsourcing() {
      this.outsourcingChecked = !this.outsourcingChecked
      if (this.outsourcingChecked) {
        this.assetsDisabled = true
      } else if (!this.outsourcingChecked && !this.saleChecked && !this.productionChecked && !this.stockChecked) {
        this.assetsDisabled = false
      }
    },
    // 获取一类物料
    async getOneMaterielData() {
      const { data: RES } = await queryOneMaterialNumber()
      this.oneMaterielData = RES
    },
    // 选中一类物料
    async selectLargeName() {
      const { data: RES } = await queryTwoMaterialNumber({ LargeCode: this.oneMaterialValue.LargeCode })
      this.toMaterielData = RES
    },
    // 生成流水号
    SmallCode() {
      const SERIAL = this.threeMaterielData.filter(item => {
        return item.value !== ''
      })
      if (SERIAL.length !== this.threeMaterielData.length) {
        return
      }
      const SmallCode = SERIAL.map(item => item.value)
      return SmallCode
    },
    // 选中三类
    async createSerial() {
      const codeNumber = this.SmallCode()
      if (codeNumber === undefined) {
        return
      }
      const DATA = {
        ...this.contrastPagination,
        LargeCode: this.oneMaterialValue.LargeCode,
        MediumCode: this.toMaterialValue.MediumCode,
        SmallCode: `${codeNumber.toString()}`
      }
      const { data } = await queryCoodingNumber(DATA)
      this.contrastDataTable = data.contrast
      this.total = data.total
      this.materialCode = data.fnumber
      this.serialNumber = data.fnumber.substring(data.fnumber.length - 4)
    },
    // 物料确定
    async materialSelection() {
      const codeNumber = this.SmallCode()
      if (this.serialNumber === '') {
        this.$message.error('数据填写不完整，请重新填写！')
        return
      }
      const DATA = {
        LargeCode: this.oneMaterialValue.LargeCode,
        MediumCode: this.toMaterialValue.MediumCode,
        SmallCode: `${codeNumber.toString()}`
      }
      const { data: RES, FDESCRIPTION } = await queryMaterialAttribute(DATA)
      this.FDESCRIPTION = FDESCRIPTION
      this.basicValue.FDESCRIPTION = FDESCRIPTION
      this.materielProperty = RES
      this.basicValue.FNUMBER = this.materialCode
      this.isMaterial = true
      this.openMaterial = false
    },
    // 重置弹窗
    resetMateriel() {
      this.serialNumber = ''
    },
    // 保存物料
    async preservation() {
      const ITEM = this.organization.FCREATEORG.selectItems.find(item => item)
      const codeNumber = this.SmallCode()
      const FATTRIBTTE = this.materielProperty.map(item => {
        const VALUE = item.handrail.find(obj => {
          return item.value === obj.value
        })
        return VALUE
      })
      if (codeNumber === undefined) {
        return
      }
      const SmallCode = `${codeNumber.toString()}`
      const DATA = {
        FCREATEORGID: ITEM.value,
        FUSEORGID: ITEM.value,
        LargeCode: this.oneMaterialValue.LargeCode,
        MediumCode: this.toMaterialValue.MediumCode,
        SmallCode,
        // 旧物料编码
        FOLDNUMBER: this.basicValue.FOLDNUMBER,
        // 条码
        FBARCODE: this.basicValue.FBARCODE,
        // 型号
        FMODEL: this.basicValue.FMODEL,
        // 套件(环保等级)
        FPROTECT: this.basicValue.FSUITE,
        // 物料描述
        FDESCRIPTION: this.basicValue.FDESCRIPTION,
        // 基本单位
        FBASEUNITID: this.basicValue.FNAME,
        // 物料类型
        FERPCLSID: this.basicValue.FERPCLSID,
        // 允许采购
        FISPURCHASE: this.purchaseChecked,
        // 允许销售
        FISSALE: this.saleChecked,
        // 允许库存
        FISINVENTORY: this.stockChecked,
        // 允许生产
        FISPRODUCE: this.productionChecked,
        // 允许委外
        FISSUBCONTRACT: this.outsourcingChecked,
        // 允许资产
        FISASSET: this.assetsChecked,
        // 重量单位
        FGROSSWEIGHT: this.weightValue.FGROSSWEIGHT,
        FNETWEIGHT: this.weightValue.FNETWEIGHT,
        // 重量单位ID
        FWEIGHTUNITID: this.weightValue.FWEIGHTUNITID,
        // 尺寸单位
        FLENGTH: this.dimensionalValue.FLENGTH,
        FWIDTH: this.dimensionalValue.FWIDTH,
        FHEIGHT: this.dimensionalValue.FHEIGHT,
        FVOLUME: this.dimensionalValue.FVOLUME,
        FVOLUMEUNITID: this.dimensionalValue.FVOLUMEUNITID,
        FTHICKNESS: this.dimensionalValue.FTHICKNESS,
        FATTRIBTTE
      }
      for (const key in DATA) {
        if (DATA[key] === '' || DATA[key] === undefined) {
          this.$message.error('内容输入不完整，请重新输入！')
          return
        }
      }
      const RES = [this.assetsChecked, this.stockChecked, this.productionChecked, this.purchaseChecked, this.saleChecked,
        this.outsourcingChecked].includes(false)
      if (RES === false) {
        this.$message.error('控制信息必选一项！')
        return
      }
      if (this.weightValue.FNETWEIGHT > this.weightValue.FGROSSWEIGHT) {
        this.$message.error('净重不能大于毛重')
        return
      }
      // 图片可以为空
      DATA.FIMG = this.imageUrl
      // 物料备注可以为空
      DATA.FREMARKS = this.basicValue.FREMARKS
      const { code, message } = await insertMaterialDetail(DATA)
      if (code !== 0) {
        this.$message.error(message)
        return
      }
      this.$message.success(message)
      setTimeout(() => {
        location.reload()
      }, 2000)
    },
    // 三类物料
    async openMaterialDialog() {
      const { data: RES } = await queryThreeMaterialNumber({
        LargeCode: this.oneMaterialValue.LargeCode,
        MediumCode: this.toMaterialValue.MediumCode,
        ...this.contrastPagination
      })
      this.threeMaterielData = RES.subclass
      this.contrastDataTable = RES.contrast
      this.total = RES.total
      this.openMaterial = true
    },
    // 关闭表格弹窗
    closeDialog() {
      this.sizePagination.pageNum = 1
      this.weightPagination.pageNum = 1
      this.openDialog = false
    },
    // 清空表单
    emptyForm() {
      this.FNAME = ''
    },
    // 搜索
    searchCompany() {
      this.currentPage = 1
      this.handleFweightList()
    },
    // 公共组件
    async dialogData(dialogTitle, DATA, apiInterface) {
      this.openDialog = true
      this.dialogTitle = dialogTitle
      const RES = await apiInterface(DATA)
      this.popupTitle = RES.search
      this.total = RES.total
      return RES
    },
    // 基本单位
    async getBasicUnit() {
      const { data: RES } = await queryUnitList()
      return RES.map(item => {
        return { label: item.FNAME, value: item.FBASEUNITID }
      })
    },
    // 重量单位
    async handleFweightList() {
      const RES = await this.dialogData('重量单位', { ...this.weightPagination }, queryFweightList)
      this.weightTableData = RES.data
      this.type = '重量单位'
    },
    // 重量单位选中
    weightSelect(row) {
      this.weightValue.FWEIGHTUNITID = row.FWEIGHTUNITID
      this.weightValue.FNAME = row.FNAME
      this.openDialog = false
    },
    // 尺寸单位
    async handleFvolumeList() {
      const RES = await this.dialogData('尺寸单位', { ...this.sizePagination }, queryFvolumeList)
      this.sizeTableData = RES.data
      this.type = '尺寸单位'
    },
    // 尺寸单位选中
    sizeSelect(row) {
      this.dimensionalValue.FVOLUMEUNITID = row.FVOLUMEUNITID
      this.dimensionalValue.FNAME = row.FNAME
      this.openDialog = false
    },
    // 获取组织
    async getOrganization() {
      const { data: RES } = await queryTOrgOrganizationsL()
      return RES.map(item => {
        this.useOrganization = item.FNAME
        return { label: item.FNAME, value: item.FPKID }
      })
    },
    // 获取物料类型
    async getMaterielType() {
      const { data: RES } = await queryMaterialAttributes()
      return RES.map(item => {
        return { label: item.FCAPTION, value: item.FERPCLSID }
      })
    },
    // 获取环境
    async getKit() {
      return this.protect
    },
    // 刷新页面
    refresh() {
      location.reload()
    },
    async handleControl() {
      const organizationRes = await this.getOrganization()
      const kitRes = await this.getKit()
      const BasicUnit = await this.getBasicUnit()
      const materielType = await this.getMaterielType()
      this.organizationValue = {
        FCREATEORG: 1,
        FUSEORG: this.useOrganization
      }
      this.organization = {
        FCREATEORG: {
          label: '创建组织',
          type: 'select',
          span: 12,
          selectItems: organizationRes,
          rules: [
            { required: true }
          ]
        },
        FUSEORG: {
          label: '使用组织',
          span: 12,
          disabled: 'disabled',
          rules: [
            { required: true }
          ]
        }
      }
      this.oneMaterialValue = {
        LargeCode: ''
      }
      this.oneMaterial = {
        LargeCode: {
          label: '一类物料',
          type: 'slot',
          rules: [
            { required: true, message: '请选择一类物料', trigger: 'change' }
          ]
        }
      }
      this.toMaterialValue = {
        MediumCode: ''
      }
      this.toMaterial = {
        MediumCode: {
          label: '二类物料',
          type: 'slot',
          rules: [
            { required: true, message: '请选择二类物料', trigger: 'change' }
          ]
        }
      }
      this.basicValue = {
        FNAME: '',
        FNUMBER: '',
        FOLDNUMBER: '',
        FBARCODE: '',
        FERPCLSID: '',
        FSUITE: '',
        FMODEL: '',
        FDESCRIPTION: '',
        FREMARKS: ''
      }
      this.basic = {
        FNUMBER: {
          label: '物料编码',
          span: 8,
          disabled: 'disabled'
        },
        FOLDNUMBER: {
          label: '旧物料编码',
          span: 8,
          rules: [
            { required: true, message: '旧物料编码不能为空', trigger: 'blur' }
          ]
        },
        FNAME: {
          label: '基本单位',
          type: 'select',
          selectItems: BasicUnit,
          span: 8,
          rules: [
            { required: true, message: '请选择基本单位', trigger: 'change' }
          ]
        },
        FBARCODE: {
          label: '条码',
          span: 8,
          rules: [
            { required: true, message: '条码不能为空', trigger: 'blur' }
          ]
        },
        FSUITE: {
          label: '环保等级',
          type: 'selectObj',
          selectItems: kitRes,
          span: 8,
          rules: [
            { required: true, message: '请选择环保等级', trigger: 'change' }
          ]
        },
        FMODEL: {
          label: '型号',
          span: 8,
          rules: [
            { required: true, message: '型号不能为空', trigger: 'blur' }
          ]
        },
        FREMARKS: {
          label: '物料备注',
          span: 8
        },
        FERPCLSID: {
          label: '物料类型',
          span: 16,
          type: 'select',
          selectItems: materielType,
          rules: [
            { required: true, message: '请选择物料类型', trigger: 'blur' }
          ]
        },
        FDESCRIPTION: {
          label: '物料描述',
          disabled: 'disabled',
          isActive: 'isActive',
          rules: [
            { required: true, message: '请输入物料描述', trigger: 'blur' }
          ]
        }
      }
      this.weightValue = {
        FNAME: '',
        FGROSSWEIGHT: '',
        FNETWEIGHT: ''
      }
      this.weight = {
        FNAME: {
          label: '重量单位',
          type: 'slot',
          rules: [
            { required: true, message: '请选择重量单位', trigger: 'blur' }
          ]
        },
        FGROSSWEIGHT: {
          label: '毛重',
          type: 'number'
        },
        FNETWEIGHT: {
          label: '净重',
          type: 'number'
        }
      }
      this.dimensionalValue = {
        FNAME: '',
        FLENGTH: 0.0,
        FWIDTH: 0.0,
        FHEIGHT: 0.0,
        FVOLUME: 0.0,
        FTHICKNESS: 0.0
      }
      this.dimensional = {
        FNAME: {
          label: '尺寸单位',
          type: 'slot',
          rules: [
            { required: true, message: '请选择尺寸单位', trigger: 'blur' }
          ]
        },
        FLENGTH: {
          label: '长',
          type: 'number'
        },
        FWIDTH: {
          label: '宽',
          type: 'number'
        },
        FHEIGHT: {
          label: '高',
          type: 'number'
        },
        FTHICKNESS: {
          label: '厚度',
          type: 'number'
        },
        FVOLUME: {
          label: '体积',
          type: 'number'
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

.title-background {
  color: #FFD04B;
  background-color: #848383;
}

.header-card {
  height: 130px;
}

.information {
  display: flex;
  justify-content: space-around;

  .images {
    width: 300px;
    display: flex;
    justify-content: center;
  }

  .basics {
    width: 1300px;
  }
}

.control{
  margin-bottom: 20px;
}
.dialog-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;

  .large-class {
    padding: 0;
    display: flex;
    flex-direction: column;
    width: 200px;
    justify-content: center;
    margin-right: 10px;
    margin-left: 10px;

    .dialog-span {
      width: 200px;
      text-align: center;
    }
  }

  .sub-class {
    display: flex;
    flex-direction: row;
    border: 1px solid #DCDFE6;

    .content {
      display: flex;
      flex-direction: column;
      margin: 0 10px;

      .dialog-span {
        width: 200px;
        text-align: center;
      }
    }
  }
}

.materielAttribute {
  display: flex;
  flex-direction: row;

  .materielContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 50px;

    .dialog-span {
      font-weight: bold;
      color: #606266;
      font-size: 14px;
      padding: 0 10px;
    }
  }
}

.upload {
  @include upLoad;
}
</style>
