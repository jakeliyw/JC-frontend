<template>
  <div class="content">
    <el-card class="header-card">
      <div class="tool">
        <el-button size="mini" @click="refresh">刷新</el-button>
        <el-button size="mini" type="primary" @click="preservation">保存bom</el-button>
      </div>
      <div class="organization">
        <span class="text-margin">创建组织</span>
        <el-select v-model="team" placeholder="请选择" size="mini">
          <el-option
            v-for="item in teamList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="input-width"
          />
        </el-select>
        <span class="text-margin">使用组织</span>
        <el-input v-model="company" placeholder="请输入组织" size="mini" class="input-width" disabled/>
        <div class="summation">材料成本:
          <span class="color-text">{{ Summation }}元</span>
        </div>
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="主产品" name="product">
        <jc-form :option-value="prodValue" :options="prodOptions" label-width="100px">
          <el-input
            v-model="prodValue.FNUMBER"
            size="mini"
            placeholder="请选择物料编码"
          >
            <i class="iconfont icon-jin-rud-ao-bo" slot="prefix" @click="jumpMateriel"/>
            <i slot="suffix" class="el-input__icon el-icon-search" @click="getMaterielList"/>
          </el-input>
        </jc-form>
        <jc-table
          v-show="isShow"
          :table-data="sonTableData"
          serial
          :cell-style="cellStyle"
          :table-header="sonTableHeader"
          table-height="calc(100vh - 580px)"
        >
          <el-table-column label="物料编码" prop="FNUMBER" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.FNUMBER" placeholder="请选择物料编码" :disabled="disabled" size="mini">
                <i class="iconfont icon-jin-rud-ao-bo" slot="prefix" @click="sonJumpMateriel(scope.row.FNUMBER)"/>
                <i
                  v-show="iconIsShow"
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMaterialSon(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物料描述"
            prop="FDESCRIPTION"
            align="center"
            width="250px"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="物料规格"
            prop="FSPECIFICATION"
            align="center"
            width="150px"
          />
          <el-table-column label="发料方式" prop="FISSUETYPE" align="center" width="150px">
            <template slot-scope="scope">
              <el-select v-model="scope.row.FISSUETYPE" placeholder="请选择" size="mini" @input="(value) => fun2(scope.$index, value)">
                <el-option
                  v-for="item in issueMaterialsOptions"
                  :key="item.FVALUE"
                  :label="item.FISSUETYPE"
                  :value="item.FVALUE"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="用量" prop="FDOSAGE" align="center" width="200px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.FDOSAGE" :precision="2" :step="1" :min="1" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="FPRICE" align="center" width="200px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.FPRICE" :precision="4" :step="0.1" :min="1" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="money" align="center" width="150px">
            <template slot-scope="scope">
              {{ parseInt((scope.row.FPRICE * scope.row.FDOSAGE) * 100) / 100 }}
            </template>
          </el-table-column>
          <el-table-column label="子项类型" prop="FMATERIALTYPE" align="center" width="150px">
            <template slot-scope="scope">
              <el-select
                :value="scope.row.FMATERIALTYPE"
                placeholder="请选择"
                @input="(value) => fun(scope.$index, value)"
                size="mini">
                <el-option
                  v-for="item in materialTypes"
                  :key="item.FVALUE"
                  :label="item.FMATERIALTYPE"
                  :value="item.FVALUE"
                  size="mini"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="date" width="200px" align="center">
            <template slot-scope="scope">
              <el-date-picker
                size="mini"
                v-model="scope.row.FCREATEDATE"
                type="date"
                style="width: 150px"
                placeholder="选择日期"
              />
            </template>
          </el-table-column>
          <template v-slot:btnSlot="clo">
            <el-button type="primary" size="mini" @click="getIntoBom(clo.scope.row.FNUMBER)">进入bom</el-button>
            <el-button type="danger" size="mini" @click="deleteBom(clo.scope.row, clo.scope.$index)">删除bom</el-button>
          </template>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="其它" name="other">
        <jc-other
          :otherUrlObject="{}"
          :otherLogTableData="[]"
        />
      </el-tab-pane>
    </el-tabs>
    <!--    父项列表弹窗-->
    <el-dialog
      title="物料列表"
      model
      :visible.sync="parentTableVisible"
      :close-on-click-modal="false"
      width="80%"
      @close="closeFun"
    >
      <!--      条件区域-->
      <div class="dialogForm">
        <div class="bom-form" v-if="isTable === 'parentTableData'">
          <span class="materiel-code">物料编码</span>
          <el-input class="input-width" size="mini" placeholder="请输入物料编码" v-model="FNUMBER" @keyup.enter.native="queryParentSearch"/>
          <span class="materiel-code">物料描述</span>
          <el-input class="input-width" size="mini" placeholder="请输入物料描述" v-model="FDESCRIPTION" @keyup.enter.native="queryParentSearch"/>
          <span class="materiel-code">物料规格</span>
          <el-input class="input-width" size="mini" placeholder="请输入规格" v-model="FSPECIFICATION" @keyup.enter.native="queryParentSearch"/>
          <el-button
            type="primary"
            size="mini"
            class="search-dialog"
            @click="queryParentSearch"
          >搜索</el-button>
        </div>
        <div class="bom-form" v-else>
          <span class="materiel-code">物料编码</span>
          <el-input class="input-width" size="mini" placeholder="请输入物料编码" v-model="FNUMBER" @keyup.enter.native="querySonSearch"/>
          <span class="materiel-code">物料描述</span>
          <el-input class="input-width" size="mini" placeholder="请输入物料描述" v-model="FDESCRIPTION" @keyup.enter.native="querySonSearch"/>
          <span class="materiel-code">物料规格</span>
          <el-input class="input-width" size="mini" placeholder="请输入规格" v-model="FSPECIFICATION" @keyup.enter.native="querySonSearch"/>
          <el-button
            type="primary"
            size="mini"
            class="search-dialog"
            @click="querySonSearch"
          >搜索</el-button>
        </div>
      </div>
      <!--      父表格区域-->
      <jc-table
        :cell-style="cellStyle"
        v-if="isTable === 'parentTableData'"
        :table-data="parentTableData"
        table-height="calc(100vh - 404px)"
        :table-header="parentTableHeader"
        @clickRow="parentSelectRow"
      >
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" @click="parentSelectRow(clo.scope.row)">父项选择</el-button>
        </template>
      </jc-table>
      <!--      子表格区域-->
      <jc-table
        :cell-style="cellStyle"
        v-else
        :table-data="sonDialogTableData"
        table-height="calc(100vh - 404px)"
        :table-header="sonDialogHeaderTable"
        @clickRow="sonSelectRow"
      >
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" @click="sonSelectRow(clo.scope.row)">子项选择</el-button>
        </template>
      </jc-table>
      <jc-pagination
        v-if="isTable === 'parentTableData'"
        :total="parentPagination.total"
        :page.sync="parentPagination.currentPage"
        :limit.sync="parentPagination.size"
        @pagination="getMaterielList"
      />
      <jc-pagination
        v-else
        :total="sonPagination.total"
        :page.sync="sonPagination.currentPage"
        :limit.sync="sonPagination.size"
        @pagination="btnSearch"
      />
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcForm from '@/components/Form'
import jcOther from '@/components/Other'
import jumpMateriel from '@/components/JumpMateriel'
import getForm from './components/getForm'
import {
  queryBomFaterList,
  queryMaterialfather,
  queryFmaterialtype,
  queryFissuetype,
  queryBomSonList,
  queryMaterialSon,
  queryTOrgOrganizationsL,
  insertBom
} from '@/api/engineering/createBom'
import { queryFtypeInfo } from '@/api/engineering/deitalBom'
import { toMxAmina, Disable } from '@/components/ToMxamineState'

export default {
  name: 'CreateBom',
  components: {
    jcTable,
    jcPagination,
    jcForm,
    jcOther
  },
  mixins: [jumpMateriel, getForm],
  data() {
    return {
      activeName: 'product', // 默认主产品 product Other
      isShow: true, // 控制日志显示隐藏
      iconIsShow: false, // icon显示隐藏
      cellStyle: { padding: '10 10' }, // 行高
      parentTableVisible: false, // 弹窗
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      disabled: true, // 按钮禁用
      isTable: 'parentTableData',
      flg: false, // true(警告提示后提交)/false(第一次提交)
      // 父分页
      parentPagination: {
        total: 0, // 总条目
        currentPage: 1, // 当前页
        size: 10 // 每页显示多少条数据
      },
      // 子分页
      sonPagination: {
        total: 0, // 总条目
        currentPage: 1, // 当前页
        size: 10 // 每页显示多少条数据
      },
      // 子项弹窗表格数据
      sonDialogTableData: [],
      // 父项数据
      parentTableData: [],
      // 父项表头
      parentTableHeader: [
        // 搜索编码，物料ID隐藏
        { label: '物料编码', prop: 'FNUMBER', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', align: 'center', minWidth: '150px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      // 子项表头
      sonTableHeader: [
        { label: '操作', type: 'btn', fixed: 'right', width: '250px', align: 'center' }
      ],
      // 子项弹窗表格表头
      sonDialogHeaderTable: [
        { label: '使用组织', prop: 'FUSEORG', align: 'center' },
        { label: '物料编码', prop: 'FNUMBER', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', align: 'center', minWidth: '150px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      // 子表数据
      sonTableData: [
        {
          FSEQ: 0,
          FNUMBER: '',
          FMATERIALID: '',
          FDESCRIPTION: '',
          FSPECIFICATION: '',
          FCREATEDATE: '', // 生效时间
          FMATERIALTYPE: '1', // 选中值
          FDOSAGETYPE: '1', // 选中值
          FISSUETYPE: '1', // 选中值
          FPRICE: 1, // 单价
          FDOSAGE: 1, // 用量
          money: 0 // 金额
        }
      ],
      prodValue: {}, // 产品表单值
      prodOptions: {}, // 产品表单元素
      // 子项类型
      materialTypes: [],
      // 发料方式
      issueMaterialsOptions: [],
      // 创建组织
      teamList: [],
      // 组织选中
      team: 1,
      // 使用优化
      company: '',
      // 点击行的序号
      tableIndex: 0,
      serial: 1, // 序列号
      FMATERIALID: 0 // 父项物料ID
    }
  },
  computed: {
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
    this.handleGetSubType()
    this.handleGetMaterials()
    this.createOrganization()
    this.getDataTime()
    this.btnSearch()
  },
  updated() {
    this.getDataTime()
  },
  methods: {
    fun(index, value) {
      const currentLine = this.sonTableData[index]
      this.$set(currentLine, 'FMATERIALTYPE', value)
    },
    fun1(index, value) {
      const type = this.sonTableData[index]
      this.$set(type, 'FDOSAGETYPE', value)
    },
    fun2(index, value) {
      const mode = this.sonTableData[index]
      this.$set(mode, 'FISSUETYPE', value)
    },
    // 清空弹窗数据
    closeFun() {
      this.parentPagination.currentPage = 1
      this.sonPagination.currentPage = 1
      this.FNUMBER = ''
      this.FDESCRIPTION = ''
      this.FSPECIFICATION = ''
    },
    // 父项搜索
    queryParentSearch() {
      this.parentPagination.currentPage = 1
      this.getMaterielList()
    },
    // 子类搜索
    querySonSearch() {
      this.sonPagination.currentPage = 1
      this.btnSearch()
    },
    // 隐藏显示日志
    handleClick() {
      this.isShow = !this.isShow
    },
    // 获取组织数据
    async createOrganization() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.teamList = RES.map(item => {
        item.label = item.FNAME
        item.value = item.FPKID
        this.company = item.label
        return item
      })
    },
    // 获取子项类型数据
    handleGetSubType() {
      queryFmaterialtype().then(res => {
        this.materialTypes = res.data
      })
    },
    // 查询发料方式列表
    async handleGetMaterials() {
      const { data: RES } = await queryFissuetype()
      this.issueMaterialsOptions = RES
    },
    // 打开物料编码弹窗
    async getMaterielList() {
      this.isTable = 'parentTableData'
      const DATA = {
        pageNum: this.parentPagination.currentPage,
        pageSize: this.parentPagination.size,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION
      }
      const { data: RES, total } = await queryBomFaterList(DATA)
      this.parentTableData = RES.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.parentPagination.total = total
      this.parentTableVisible = true
    },
    // 查询子类弹窗编码
    async btnSearch() {
      const DATA = {
        pageNum: this.sonPagination.currentPage,
        pageSize: this.sonPagination.size,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION
      }
      const { data: RES, total } = await queryBomSonList(DATA)
      this.sonDialogTableData = RES
      this.sonPagination.total = total
    },
    // 新增子BOM
    async handleGetMaterialSon(row, index) {
      this.isTable = 'sonDialogTableData'
      if (!this.prodValue.FNUMBER.trim()) {
        this.disabled = true
        return
      }
      this.tableIndex = index
      if (index === this.sonTableData.length - 1) {
        this.sonTableData.push(
          {
            FSEQ: this.serial++, // 序号
            FNUMBER: null, // 物料编码
            FDESCRIPTION: null, // 物料描述
            FSPECIFICATION: null, // 物料规格
            FMATERIALTYPE: '1', // 选中值
            FDOSAGETYPE: '1', // 选中值
            FISSUETYPE: '1', // 选中值
            FPRICE: 1, // 单价
            FDOSAGE: 1, // 单价
            money: 0 // 金额
          }
        )
      }
      const DATA = { pageNum: this.sonPagination.currentPage, pageSize: this.sonPagination.size, FNUMBER: this.FNUMBER }
      const { data: RES, total } = await queryBomSonList(DATA)
      this.sonDialogTableData = RES.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.sonPagination.total = total
      this.parentTableVisible = true
    },
    // 选中父项弹窗表格行
    async parentSelectRow(item) {
      this.FMATERIALID = item.FMATERIALID
      const fmateriAalId = item.FMATERIALID
      const { data: RES } = await queryMaterialfather({ fmateriAalId })
      this.prodValue = RES
      this.disabled = false
      this.iconIsShow = true
      this.parentTableVisible = false
    },
    // 选中子项弹窗表格行
    async sonSelectRow(item) {
      const fmateriAalId = item.FMATERIALID
      const { data: RES } = await queryMaterialSon({ fmateriAalId })
      this.sonTableData[this.tableIndex].FMATERIALID = RES.FMATERIALID
      this.sonTableData[this.tableIndex].FNUMBER = RES.FNUMBER
      this.sonTableData[this.tableIndex].FDESCRIPTION = RES.FDESCRIPTION
      this.sonTableData[this.tableIndex].FSPECIFICATION = RES.FSPECIFICATION
      this.sonTableData[this.tableIndex].FPRICE = RES.FMATERIALCOST
      this.parentTableVisible = false
    },
    // 保存列表数据
    async preservation() {
      const sonTableData = this.sonTableData.map(item => {
        const { FCREATEDATE, FDOSAGETYPE, FISSUETYPE, FMATERIALID, FMATERIALTYPE, FSEQ, FDOSAGE, FPRICE } = item
        item.FCREATEDATE = this.$moment(item.FCREATEDATE).format('YYYY-MM-DD HH:mm:ss')
        return { FCREATEDATE, FDOSAGETYPE, FISSUETYPE, FMATERIALID, FMATERIALTYPE, FSEQ, FDOSAGE, FPRICE }
      })
      const DATA = {
        flg: this.flg,
        FCREATEORGID: this.team,
        FUSEORGID: this.team,
        FLABORCOST: this.prodValue.FLABORCOST,
        FMATERIALID: this.FMATERIALID,
        fTreeEntity: sonTableData
      }
      for (const item of DATA.fTreeEntity) {
        if (item.FMATERIALID === undefined || DATA.FMATERIALID === 0 || item.FDOSAGE === undefined || item.FPRICE ===
          undefined || item.FCREATEDATE === null || item.FCREATEDATE === 'Invalid date') {
          this.$message.error('请删除空行，或为空行填入数据')
          return
        }
      }
      const { code, message } = await insertBom(DATA)
      if (code === 0) {
        this.$message.success(message)
        setTimeout(() => {
          location.reload()
        }, 2000)
      } else if (code === 2) {
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          DATA.flg = true
          const { message, code } = await insertBom(DATA)
          if (code === 0) {
            this.$message.success(message)
          }
        }).catch(() => {
          this.$message.info('已取消保存')
        })
      }
    },
    // 进入bom
    async getIntoBom(FNUMBER) {
      if (!FNUMBER) {
        this.$message.error('物料编码为空,无法进入子bom')
        return
      }
      const { FTYPE, fMaterialId } = await queryFtypeInfo({ fnumber: FNUMBER })
      if (FTYPE === 0) {
        this.$router.push({ path: `/detailBom/${FNUMBER}` })
        this.$message.success('进入bom')
      } else {
        this.$router.push({ path: `/queryMateriel/${fMaterialId}` })
        this.$message.success('进入物料清单')
      }
    },
    // 刷新bom
    refresh() {
      location.reload()
    },
    // 删除bom
    deleteBom(item, index) {
      if (index === 0) {
        this.$message.error('不能删除首行数据')
        return
      }
      this.sonTableData.splice(index, 1)
      this.$message.success('删除行成功')
    },
    // 默认显示当前时间
    getDataTime() {
      this.sonTableData.forEach(item => {
        item.FCREATEDATE = new Date()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include bomCreate;
}
</style>
