<template>
  <div class="content codeTable">
    <div class="header">
      <div class="header-name">
        <span class="parentItemN1">大类名称</span>
        <el-select
          v-model="LargeCode"
          class="span-title"
        >
          <el-option
            v-for="item of oneMaterielData"
            :key="item.largeName"
            :label="item.largeName"
            :value="item.largeCode"
          />
        </el-select>
      </div>
    </div>
    <div class="codeRule">
      <div style="font-weight: 600;margin-top: 16px">1.编码:(10位) 2 + 2 + 2 + 4</div>
      <hr class="hrBag">
      <ul class="rule">
        <li>
          <div>□□</div>
          <div>2位数字</div>
          <div>大类</div>
        </li>
        <li class="jia">+</li>
        <li>
          <div>□□</div>
          <div>2位数字</div>
          <div>中类</div>
        </li>
        <li class="jia">+</li>
        <li>
          <div>□□</div>
          <div>2位数字</div>
          <div>小类</div>
        </li>
        <li class="jia">+</li>
        <li>
          <div>□□</div>
          <div>4位数字</div>
          <div>流水号</div>
        </li>
      </ul>
      <hr class="hrBag">
      <div style="font-weight: 600;margin-bottom: 8px;">2.编码规则说明：</div>
    </div>
    <div class="table-content">
      <el-table
        :data="tableData"
        row-key="largeName"
        :cell-style="cellStyle"
        class="tableCode"
      >
        <el-table-column prop="largeName" label="大类" align="center" class-name="valignTop">
          <template slot-scope="scope">
            <div class="overHei">{{ scope.row.largeName }}</div>
            <div class="overHei">{{ scope.row.largeName }}</div>
            <div style="padding: 10px">{{ scope.row.largeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="largeCode" label="编码" align="center" class-name="valignTop">
          <template slot-scope="scope">
            <div class="overHei">{{ scope.row.largeCode }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="medium" label="中类" align="center" class-name="valignTop">
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.medium" :key="index" class="overHei">{{ item.mediumName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="medium" label="编码" align="center" class-name="valignTop">
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.medium" :key="index" class="overHei">{{ item.mediumCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="小类" align="center">
          <el-table-column v-for="(item, index) of typeArray" :key="index" prop="serialName" :label="item.serialName" align="center">
            <el-table-column prop="serialName" label="名称" align="center" class-name="valignTop">
              <template>
                <div v-for="(item, index) of item.serialTypeList" :key="index" class="overHei">{{ item.name }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="serialName" label="编码" align="center" class-name="valignTop">
              <template>
                <div v-for="(item, index) of item.serialTypeList" :key="index" class="overHei">{{ item.number }}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="物料属性" align="center">
          <el-table-column v-for="(item, index) in attributeArray" :key="index" prop="serialName" :label="item.attributeName" align="center" class-name="valignTop">
            <template>
              <div v-for="(item, index) of item.attributeList" :key="index" class="overHei">{{ item.name }}</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryLargeContrast, queryLargeList } from '@/api/encodingRules/codeComparative'
export default {
  name: 'Index',
  data() {
    return {
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
    LargeCode() {
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
      this.tableData = []
      this.maxnum = []
      this.typeArr = []
      this.attr = []
      // 赋值
      this.tableData.push(RES)
      this.typeArray = RES.typeArray
      this.attributeArray = RES.attributeArray
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
      // this.attributeArray.attributeList.length = maxLength
    },
    // 查询大类列表
    async queryLargeList() {
      const { data: RES } = await queryLargeList()
      this.oneMaterielData = RES
      this.LargeCode = RES[0].largeCode
    }
  }
}
</script>
<style lang="scss">
.codeTable {
  .table-content{
    .el-table .valignTop {
      vertical-align: top;
      padding: 0;
    }
    .el-table .is-leaf{
      vertical-align: middle;
    }
    .el-table .cell{
      padding: 0;
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
  .table-content{
    margin-top: 0;
  }
  .btn1{
    margin-left: 20px;
  }
  .overHei{
    border-bottom: 1px solid #EBEEF5;
    max-height: 25px;
    margin-top: 10px;
    padding: 0 10px;
    padding-bottom: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .overHei:nth-last-child(1){
    border-bottom: none;
  }
  .codeRule{
    border: 1px solid #a5a7a9;
    border-bottom: none;
    .hrBag {
      background-color: #EBEEF5;
      height:1px; border:none;
    }
    .rule{
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 8px 0;
      li{
        padding: 0 10px;
        width: 80px;
        text-align: center;
      }
      .jia{
        text-align: center;
        width: 20px;
      }
    }
  }
}
</style>
