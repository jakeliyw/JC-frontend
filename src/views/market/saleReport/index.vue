<template>
  <div class="content">
    <jc-title />
    <el-tabs type="border-card">
      <el-tab-pane label="基准价报表">
        <el-form :model="standard" label-width="100px" size="mini">
          <el-form-item label="新/旧物料编码">
            <el-input v-model.trim="standard.itemcode" />
          </el-form-item>
          <el-form-item label="型号" label-width="60px">
            <el-input v-model.trim="standard.itemxh" />
          </el-form-item>
          <el-form-item label-width="20px">
            <el-button size="mini" type="primary" @click="standardListSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <jc-table
          :table-data="tableData"
          :table-header="tableHeader"
          table-height="calc(100vh - 350px)"
          :cell-style="cellStyle"
        >
          <el-table-column v-if="false" label="价目编码" prop="pricenum" align="center" />
          <el-table-column label="物料编号" prop="itemcode" align="center" min-width="100" />
          <el-table-column label="旧物料编号" prop="olditemcode" align="center" min-width="90" />
          <el-table-column label="型号" prop="itemxh" align="center" min-width="80" />
          <el-table-column label="物料描述" prop="itemname" align="center" min-width="600" />
          <el-table-column label="销售基准价(x:餐台数量, y:餐椅数量)" min-width="190px" align="center">
            <el-table-column label="x<20" align="center">
              <el-table-column label="y<80" align="center" min-width="110px" prop="price1" />
            </el-table-column>
            <el-table-column label="20<=x<100" align="center">
              <el-table-column label="80<=y<400" align="center" min-width="110px" prop="price2" />
            </el-table-column>
            <el-table-column label="100<=x<500" align="center">
              <el-table-column label="400<=y<2000" align="center" min-width="110px" prop="price3" />
            </el-table-column>
            <el-table-column label="500<=x<1000" align="center">
              <el-table-column label="2000<=y<4000" align="center" min-width="110px" prop="price4" />
            </el-table-column>
            <el-table-column label="x>=1000" align="center">
              <el-table-column label="y>=4000" align="center" min-width="110px" prop="price5" />
            </el-table-column>
          </el-table-column>
          <el-table-column label="含税销售基准价(13%)" min-width="180px" align="center">
            <el-table-column label="x<20" align="center">
              <el-table-column label="y<80" align="center" min-width="110px" prop="taxprice1" />
            </el-table-column>
            <el-table-column label="20<=x<100" align="center">
              <el-table-column label="80<=y<400" align="center" min-width="110px" prop="taxprice2" />
            </el-table-column>
            <el-table-column label="100<=x<500" align="center">
              <el-table-column label="400<=y<2000" align="center" min-width="110px" prop="taxprice3" />
            </el-table-column>
            <el-table-column label="500<=x<1000" align="center">
              <el-table-column label="2000<=y<4000" align="center" min-width="110px" prop="taxprice4" />
            </el-table-column>
            <el-table-column label="x>=1000" align="center">
              <el-table-column label="y>=4000" align="center" min-width="110px" prop="taxprice5" />
            </el-table-column>
          </el-table-column>
          <el-table-column label="生效日期" prop="docdate" align="center" min-width="100" />
        </jc-table>
        <jc-pagination
          :total="total"
          :page.sync="pageNum"
          :limit.sync="size"
          @pagination="standardList"
        />
      </el-tab-pane>
      <el-tab-pane label="利润报表">
        <div class="header">
          <div class="header-name">
            <span class="parentItemNo">部门</span>
            <el-select v-model="value" placeholder="请输入部门" size="small" class="input-content">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span class="parentItemNo">交货日期</span>
            <el-date-picker
              v-model="dateValue"
              size="small"
              type="daterange"
              class="input-content"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button type="primary" class="btn" size="small" @click="browse">浏览</el-button>
          </div>
        </div>
        <div class="iframe-content">
          <iframe
            :src="url"
            height="1000"
            scrolling="auto"
            width="1500"
            frameborder="1"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcTitle from '@/components/Title/index'
import jcTable from '@/components/Table/index'
import jcPagination from '@/components/Pagination/index'
import { getPriceList } from '@/api/marketManage/saleReport'
export default {
  name: 'Index',
  components: {
    jcTitle,
    jcTable,
    jcPagination
  },
  data() {
    return {
      url: '',
      dateValue: '',
      value: '',
      options: [
        { label: '内销', value: 'NX' },
        { label: '外销', value: 'WX' }
      ],
      standard: {
        itemcode: '',
        itemxh: '',
        kh: ''
      },
      tableData: [],
      tableHeader: [],
      total: 0,
      pageNum: 1,
      size: 50,
      cellStyle: { padding: '10 10' }
    }
  },
  created() {
    this.standardList()
  },
  methods: {
    browse() {
      const START = this.dateValue[0]
      const END = this.dateValue[1]
      this.url = `http://202.105.191.50:8878/Reprot.aspx?Name=SalPriceInfo&dockey=${this.value}&sd=${START}&ed=${END}`
    },
    // 基准价报表数据
    async standardList() {
      const DATA = {
        ...this.standard,
        pageNum: this.pageNum,
        pageSize: this.size
      }
      const { data: RES } = await getPriceList(DATA)
      if (RES.result) {
        this.tableData = RES.data
        this.total = RES.data[0].count
      } else {
        this.$message.error(RES.messger)
      }
    },
    standardListSearch() {
      this.pageNum = 1
      this.standardList()
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
  .el-table{
    &::v-deep thead.is-group th{
      padding: 5px 0;
    }
  }
}

.iframe-content{
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.el-form{
  display: flex;
}
</style>
