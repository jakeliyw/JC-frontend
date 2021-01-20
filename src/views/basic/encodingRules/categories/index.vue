<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">大类名称</span>
        <el-input
          v-model.trim="largeName"
          class="input-content"
          placeholder="请输入大类名称"
          size="mini"
          @keyup.enter.native="handleQuerySonClass"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQuerySonClass">搜索</el-button>
        <el-button type="primary" class="btn" size="mini" @click="newly('1')">新增</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <el-table-column prop="largeCode" label="大类编码" align="center" width="100px" />
        <el-table-column prop="largeName" label="大类名称" min-width="80" align="center" />
        <el-table-column prop="mediumName" label="中类集合" min-width="80" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="inTheClass(scope.row.largeCode)">{{ scope.row.mediumName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="typeArray" label="小类集合" min-width="120px" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(ite,id) in scope.row.typeArray"
              :key="id"
              class="tag-mar"
              @click="smallClass(ite.serialType, scope.row.largeCode)"
            >{{ ite.serialName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="attributeArray" label="属性集合" min-width="120px" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(item,id) in scope.row.attributeArray"
              :key="id"
              class="tag-mar"
              @click="attribute(item.attributeType)"
            >{{ item.attributeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="newly(scope.row.largeCode)">修改</el-button>
          </template>
        </el-table-column>
      </jc-table>
    </div>
    <!--    中类列表弹框-->
    <el-dialog
      title="中类集合"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-button type="primary" class="btn inTheBtn" size="mini" @click="increased(1)">新增</el-button>
      <jc-table
        :table-data="inTheData"
        :table-header="inTheHeader"
        :cell-style="cellStyle"
        table-height="53vh"
      >
        <el-table-column prop="mediumCode" label="中类编码" align="center" />
        <el-table-column prop="mediumName" label="中类名称" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delCenter(scope.row.mediumCode)">删除</el-button>
          </template>
        </el-table-column>
      </jc-table>
    </el-dialog>
    <!--    小类列表弹框-->
    <el-dialog
      title="小类集合"
      :visible.sync="dialogVisibleSmall"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-button type="primary" class="btn inTheBtn" size="mini" @click="increased(2)">新增</el-button>
      <jc-table
        :table-data="smallData"
        :table-header="smallHeader"
        :cell-style="cellStyle"
        table-height="53vh"
      >
        <el-table-column prop="mediumName" label="中类名称" align="center" />
        <el-table-column prop="number" label="小类编码" align="center" />
        <el-table-column prop="name" label="小类名称" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="">
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </jc-table>
    </el-dialog>
    <!--    属性列表弹框-->
    <el-dialog
      title="属性集合"
      :visible.sync="dialogVisibleAttribute"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-button type="primary" class="btn inTheBtn" size="mini" @click="increased(3)">新增</el-button>
      <jc-table
        :table-data="attributeData"
        :table-header="attributeHeader"
        :cell-style="cellStyle"
        table-height="53vh"
      >
        <el-table-column prop="attributeName" label="属性名称" align="center" />
        <el-table-column prop="name" label="物料属性明细名称" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="">
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </jc-table>
    </el-dialog>
    <!--新增大类弹框-->
    <jc-class v-if="newClass" :msg="title" :msg2="laCode" @newly="increas" />
    <!--新增中小类属性弹框-->
    <el-dialog
      title="新增"
      :visible.sync="newInTheClass"
      :close-on-click-modal="false"
      width="50%"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item v-if="newClassID===2" label="中类">
          <el-select v-model="newMediumName" placeholder="请选择">
            <el-option
              v-for="item in inTheData"
              :key="item.mediumCode"
              :label="item.mediumName"
              :value="item.mediumCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="newClassID===2" label="名称">
          <el-tag
            v-for="tag in serial"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,4)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible4"
            ref="saveTagInput4"
            v-model="inputValue4"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(4)"
            @blur="handleInputConfirm(4)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(4)">新增小类</el-button>
        </el-form-item>
        <el-form-item v-if="newClassID!==2" label="名称">
          <el-input v-model="newMediumName" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitMediumName">保存</el-button>
          <el-button @click="newInTheClass=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="getSonClass"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import jcClass from '@/views/basic/encodingRules/categories/components/newClass/index'
import tagMixin from '@/views/basic/encodingRules/categories/components/newClass/mixin'
import {
  queryLargeTypeList,
  queryTwoMaterialNumbert,
  querySerialTypeList,
  queryAttributeTypeList,
  insertMediumType,
  insertSerialType,
  deleteMediumType,
  insertAttributeType
} from '@/api/encodingRules/categories'

export default {
  name: 'Categories',
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    jcClass
  },
  // tag标签 组件方法
  mixins: [tagMixin],
  data() {
    return {
      title: '', // 新增大类弹窗名称
      laCode: '', // 大类编码(修改)
      newInTheClass: false, // 新增中类弹框
      newClass: false, // 新增大类弹框
      dialogVisibleAttribute: false, // 属性弹框
      dialogVisibleSmall: false, // 小类弹框
      dialogVisible: false, // 中类弹框
      largeName: '', // 大类名称
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableHeader: [], // 大类表头
      inTheHeader: [], // 中类表头
      smallHeader: [], // 小类表头
      attributeHeader: [], // 属性表头
      // 表格数据
      tableData: [], // 大类数据
      inTheData: [], // 中类数据
      smallData: [], // 小类数据
      attributeData: [] // 属性数据
    }
  },
  mounted() {
    this.getSonClass()
  },
  methods: {
    // 新增大类 / 修改
    newly(ev) {
      if (ev === '1') {
        this.title = '新增'
        this.laCode = ''
      } else {
        this.title = '修改'
        this.laCode = ev
      }
      this.newClass = true
    },
    // 新增大类 / 修改 的返回值
    increas(ev) {
      this.newClass = false
      if (ev === 1) {
        this.getSonClass()
      }
    },
    // 新增中类、小类、属性
    increased(num) {
      this.newInTheClass = true
      this.newClassID = num
      this.newMediumName = '' // 清空名称数据
      this.serial = [] // 清空小类数据
      if (num === 2) {
        this.inTheClass()
      }
    },
    // 新增中类、小类、属性
    async onSubmitMediumName() {
      if (!this.newMediumName) {
        this.$message.error('名称不能为空')
        return
      }
      if (this.newClassID === 1) { // 新增中类
        const DATA = { largeCode: this.newLargeCode, mediumName: this.newMediumName }
        const { code, message } = await insertMediumType(DATA)
        if (code === 0) {
          this.$message({
            message: message,
            type: 'success'
          })
          this.newInTheClass = false
          this.newMediumName = ''
          this.inTheClass(this.newLargeCode)
          return
        }
      } else if (this.newClassID === 2) { // 新增小类
        const DATA = { serialType: this.newSerialType, name: this.serial.join(','), mediumCode: this.newMediumName }
        const { code, message } = await insertSerialType(DATA)
        if (code === 0) {
          this.$message({
            message: message,
            type: 'success'
          })
          this.newInTheClass = false
          this.serial = []
          this.smallClass(this.newSerialType)
          return
        }
      } else if (this.newClassID === 3) { // 新增属性
        const DATA = { attributeType: this.newAttributeType, name: this.newMediumName }
        const { code, message } = await insertAttributeType(DATA)
        if (code === 0) {
          this.$message({
            message: message,
            type: 'success'
          })
          this.newInTheClass = false
          this.newMediumName = ''
          this.attribute(this.newAttributeType)
          return
        }
      }
    },
    // 获取大类列表数据
    async getSonClass() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, largeName: this.largeName }
      const { data: RES } = await queryLargeTypeList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 获取中类列表数据
    async inTheClass(id) {
      if (id) {
        this.newLargeCode = id
        this.dialogVisible = true
      } else {
        this.newLargeCode = this.cenLarge
      }
      const DATA = { largeCode: this.newLargeCode }
      const { data: RES } = await queryTwoMaterialNumbert(DATA)
      this.inTheData = RES
    },
    // 删除中类
    delCenter(ev) {
      const DATA = {
        largeCode: this.newLargeCode,
        mediumCode: ev
      }
      this.$confirm('确定删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMediumType(DATA).then(res => {
          this.$message.success('操作成功')
          this.inTheClass(this.newLargeCode)
        })
      })
    },
    // 获取小类列表数据
    async smallClass(id, en) {
      if (en) {
        this.cenLarge = en
      }
      this.newSerialType = id
      this.dialogVisibleSmall = true
      const DATA = { serialType: id, largeCode: this.cenLarge }
      const { data: RES } = await querySerialTypeList(DATA)
      this.smallData = RES
    },
    // 获取属性列表数据
    async attribute(id) {
      this.newAttributeType = id
      this.dialogVisibleAttribute = true
      const DATA = { attributeType: id }
      const { data: RES } = await queryAttributeTypeList(DATA)
      this.attributeData = RES
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.getSonClass()
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
.inTheBtn{
  transform: translateY(-15px);
}
.tag-mar:hover {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
