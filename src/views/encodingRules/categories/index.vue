<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">大类名称</span>
        <el-input
          v-model="largeName"
          class="input-content"
          placeholder="请输入大类名称"
          @keyup.enter.native="handleQuerySonClass"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQuerySonClass">搜索</el-button>
        <el-button type="primary" class="btn" size="medium" @click="newClass=true">新增</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <el-table-column prop="largeCode" label="大类编码" min-width="80" align="center"></el-table-column>
        <el-table-column prop="largeName" label="大类名称" min-width="120" align="center"></el-table-column>
        <el-table-column prop="mediumName" label="中类集合" min-width="120" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="inTheClass(scope.row.largeCode)">{{ scope.row.mediumName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="typeArray" label="小类集合" min-width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(item,id) in scope.row.typeArray"
              :key="id"
              @click="smallClass(item.serialType)"
              class="tag-mar">{{ item.serialName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="attributeArray" label="属性集合" min-width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(item,id) in scope.row.attributeArray"
              :key="id"
              @click="attribute(item.attributeType)"
              class="tag-mar">{{ item.attributeName }}
            </el-tag>
          </template>
        </el-table-column>
      </jc-table>
    </div>
    <!--    中类列表弹框-->
    <el-dialog
      title="中类集合"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <jc-table
        :table-data="inTheData"
        :table-header="inTheHeader"
        :cell-style="cellStyle"
      >
        <el-table-column prop="mediumCode" label="中类编码" align="center"></el-table-column>
        <el-table-column prop="mediumName" label="中类名称" align="center"></el-table-column>
      </jc-table>
    </el-dialog>
    <!--    小类列表弹框-->
    <el-dialog
      title="小类集合"
      :visible.sync="dialogVisibleSmall"
      width="50%"
    >
      <jc-table
        :table-data="smallData"
        :table-header="smallHeader"
        :cell-style="cellStyle"
      >
        <el-table-column prop="number" label="小类编码" align="center"></el-table-column>
        <el-table-column prop="name" label="小类名称" align="center"></el-table-column>
      </jc-table>
    </el-dialog>
    <!--    属性列表弹框-->
    <el-dialog
      title="属性集合"
      :visible.sync="dialogVisibleAttribute"
      width="50%"
    >
      <jc-table
        :table-data="attributeData"
        :table-header="attributeHeader"
        :cell-style="cellStyle"
      >
        <el-table-column prop="attributeName" label="属性名称" align="center"></el-table-column>
        <el-table-column prop="name" label="物料属性明细名称" align="center"></el-table-column>
      </jc-table>
    </el-dialog>
    <!--    新增大类弹框-->
    <el-dialog
      title=""
      :visible.sync="newClass"
      width="50%"
    >
      <el-form label-width="100px" :model="formLabelAlign">
        <el-form-item label="大类编码">
          <el-input v-model="formLabelAlign.largeCode"></el-input>
        </el-form-item>
        <el-form-item label="大类名称">
          <el-input v-model="formLabelAlign.largeName"></el-input>
        </el-form-item>
        <el-form-item label="中类集合">
          <el-tag
            :key="tag"
            v-for="tag in formLabelAlign.mediumName"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,0)">
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(0)"
            @blur="handleInputConfirm(0)"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(0)">+ New Class</el-button>
        </el-form-item>
        <el-form-item label="小类集合">
          <el-tag
            v-for="tag in formLabelAlign.typeArray"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,1)">
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible1"
            v-model="inputValue1"
            ref="saveTagInput1"
            size="small"
            @keyup.enter.native="handleInputConfirm(1)"
            @blur="handleInputConfirm(1)"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(1)">+ New Class</el-button>
        </el-form-item>
        <el-form-item label="属性集合">
          <el-tag
            v-for="tag in formLabelAlign.attributeArray"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,2)">
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible2"
            v-model="inputValue2"
            ref="saveTagInput2"
            size="small"
            @keyup.enter.native="handleInputConfirm(2)"
            @blur="handleInputConfirm(2)"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(2)">+ New Class</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="newClass=false">取消</el-button>
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
import {
  queryLargeTypeList,
  queryTwoMaterialNumbert,
  querySerialTypeList,
  queryAttributeTypeList
} from '@/api/encodingRules/categories'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
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
      attributeData: [], // 属性数据
      formLabelAlign: {
        largeCode: '',
        largeName: '',
        mediumName: [],
        typeArray: [],
        attributeArray: []
      },
      // tag标签添加集合
      inputVisible: false, // 中类tag
      inputValue: '', // 中类tag
      inputVisible1: false, // 小类tag
      inputValue1: '', // 小类tag
      inputVisible2: false, // 属性tag
      inputValue2: '' // 属性tag
    }
  },
  mounted() {
    this.getSonClass()
  },
  methods: {
    // 新增大类
    onSubmit() {
      console.log(this.formLabelAlign)
    },
    // 获取大类列表数据
    async getSonClass() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, largeName: this.largeName }
      const { data: RES, data: total } = await queryLargeTypeList(DATA)
      this.tableData = RES.array
      this.total = total.total
    },
    // 获取中类列表数据
    async inTheClass(id) {
      this.dialogVisible = true
      const DATA = { largeCode: id }
      const { data: RES } = await queryTwoMaterialNumbert(DATA)
      this.inTheData = RES
    },
    // 获取小类列表数据
    async smallClass(id) {
      this.dialogVisibleSmall = true
      const DATA = { serialType: id }
      const { data: RES } = await querySerialTypeList(DATA)
      this.smallData = RES
    },
    // 获取属性列表数据
    async attribute(id) {
      this.dialogVisibleAttribute = true
      const DATA = { attributeType: id }
      const { data: RES } = await queryAttributeTypeList(DATA)
      this.attributeData = RES
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.getSonClass()
    },
    // 删除tag标签
    handleClose(tag, num) {
      if (num == 0) {
        this.formLabelAlign.mediumName.splice(this.formLabelAlign.mediumName.indexOf(tag), 1)
      } else if (num == 1) {
        this.formLabelAlign.typeArray.splice(this.formLabelAlign.typeArray.indexOf(tag), 1)
      } else if (num == 2) {
        this.formLabelAlign.attributeArray.splice(this.formLabelAlign.attributeArray.indexOf(tag), 1)
      }
    },
    // 点击New Class
    showInput(num) {
      if (num == 0) {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } else if (num == 1) {
        this.inputVisible1 = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput1.$refs.input.focus()
        })
      } else if (num == 2) {
        this.inputVisible2 = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput2.$refs.input.focus()
        })
      }
    },
    // 添加集合标签
    handleInputConfirm(num) {
      if (num == 0) {
        const inputValue = this.inputValue
        if (inputValue) {
          this.formLabelAlign.mediumName.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      } else if (num == 1) {
        const inputValue1 = this.inputValue1
        if (inputValue1) {
          this.formLabelAlign.typeArray.push(inputValue1)
        }
        this.inputVisible1 = false
        this.inputValue1 = ''
      } else if (num == 2) {
        const inputValue2 = this.inputValue2
        if (inputValue2) {
          this.formLabelAlign.attributeArray.push(inputValue2)
        }
        this.inputVisible2 = false
        this.inputValue2 = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}

.tag-mar {
  margin-right: 3px;
  margin-bottom: 3px;
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
