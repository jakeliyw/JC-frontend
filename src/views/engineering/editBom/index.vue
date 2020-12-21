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
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleOther">
      <el-tab-pane label="主产品" name="product">
        <jc-form ref="createBomForm" :option-value="prodValue" :options="prodOptions" label-width="100px">
          <el-input
            v-model="prodValue.FNUMBER"
            :disabled="disabled"
            size="mini"
            placeholder="请选择编号"
            class="input-width"
          >
            <i class="iconfont icon-jin-rud-ao-bo" slot="prefix" @click="jumpMateriel"/>
          </el-input>
        </jc-form>
        <jc-table
          :table-data="sonTableData"
          :cell-style="cellStyle"
          serial
          :table-header="sonTableHeader"
          table-height="calc(100vh - 580px)"
        >
          <el-table-column v-if="false" label="子物料ID" prop="FMATERIALID" align="center"/>
          <el-table-column label="物料编码" prop="FNUMBER" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.FNUMBER" placeholder="请选择物料编码" size="mini">
                <i class="iconfont icon-jin-rud-ao-bo" slot="prefix" @click="sonJumpMateriel(scope.row.FNUMBER)"/>
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleGetMaterialSon(scope.row, scope.$index)"/>
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
              <el-select v-model="scope.row.FISSUETYPE" placeholder="请选择" @input="(value) => fun2(scope.$index, value)" size="mini">
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
              <el-input-number v-model="scope.row.FDOSAGE" :precision="2" :step="0.1" :min="1" size="mini"/>
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
              <el-select :value="scope.row.FMATERIALTYPE" placeholder="请选择" @input="(value) => fun(scope.$index, value)" size="mini">
                <el-option
                  v-for="item in materialTypes"
                  :key="item.FVALUE"
                  :label="item.FMATERIALTYPE"
                  :value="item.FVALUE"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="date" width="200px" align="center">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.FCREATEDATE"
                type="date"
                style="width: 150px"
                size="mini"
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
          :otherUrlObject="otherUrlObject"
          :otherLogTableData="otherLogTableData"
        />
        <jc-pagination
          v-show="total > 0"
          :total="total"
          :page.sync="currentPage"
          :limit.sync="size"
          @pagination="handleOther"
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
        <div class="bom-form">
          <span class="materiel-code">物料编码</span>
          <el-input class="input-width" size="mini" placeholder="请输入物料编码" v-model="FNUMBER" @keyup.enter.native="handleSearchSonTable"/>
          <span class="materiel-code">物料描述</span>
          <el-input class="input-width" size="mini" placeholder="请输入物料描述" v-model="FDESCRIPTION" @keyup.enter.native="handleSearchSonTable"/>
          <span class="materiel-code">物料规格</span>
          <el-input class="input-width" size="mini" placeholder="请输入规格" v-model="FSPECIFICATION" @keyup.enter.native="handleSearchSonTable"/>
          <el-button
            type="primary"
            size="mini"
            class="search-dialog"
            @click="handleSearchSonTable"
          >搜索</el-button>
        </div>
      </div>
      <!--      表格区域-->
      <jc-table
        :table-data="sonDialogTableData"
        :table-header="sonDialogHeaderTable"
        :cell-style="cellStyle"
        @clickRow="sonSelectRow"
      >
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" @click="sonSelectRow(clo.scope.row)">子项选择</el-button>
        </template>
      </jc-table>
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
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
import getForm from '../createBom/components/getForm'
import {
  queryFmaterialtype,
  queryFissuetype,
  queryBomSonList,
  queryMaterialSon,
  queryTOrgOrganizationsL
} from '@/api/engineering/createBom'
import { queryBomchildList, upDateBom, queryBomLog } from '@/api/engineering/editBom'
import { queryFtypeInfo } from '@/api/engineering/deitalBom'
import { Disable, toMxAmina } from '@/components/ToMxamineState'

export default {
  name: 'EditBom',
  components: {
    jcTable,
    jcPagination,
    jcForm,
    jcOther
  },
  mixins: [jumpMateriel, getForm],
  data() {
    return {
      total: 1, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      parentTableVisible: false, // 父项弹窗
      cellStyle: { padding: '10 10' }, // 行高
      disabled: true, // 按钮禁用
      FNUMBER: '', // 弹窗编码
      flg: false, // true(警告提示后提交)/false(第一次提交)
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      activeName: 'product', // 默认主产品 product Other
      // 子项弹窗表格数据
      sonDialogTableData: [],
      // 子项弹窗表格表头
      sonDialogHeaderTable: [
        { label: '使用组织', prop: 'FUSEORG' },
        { label: '编码', prop: 'FNUMBER' },
        { label: '物料规格', prop: 'FSPECIFICATION' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', minWidth: '150px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      // 子表数据
      sonTableData: [
        {
          FID: 0,
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
      // 子项表头
      sonTableHeader: [
        { label: '操作', type: 'btn', fixed: 'right', width: '250px', align: 'center' }
      ],
      prodValue: {}, // 产品表单值
      prodOptions: {}, // 产品表单元素
      // 子项类型
      materialTypes: [],
      // 发料方式
      issueMaterialsOptions: [],
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      teamList: [],
      team: 1, // 组织选中
      company: '', // 公司名
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
    this.getQueryBomchildList()
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
    // 搜索
    handleSearchSonTable() {
      this.pageNum = 1
      this.btnSearch()
    },
    // 清空弹窗数据
    closeFun() {
      this.currentPage = 1
      this.FNUMBER = ''
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
    // 获取页面数据
    async getQueryBomchildList() {
      const FNUMBER = this.$route.params.FNUMBER
      const { data: RES } = await queryBomchildList({ fnumber: FNUMBER })
      this.FMATERIALID = RES.FMATERIALID
      this.prodValue = RES
      this.sonTableData = RES.child
      // 其它
      this.otherValue = {
        createPeople: RES.FCREATOR,
        createDate: RES.FCREATEDATE,
        config: RES.FDEVEL,
        configExamine: RES.FDEVELDATE,
        IE: RES.FIE,
        ieExamine: RES.FIEDATE,
        finance: RES.FFINANCE,
        financeExamine: RES.FFINANCEDATE,
        information: RES.FINFO,
        informationExamine: RES.FINFODATE
      }
    },
    // 隐藏显示日志, 获取表单数据
    async handleOther() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, FID: this.FID }
      const RES = await queryBomLog(DATA)
      this.otherUrlObject = RES.operator
      this.otherLogTableData = RES.log
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
    async btnSearch() {
      const DATA = {
        pageNum: this.currentPage,
        pageSize: this.size,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION
      }
      const { data: RES, total } = await queryBomSonList(DATA)
      this.sonDialogTableData = RES
      this.total = total
    },
    // 子bom弹窗
    async handleGetMaterialSon(row, index) {
      this.tableIndex = index
      if (index === this.sonTableData.length - 1) {
        this.sonTableData.push(
          {
            FSEQ: this.serial++,
            FNUMBER: null,
            FDESCRIPTION: null,
            FSPECIFICATION: null,
            FMATERIALTYPE: '1', // 选中值
            FDOSAGETYPE: '1', // 选中值
            FISSUETYPE: '1', // 选中值
            FPRICE: 1,
            FDOSAGE: 1,
            money: 0
          }
        )
      }
      const DATA = { pageNum: this.currentPage, pageSize: this.size, FNUMBER: this.FNUMBER }
      const { data: RES, total } = await queryBomSonList(DATA)
      this.sonDialogTableData = RES.map(item => {
        return (toMxAmina(item), Disable(item))
      })
      this.total = total
      this.parentTableVisible = true
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
      const fTreeEntity = this.sonTableData.map(item => {
        const { FMATERIALID, FMATERIALTYPE, FDOSAGE, FISSUETYPE, FPRICE } = item
        item.FCREATEDATE = this.$moment(item.FCREATEDATE).format('YYYY-MM-DD HH:mm:ss')
        return { FMATERIALID, FMATERIALTYPE, FDOSAGE, FISSUETYPE, FPRICE }
      })
      const DATA = {
        flg: this.flg,
        FMATERIALID: this.FMATERIALID,
        FLABORCOST: this.prodValue.FLABORCOST,
        fTreeEntity
      }
      for (const key of DATA.fTreeEntity) {
        for (const obj in key) {
          if (key[obj] === undefined || key[obj] === '') {
            this.$message.error('编号不能为空,请选择再提交')
            return
          }
        }
      }
      const { message, code } = await upDateBom(DATA)
      if (code === 0) {
        this.$message.success(message)
      } else if (code === 2) {
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          DATA.flg = true
          const { message, code } = await upDateBom(DATA)
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
        const materielCode = this.$route.params.FNUMBER
        if (materielCode === FNUMBER) {
          this.$message.error('没有查询到下层bom')
          return
        }
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
