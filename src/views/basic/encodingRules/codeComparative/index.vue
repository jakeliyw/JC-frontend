<template>
  <div class="content codeTable">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="(item, index) of oneMaterielData" :key="index" :label="item.largeName" :name="item.largeCode">
        <div class="codeRule">
          <div style="font-weight: 600;padding: 5px;">1.编码:(10位) 2 + 2 + 2 + 4
            ( 2位大类数字 + 2位中类数字 + 2位小类数字 + 4位流水号数字 )
          </div>
          <hr class="hrBag">
          <div style="font-weight: 600;padding: 5px;">2.编码规则说明：</div>
        </div>
        <div class="table-content">
          <el-table
            :data="tableData"
            :cell-style="cellStyle"
            height="550"
            loading
          >
            <el-table-column prop="largeName" label="大类" align="center" class-name="valignTop">
              <template slot-scope="scope">
                <div style="padding: 10px;">{{ scope.row.largeName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="largeCode" label="编码" align="center" class-name="valignTop">
              <template slot-scope="scope">
                <div style="padding: 10px;">{{ scope.row.largeCode }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="medium" label="中类" align="center" class-name="valignTop">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.medium" :key="index" class="overHei" :title="item.mediumName">{{ item.mediumName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="medium" label="编码" align="center" class-name="valignTop">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.medium" :key="index" class="overHei">{{ item.mediumCode }}</div>
              </template>
            </el-table-column>
            <el-table-column label="小类" align="center">
              <el-table-column v-for="(item, index) in typeArray" :key="index" prop="serialName" :label="item.serialName" align="center">
                <el-table-column prop="serialName" label="名称" align="center" class-name="valignTop">
                  <template>
                    <div v-for="(item, index) in item.serialTypeList" :key="index" class="overHei" :title="item.name">{{ item.name }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="serialName" label="编码" align="center" class-name="valignTop">
                  <template>
                    <div v-for="(item, index) in item.serialTypeList" :key="index" class="overHei">{{ item.number }}</div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="物料属性" align="center">
              <el-table-column v-for="(item, index) in attributeArray" :key="index" prop="serialName" :label="item.attributeName" align="center" class-name="valignTop">
                <template>
                  <div v-for="(item, index) in item.attributeList" :key="index" :title="item.name" class="overHei">{{ item.name }}</div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryLargeContrast, queryLargeList } from '@/api/encodingRules/codeComparative'
import jcTitle from '@/components/Title'
export default {
  name: 'CodeComparative',
  components: {
    jcTitle
  },
  data() {
    return {
      activeName: '50', // 第一个选项卡
      attributeArray: [], // 物料属性
      typeArray: [], // 小类
      LargeCode: '', // 选择的大类名称
      oneMaterielData: [], // 搜索-下拉框数据-大类名称
      tableData: [], // 列表数据
      cellStyle: { padding: '10 10' }, // 行高
      maxnum: [], // 最大长度
      typeArr: [], // 小类名称个数
      attr: [] // 物料属性名称个数
    }
  },
  watch: {
    // 监听切换选项卡
    activeName(val) {
      this.tableData = []
      this.attributeArray = [] // 物料属性
      this.typeArray = []
      this.LargeCode = val
      this.getRoleList()
    }
  },
  mounted() {
    this.queryLargeList()
  },
  methods: {
    // 查询编码对照表数据
    async getRoleList() {
      const DATA = { largeCode: this.LargeCode }
      const { data: RES } = await queryLargeContrast(DATA)
      // 清空数据
      this.maxnum = []
      this.typeArr = []
      this.attr = []
      // 赋值
      this.tableData.push(RES)
      this.typeArray = RES.typeArray
      this.attributeArray = RES.attributeArray
      // 为长度不够的数组赋空值(长度以最长的数组长度为准)
      const medLength = this.tableData[0].medium.length
      this.maxnum.push(medLength) // 中类长度
      for (const item of this.typeArray) {
        this.typeArr.push(item.serialTypeList.length)
        this.maxnum.push(item.serialTypeList.length) // 小类长度
      }
      for (const item of this.attributeArray) {
        this.attr.push(item.attributeList.length)
        this.maxnum.push(item.attributeList.length) // 属性长度
      }
      // 大类中最长的数组
      const maxLength = Math.max(...this.maxnum)
      // 中类填充
      this.tableData[0].medium.length = maxLength
      this.tableData[0].medium.fill({ mediumCode: '', mediumName: '' }, medLength, maxLength)
      // 小类填充
      for (const item of this.typeArray) {
        item.serialTypeList.length = maxLength
      }
      for (const item in this.typeArr) {
        this.typeArray[item].serialTypeList.fill({ name: '', number: '' }, this.typeArr[item], maxLength)
      }
      // 属性填充
      for (const item of this.attributeArray) {
        item.attributeList.length = maxLength
      }
      for (const item in this.attr) {
        this.attributeArray[item].attributeList.fill({ name: '' }, this.attr[item], maxLength)
      }
    },
    // 查询大类列表
    async queryLargeList() {
      const { data: RES } = await queryLargeList()
      for (const item of RES) {
        if (item.largeName.indexOf('成品-') !== -1) {
          this.oneMaterielData.push(item)
          this.LargeCode = this.oneMaterielData[0].largeCode
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('成品部件') !== -1) {
          this.oneMaterielData.push(item)
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('半成品') !== -1) {
          this.oneMaterielData.push(item)
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('主材') !== -1 || item.largeName.indexOf('五金') !== -1 || item.largeName.indexOf('功能') !== -1) {
          this.oneMaterielData.push(item)
        }
      }
      for (const item of RES) {
        if (item.largeName.indexOf('主材') === -1 && item.largeName.indexOf('五金') === -1 && item.largeName.indexOf('功能') === -1 && item.largeName.indexOf('半成品') === -1 && item.largeName.indexOf('成品部件') === -1 && item.largeName.indexOf('成品-') === -1) {
          this.oneMaterielData.push(item)
        }
      }
      this.getRoleList()
    }
  }
}
</script>
<style lang="scss">
.codeTable {
  .el-tabs__nav{
    white-space: initial
  }
  .table-content{
      .el-table .valignTop {
        vertical-align: top;
        padding: 0;
        border-color: #888;
      }
    .el-table--border td{
      border-right: 1px solid #888;
    }
    .el-table--border th{
      border-bottom: 1px solid #888;
      border-right: 1px solid #888;
    }
    .el-table thead.is-group th{
      background: #e6ebfc;
      font-size: 14px;
    }
    .el-table th, .el-table tr{
      font-size: 13px;
    }
    .el-table .cell{
      padding: 0;
    }
    .el-table td, .el-table th{
      padding: 0;
    }
    @media screen and (max-width: 1360px){
      .el-table thead.is-group th{
        font-size: 13px;
      }
      .el-table th, .el-table tr{
        font-size: 12px;
      }
    }
    .el-table .is-leaf{
      vertical-align: middle;
    }
  }
}
</style>
<style scoped lang="scss">
.content {
  @include listBom;
  .parentItemN1{
    margin-right: 10px;
  }
  .el-tabs ::v-deep .el-tabs__item{
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
  }
  .table-content{
    margin-top: 0;
    border:1px solid #888;
  }
  .btn1{
    margin-left: 20px;
  }
  .overHei{
    border-bottom: 1px solid #888;
    max-height: 25px;
    padding: 5px;
    padding-bottom: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }
  .overHei:nth-last-child(1){
    border-bottom: none;
  }
  .overHei:nth-child(even){
    background: #ececec;
  }
  .codeRule{
    font-size: 14px;
    border: 1px solid #888;
    border-bottom: none;
    .hrBag {
      background-color: #888;
      height:1px; border:none;
      margin: 0;
    }
  }
}
</style>
