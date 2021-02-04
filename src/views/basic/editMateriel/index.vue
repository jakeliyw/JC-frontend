<template>
  <div class="content">
    <el-card class="header-card">
      <div class="tool">
        <el-button size="mini" @click="refresh">刷新</el-button>
        <el-button size="mini" type="primary" @click="preservation">确定更新</el-button>
      </div>
      <div class="organization">
        <jc-form :option-value="organizationValue" :options="organization" />
        <jc-form :option-value="oneMaterial" :options="oneMaterial">
          <el-select
            v-model="oneMaterialValue.largeName"
            size="mini"
            placeholder="请选择一类物料"
            filterable
            default-first-option
            style="width: 200px"
            disabled
          />
        </jc-form>
        <jc-form :option-value="toMaterialValue" :options="toMaterial">
          <el-select
            v-model="toMaterialValue.mediumCode"
            size="mini"
            placeholder="请选择二类物料"
            filterable
            default-first-option
            style="width: 200px"
            disabled
          >
            <el-option
              v-for="item of toMaterielData"
              :key="item.mediumCode"
              :label="item.mediumName"
              :value="item.mediumCode"
              @click.native="openMaterialDialog"
            />
          </el-select>
        </jc-form>
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleOther">
      <el-tab-pane label="基础" name="basic">
        <span class="title-background">综合信息</span>
        <div class="information">
          <div class="images">
            <el-upload
              :action="actionUrl"
              :show-file-list="false"
              :on-change="getFile"
              :auto-upload="false"
              class="upload"
            >
              <img v-if="imageUrl" :src="`${backstageApi}${imageUrl}`" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
          <div class="basics">
            <jc-form :option-value="basicValue" :options="basic">
              <el-select v-model="basicValue.fbaseUnitId" placeholder="请选择基本单位" size="small" filterable @change="handleCompany">
                <el-option
                  v-for="item in basicUnit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </jc-form>
          </div>
        </div>
        <span class="title-background">明细信息</span>
        <div class="control">
          <el-checkbox label="允许资产" :disabled="assetsDisabled" :value="fisasset" @change="assets" />
          <el-checkbox label="允许库存" :disabled="checkoutDisabled" :value="fisinventory" @change="stock" />
          <el-checkbox label="允许生产" :disabled="checkoutDisabled" :value="fisproduce" @change="production" />
          <el-checkbox v-model="fispurchase" label="允许采购" />
          <el-checkbox label="允许销售" :disabled="checkoutDisabled" :value="fissale" @change="sale" />
          <el-checkbox label="允许委外" :disabled="checkoutDisabled" :value="fissubcontract" @change="outsourcing" />
        </div>
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
                v-for="list in item.handrail"
                :key="list.value"
                :label="list.label"
                :value="list.value"
              />
            </el-select>
          </div>
        </div>
        <el-divider class="weight" />
        <jc-form :option-value="weightValue" :options="weight">
          <el-input v-model="weightValue.fweightUnitName" size="mini" class="finance-input" placeholder="请选择重量单位">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleFweightList" />
          </el-input>
        </jc-form>
        <el-divider class="dimensional" />
        <jc-form :option-value="dimensionalValue" :options="dimensional">
          <el-input v-model="dimensionalValue.fvolumeunitName" size="mini" class="finance-input" placeholder="请选择尺寸单位">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleFvolumeList" />
          </el-input>
        </jc-form>
      </el-tab-pane>
      <el-tab-pane label="信息" name="information">
        <jc-information
          :company="company"
          :information.sync="information"
        />
      </el-tab-pane>
      <el-tab-pane label="其它" name="log">
        <jc-form :option-value="otherUrlObject" :options="otherOptions" />
        <jc-table
          :table-header="logTableHeader"
          :table-data="otherData"
          :cell-style="cellStyle"
          table-height="calc(100vh - 550px)"
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
    <!--    重量弹窗-->
    <jc-popup
      v-model="weightPagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openWeightDialog"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchWeight"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '重量单位'"
          :cell-style="cellStyle"
          :table-data="weightTableData"
          :table-header="tableHeader"
          :table-height="0"
          @clickRow="weightSelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '重量单位'"
          v-show="total > 0"
          :total="total"
          :page.sync="weightPagination.pageNum"
          :limit.sync="weightPagination.pageSize"
          @pagination="handleFweightList"
        />
      </template>
    </jc-popup>
    <!--    尺寸弹窗-->
    <jc-popup
      v-model="sizePagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openSizeDialog"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchSize"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '尺寸单位'"
          :cell-style="cellStyle"
          :table-data="sizeTableData"
          :table-header="tableHeader"
          :table-height="0"
          @clickRow="sizeSelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '尺寸单位'"
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
            v-model="oneMaterialValue.largeCode"
            class="span-title"
            size="mini"
            disabled
          />
        </div>
        <div class="large-class">
          <h4 class="dialog-span">二类物料</h4>
          <el-select
            v-model="toMaterialValue.mediumCode"
            size="mini"
            disabled
            style="width: 200px"
          >
            <el-option
              v-for="item of toMaterielData"
              :key="item.mediumCode"
              :label="item.mediumName"
              :value="item.mediumCode"
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
        :cell-style="cellStyle"
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
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import jcFormFunction from '@/components/Form/FormFunction'
import jcInformation from '../createMateriel/Information'
import {
  queryTOrgOrganizationsL,
  queryFweightList,
  queryFvolumeList,
  queryUnitList,
  queryTwoMaterialNumber,
  queryThreeMaterialNumber,
  queryCoodingNumber,
  queryMaterialAttribute,
  queryMaterialAttributes,
  queryMaterialDetail,
  updateMaterialDetail
} from '@/api/basicManagement/createMateriel'
import { queryMaterialLog } from '@/api/basicManagement/materielList'

export default {
  name: 'EditMateriel',
  components: {
    jcForm,
    jcPopup,
    jcTable,
    jcPagination,
    jcInformation
  },
  mixins: [jcFormFunction],
  inject: ['reload'],
  data() {
    return {
      actionUrl: '/tBdMaterial/insertMaterialDetail',
      activeName: 'basic', // 选项卡默认
      openWeightDialog: false, // 重量弹窗
      openSizeDialog: false, // 尺寸弹窗
      openMaterial: false, // 物料弹窗
      fdescripTion: '', // 描述后端返回值
      isMaterial: false, // 物料属性显示与隐藏
      fisasset: false, // 资产默认不打勾
      fisinventory: true, // 库存默认不打勾
      fisproduce: true, // 生产默认不打勾
      fispurchase: true, // 采购默认不打勾
      fissale: true, // 销售默认不打勾
      fissubcontract: true, // 允许委外
      assetsDisabled: true, // 资产禁用
      checkoutDisabled: false, // 单选框禁用
      useOrganization: '', // 使用组织
      cellStyle: { padding: '10 10' }, // 行高
      popupTitle: '', // 查询条件文本
      dialogTitle: '', // 弹窗标题
      total: 0, // 条目
      serialNumber: '', // 流水号
      otherPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      otherOptions: {},
      otherUrlObject: {}, // 其它表单
      company: {}, // 选中单位中文名称
      toMaterielData: [], // 二类物料
      threeMaterielData: [], // 三类物料
      weightPagination: {
        fname: '', // 单位名称
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      sizePagination: {
        fname: '', // 单位名称
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      contrastPagination: {
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      weightTableData: [], // 重量单位数据
      sizeTableData: [], // 尺寸单位
      basicUnit: [], // 基本单位
      tableHeader: [
        { label: '基本单位编码', prop: 'fnumber', align: 'center' },
        { label: '基本单位名称', prop: 'fname', align: 'center ' },
        { label: '基准计量单位', prop: 'fisbaseUnit', align: 'center' },
        { label: '数据状态', prop: 'fdocumentStatus', align: 'center' }
      ],
      contrastHeader: [
        { label: '组织', prop: 'fuseOrg', align: 'center' },
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center' },
        { label: '型号', prop: 'fmodel', align: 'center' },
        { label: '物料属性', prop: 'FSPECIFICATION', align: 'center' }
      ],
      otherData: [], // 其它数据
      logTableHeader: [
        { label: '日期', prop: 'createDate', align: 'center' },
        { label: '操作人', prop: 'fname', align: 'center' },
        { label: '部门', prop: 'fdeaprt', align: 'center' },
        { label: 'IP地址', prop: 'fip', align: 'center' },
        { label: '行为', prop: 'fdescribe', align: 'center' }
      ],
      contrastDataTable: [], // 三类物料
      materielProperty: [], // 物料属性
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
      thereMaterial: {}, // 三类物料控件
      information: {
        fsupplierId: 0, // 供应商id
        fdefaultvendor: null, // 供应商名称
        fbillTypeId: 0, // 采购类型id
        fpobillTypeName: '', // 采购类型名称
        fquotaType: '1', // 配额方式id
        fstockId: 0, // 仓库
        fstockName: '', // 仓库名称
        position: 0, // 仓位
        fminStock: 0, // 最小库存
        fsafeStock: 0, // 安全库存
        fmaxStock: 0 // 最大库存
      }
    }
  },
  watch: {
    'oneMaterialValue.largeCode': {
      handler(oldValue) {
        this.getToMaterial(oldValue)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.handleForm()
    this.getBasicUnit()
  },
  methods: {
    // 获取二级物料数据
    async getToMaterial(largeCode) {
      const { data: RES } = await queryTwoMaterialNumber({ largeCode })
      this.toMaterielData = RES
    },
    // 允许资产
    assets() {
      this.fisasset = !this.fisasset
      if (this.fisasset) {
        this.fispurchase = true
        this.fisinventory = false
        this.fisproduce = false
        this.fissale = false
        this.fissubcontract = false
        this.checkoutDisabled = true
      } else if (!this.fisasset) {
        this.fispurchase = false
        this.fisinventory = false
        this.fisproduce = false
        this.fissale = false
        this.fissubcontract = false
        this.checkoutDisabled = false
      }
    },
    // 允许库存
    stock() {
      this.fisinventory = !this.fisinventory
      if (this.fisinventory) {
        this.assetsDisabled = true
      } else if (!this.fissubcontract && !this.fissale && !this.fisproduce && !this.fisinventory) {
        this.assetsDisabled = false
      }
    },
    // 允许生产
    production() {
      this.fisproduce = !this.fisproduce
      if (this.fisproduce) {
        this.assetsDisabled = true
      } else if (!this.fissubcontract && !this.fissale && !this.fisproduce && !this.fisinventory) {
        this.assetsDisabled = false
      }
    },
    // 允许销售
    sale() {
      this.fissale = !this.fissale
      if (this.fissale) {
        this.assetsDisabled = true
      } else if (!this.fissubcontract && !this.fissale && !this.fisproduce && !this.fisinventory) {
        this.assetsDisabled = false
      }
    },
    // 允许委外
    outsourcing() {
      this.fissubcontract = !this.fissubcontract
      if (this.fissubcontract) {
        this.assetsDisabled = true
      } else if (!this.fissubcontract && !this.fissale && !this.fisproduce && !this.fisinventory) {
        this.assetsDisabled = false
      }
    },
    // 生成流水号
    SmallCode() {
      // const SERIAL = this.threeMaterielData.filter(item => {
      //   return item.value !== ''
      // })
      // if (SERIAL.length !== this.threeMaterielData.length) {
      //   return
      // }
      const SmallCode = this.threeMaterielData.map(item => item.value)
      return SmallCode
    },
    // 选中三类
    async createSerial() {
      const codeNumber = this.SmallCode()
      // if (codeNumber === undefined) {
      //   return
      // }
      const DATA = {
        ...this.contrastPagination,
        largeCode: this.oneMaterialValue.largeCode,
        mediumCode: this.toMaterialValue.mediumCode,
        smallCode: `${codeNumber.toString()}`
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
        this.$message.warning({ message: '数据填写不完整，请重新填写！' })
        return
      }
      const DATA = {
        largeCode: this.oneMaterialValue.largeCode,
        mediumCode: this.toMaterialValue.mediumCode,
        smallCode: `${codeNumber.toString()}`
      }
      const { data: RES, fdescripTion } = await queryMaterialAttribute(DATA)
      this.fdescripTion = fdescripTion
      this.basicValue.fdescripTion = fdescripTion
      this.materielProperty = RES
      this.basicValue.fnumber = this.materialCode
      this.isMaterial = true
      this.openMaterial = false
    },
    // 重置弹窗
    resetMateriel() {
      this.serialNumber = ''
    },
    // 保存物料
    async preservation() {
      const codeNumber = this.SmallCode()
      const fattribtte = this.materielProperty.map(item => {
        const VALUE = item.handrail.find(obj => {
          return item.value === obj.value
        })
        return VALUE
      })
      const smallCode = `${codeNumber.toString()}`
      const fuserId = window.sessionStorage.getItem('fuserId')
      const DATA = {
        fuserId,
        smallCode,
        largeCode: this.oneMaterialValue.largeCode,
        mediumCode: this.toMaterialValue.mediumCode,
        fmaterialId: this.$route.query.fmaterialId,
        fnumber: this.$route.query.fnumber,
        // 允许采购
        fispurchase: this.fispurchase,
        // 允许销售
        fissale: this.fissale,
        // 允许库存
        fisinventory: this.fisinventory,
        // 允许生产
        fisproduce: this.fisproduce,
        // 允许委外
        fissubcontract: this.fissubcontract,
        // 允许资产
        fisasset: this.fisasset,
        fbaseUnitId: this.basicValue.fbaseUnitId,
        foldnumber: this.basicValue.foldnumber,
        fbarCode: this.basicValue.fbarCode,
        ferpclsId: this.basicValue.ferpclsId,
        fprotect: this.basicValue.fprotect,
        fmodel: this.basicValue.fmodel,
        // 物料备注
        fremarks: this.basicValue.fremarks,
        fdescripTion: this.basicValue.fdescripTion,
        fvolumeUnitId: this.dimensionalValue.fvolumeUnitId,
        fvolumeunitName: this.dimensionalValue.fvolumeunitName,
        fvolume: this.dimensionalValue.fvolume,
        fthickness: this.dimensionalValue.fthickness,
        flength: this.dimensionalValue.flength,
        fwidth: this.dimensionalValue.fwidth,
        fheight: this.dimensionalValue.fheight,
        fopenLength: this.dimensionalValue.fopenLength,
        fweightUnitName: this.weightValue.fweightUnitName,
        fweightUnitId: this.weightValue.fweightUnitId,
        fgrossWeight: this.weightValue.fgrossWeight,
        fnetWeight: this.weightValue.fnetWeight,
        fimg: this.imageUrl,
        fattribtte: JSON.stringify(fattribtte)
      }
      Object.assign(DATA, this.information)
      const CHECKOUT = [this.fisasset, this.fisinventory, this.fisproduce, this.fispurchase, this.fissale,
        this.fissubcontract]
      const RES = CHECKOUT.every(item => {
        return item === false
      })
      if (RES === true) {
        this.$message.warning({ message: '控制信息必选一项！' })
        return
      }
      const { code, message, data } = await updateMaterialDetail(DATA)
      if (code !== 0) {
        this.$message.warning({ message })
        return
      }
      this.$message.success({ message })
      this.$router.push({
        name: 'EditMateriel',
        query: {
          fnumber: data,
          fmaterialId: this.$route.query.fmaterialId
        }
      })
      this.reload()
    },
    // 三类物料
    async openMaterialDialog() {
      const { data: RES } = await queryThreeMaterialNumber({
        largeCode: this.oneMaterialValue.largeCode,
        mediumCode: this.toMaterialValue.mediumCode,
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
      this.openWeightDialog = false
      this.openSizeDialog = false
    },
    // 清空表单
    emptyForm() {
      this.weightPagination.fname = ''
      this.sizePagination.fname = ''
    },
    // 重量搜索
    searchWeight() {
      this.weightPagination.pageNum = 1
      this.handleFweightList()
    },
    // 尺寸搜索
    searchSize() {
      this.sizePagination.pageNum = 1
      this.handleFvolumeList()
    },
    // 公共组件
    async dialogData(dialogTitle, DATA, apiInterface) {
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
        return { label: item.fname, value: item.fbaseUnitId }
      })
    },
    // 重量单位
    async handleFweightList() {
      this.openWeightDialog = true
      const RES = await this.dialogData('重量单位', { ...this.weightPagination }, queryFweightList)
      this.weightTableData = RES.data
    },
    // 重量单位选中
    weightSelect(row) {
      this.weightValue.fweightUnitId = row.fweightUnitId
      this.weightValue.fweightUnitName = row.fname
      this.openWeightDialog = false
    },
    // 尺寸单位
    async handleFvolumeList() {
      const RES = await this.dialogData('尺寸单位', { ...this.sizePagination }, queryFvolumeList)
      this.sizeTableData = RES.data
      this.openSizeDialog = true
    },
    // 尺寸单位选中
    sizeSelect(row) {
      this.dimensionalValue.fvolumeUnitId = row.fvolumeUnitId
      this.dimensionalValue.fvolumeunitName = row.fname
      this.openSizeDialog = false
    },
    // 获取组织
    async getOrganization() {
      const { data: RES } = await queryTOrgOrganizationsL()
      return RES.map(item => {
        this.useOrganization = item.fname
        return { label: item.fname, value: item.fpkId }
      })
    },
    // 获取物料类型
    async getMaterielType() {
      const { data: RES } = await queryMaterialAttributes()
      return RES.map(item => {
        return { label: item.fcapTion, value: item.ferpclsId }
      })
    },
    // 基本单位选中
    handleCompany(num) {
      this.company = this.basicUnit.find(item => {
        return item.value === num
      })
    },
    // 刷新页面
    refresh() {
      location.reload()
    },
    // 获取其它
    async handleOther() {
      const DATA = { ...this.otherPagination, fmaterialId: this.$route.query.fmaterialId }
      const RES = await queryMaterialLog(DATA)
      this.otherData = RES.data.array
      this.otherOptions = {
        fcreator: {
          label: '创建人',
          span: 8,
          disabled: 'disabled'
        },
        fdevel: {
          label: '研发审核人',
          span: 8,
          disabled: 'disabled'
        },
        fieid: {
          label: 'IE审核人',
          span: 8,
          disabled: 'disabled'
        },
        fcreateDate: {
          label: '创建时间',
          span: 8,
          disabled: 'disabled'
        }
      }
      this.otherPagination.total = RES.data.total
      this.otherUrlObject = RES.data.operator
    },
    // 获取表单
    async handleForm() {
      const { data: RES } = await queryMaterialDetail({ fnumber: this.$route.query.fnumber })
      if (RES == null) {
        this.$message.warning({ message: '物料编码已更改，请重新点击进入！', duration: 5 * 1000 })
        // 关闭当前tag页签
        this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
        this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
        return
      }
      this.fispurchase = RES.fispurchase
      this.fissale = RES.fissale
      this.fisinventory = RES.fisinventory
      this.fisproduce = RES.fisproduce
      this.fissubcontract = RES.fissubcontract
      this.fisasset = RES.fisasset
      this.imageUrl = RES.fimg
      this.company.label = RES.fbaseUnit
      this.information = {
        fstockName: RES.fstockName,
        fdefaultvendor: RES.fdefaultvendor,
        fsupplierId: RES.fdefaultvendorId,
        fmaxStock: RES.fmaxStock,
        fminStock: RES.fminStock,
        fbillTypeId: RES.fpobillTypeId,
        fpobillTypeName: RES.fpobillTypeName,
        fquotaType: RES.fquotaType,
        fsafeStock: RES.fsafeStock,
        fstockId: RES.fstockId,
        position: RES.fstockplaceId
      }
      const organizationRes = await this.getOrganization()
      this.basicUnit = await this.getBasicUnit()
      this.materielProperty = RES.attribute
      const materielType = await this.getMaterielType()
      this.organizationValue = {
        fcreateOrg: 1,
        fuseOrg: this.useOrganization
      }
      this.organization = {
        fcreateOrg: {
          label: '创建组织',
          type: 'select',
          span: 12,
          selectItems: organizationRes,
          rules: [
            { required: true }
          ]
        },
        fuseOrg: {
          label: '使用组织',
          span: 12,
          disabled: 'disabled',
          rules: [
            { required: true }
          ]
        }
      }
      this.oneMaterialValue = {
        largeName: RES.largeName,
        largeCode: RES.largeCode
      }
      this.oneMaterial = {
        largeCode: {
          label: '一类物料',
          type: 'slot',
          rules: [
            { required: true, message: '请选择一类物料', trigger: 'change' }
          ]
        }
      }
      this.toMaterialValue = {
        mediumCode: RES.mediumCode
      }
      this.toMaterial = {
        mediumCode: {
          label: '二类物料',
          type: 'slot',
          rules: [
            { required: true, message: '请选择二类物料', trigger: 'change' }
          ]
        }
      }
      this.basicValue = RES
      this.basic = {
        fmodel: {
          label: '型号',
          span: 8,
          rules: [
            { required: true, message: '型号不能为空', trigger: 'blur' }
          ]
        },
        fnumber: {
          label: '物料编码',
          span: 8,
          disabled: 'disabled'
        },
        foldnumber: {
          label: '旧物料编码',
          span: 8,
          rules: [
            { required: true, message: '旧物料编码不能为空', trigger: 'blur' }
          ]
        },
        fbarCode: {
          label: '条码',
          span: 8,
          rules: [
            { required: true, message: '条码不能为空', trigger: 'blur' }
          ]
        },
        fbaseUnitId: {
          label: '基本单位',
          type: 'slot',
          span: 8,
          rules: [
            { required: true, message: '请选择基本单位', trigger: 'change' }
          ]
        },
        fprotect: {
          label: '环保等级',
          span: 8,
          rules: [
            { required: true, message: '请输入环保等级', trigger: 'blur' }
          ]
        },
        ferpclsId: {
          label: '物料类型',
          span: 8,
          type: 'select',
          selectItems: materielType,
          rules: [
            { required: true, message: '请选择物料类型', trigger: 'blur' }
          ]
        },
        fremarks: {
          label: '物料备注',
          span: 16
        },
        fdescripTion: {
          label: '物料描述',
          disabled: 'disabled',
          isActive: 'isActive',
          type: 'textarea',
          rules: [
            { required: true, message: '请输入物料描述', trigger: 'blur' }
          ]
        }
      }
      this.weightValue = {
        fweightUnitName: RES.fweightUnitName,
        fweightUnitId: RES.fweightUnitId,
        fgrossWeight: RES.fgrossWeight,
        fnetWeight: RES.fnetWeight
      }
      this.weight = {
        fweightUnitName: {
          label: '重量单位',
          type: 'slot',
          rules: [
            { required: true, message: '请选择重量单位', trigger: 'blur' }
          ]
        },
        fgrossWeight: {
          label: '毛重',
          type: 'number'
        },
        fnetWeight: {
          label: '净重',
          type: 'number'
        }
      }
      this.dimensionalValue = {
        fvolumeunitName: RES.fvolumeunitName,
        fvolumeUnitId: RES.fvolumeUnitId,
        fopenLength: RES.fopenLength,
        fvolume: RES.fvolume,
        fthickness: RES.fthickness,
        flength: RES.flength,
        fwidth: RES.fwidth,
        fheight: RES.fheight
      }
      this.dimensional = {
        fvolumeunitName: {
          label: '尺寸单位',
          type: 'slot',
          span: 24,
          rules: [
            { required: true, message: '请选择尺寸单位', trigger: 'blur' }
          ]
        },
        fopenLength: {
          label: '展开长',
          span: 8,
          type: 'number'
        },
        fvolume: {
          label: '直径',
          type: 'number',
          span: 8
        },
        fthickness: {
          label: '厚度',
          span: 8,
          type: 'number'
        },
        flength: {
          label: '长',
          span: 8,
          type: 'number'
        },
        fwidth: {
          label: '宽',
          span: 8,
          type: 'number'
        },
        fheight: {
          label: '高',
          span: 8,
          type: 'number'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content{
  @include createMateriel;
}
.upload {
  @include upLoad;
}
</style>
