<template>
  <div class="content codeTable">
    <div class="header">
      <div class="header-name">
        <span class="parentItemN1">大类名称</span>
        <el-select
          class="span-title"
          v-model="LargeCode"
        >
          <el-option
            v-for="item of oneMaterielData"
            :key="item.largeName"
            :label="item.largeName"
            :value="item.largeCode"
          />
        </el-select>
        <el-button type="primary" class="btn1" size="medium" @click="handleQuerySonClass">搜索</el-button>
      </div>
    </div>
    <div class="codeRule">
      <div style="font-weight: 600;margin-top: 16px">1.编码:(10位) 2 + 2 + 2 + 4</div>
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
      <div style="font-weight: 600;">2.编码规则说明：</div>
    </div>
    <div class="table-content">
      <el-table
        :data="tableData"
        row-key="largeName"
        :cell-style="cellStyle"
        class="tableCode"
      >
        <el-table-column prop="largeName" label="大类" align="center" className="valignTop">
          <template slot-scope="scope">
            <div class="overHei">{{scope.row.largeName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="largeCode" label="编码" align="center" className="valignTop">
          <template slot-scope="scope">
            <div class="overHei">{{scope.row.largeCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="medium" label="中类" align="center" className="valignTop">
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.medium" :key="index" class="overHei">{{item.mediumName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="medium" label="编码" align="center" className="valignTop">
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.medium" :key="index" class="overHei">{{item.mediumCode}}</div>
          </template>
        </el-table-column>
        <el-table-column  label="小类" align="center">
          <el-table-column  v-for="(item, index) of typeArray" :key="index" prop="serialName" :label="item.serialName" align="center">
            <el-table-column  prop="serialName" label="名称" align="center" className="valignTop">
              <template>
                <!--                <p v-for="(item, index) of scope.row.typeArray" :key="index">-->
                <div v-for="(item, index) of item.serialTypeList" :key="index" class="overHei">{{item.name}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="serialName" label="编码" align="center" className="valignTop">
              <template>
                <!--                <p v-for="(item, index) of scope.row.typeArray" :key="index">-->
                <div v-for="(item, index) of item.serialTypeList" :key="index" class="overHei">{{item.number}}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="物料属性" align="center">
          <el-table-column v-for="(item, index) in attributeArray" :key="index" prop="serialName" :label="item.attributeName" align="center" className="valignTop">
            <template>
              <!--              <p v-for="(item, index) of scope.row.attributeArray" :key="index">-->
              <div v-for="(item, index) of item.attributeList" :key="index" class="overHei">{{item.name}}</div>
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
      // maxnum: [] // 最大长度
    }
  },
  mounted() {
    this.queryLargeList()
  },
  watch: {
    LargeCode() {
      this.getRoleList()
    }
  },
  methods: {
    // 查询编码对照表数据
    async getRoleList() {
      const DATA = { largeCode: this.LargeCode }
      const { data: RES } = await queryLargeContrast(DATA)
      this.tableData = []
      this.maxnum = []
      this.tableData.push(RES)
      this.typeArray = RES.typeArray
      this.attributeArray = RES.attributeArray

      // this.maxnum.push(this.tableData[0].medium.length) // 中类长度
      // for (const item of this.typeArray) {
      //   this.maxnum.push(item.serialTypeList.length) // 小类长度
      // }
      // for (const item of this.attributeArray) {
      //   this.maxnum.push(item.attributeList.length) // 属性长度
      // }
      // const maxLength = Math.max(...this.maxnum)
      // this.tableData[0].medium.length = maxLength
      // this.typeArray.serialTypeList.length = maxLength
      // this.attributeArray.serialTypeList.length = maxLength
      //
      // console.log(maxLength, this.tableData)
    },
    // 查询大类列表
    async queryLargeList() {
      const { data: RES } = await queryLargeList()
      this.oneMaterielData = RES
      this.LargeCode = RES[0].largeCode
    },
    // 搜索
    handleQuerySonClass() {
      this.tableData = []
      this.getRoleList()
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
    .rule{
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
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
