<template>
  <div>
    <el-dialog
      :title="classTitle"
      :visible.sync="isNewClass"
      width="50%"
      :close-on-click-modal="false"
      :before-close="diaClose"
    >
      <el-form label-width="100px" :model="formLabelAlign">
        <el-form-item label="大类编码">
          <el-input v-model="formLabelAlign.largeCode" :disabled="msg2===''? false : true" />
        </el-form-item>
        <el-form-item label="大类名称">
          <el-input v-model="formLabelAlign.largeName" :disabled="msg2===''? false : true" />
        </el-form-item>
        <!--新增-->
        <el-form-item v-if="!msg2" label="中类集合">
          <el-tag
            v-for="tag in formLabelAlign.mediumName"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,0)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(0)"
            @blur="handleInputConfirm(0)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(0)">新增中类</el-button>
        </el-form-item>
        <el-form-item v-if="!msg2" label="小类集合">
          <el-tag
            v-for="tag in formLabelAlign.typeArray"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,1)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible1"
            ref="saveTagInput1"
            v-model="inputValue1"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(1)"
            @blur="handleInputConfirm(1)"
          />
          <el-button v-else-if="!inputVisible1 && xiaolei" class="button-new-tag" size="small" @click="showInput(1)">新增小类</el-button>
        </el-form-item>
        <el-form-item v-if="!msg2" label="属性集合">
          <el-tag
            v-for="tag in formLabelAlign.attributeArray"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,2)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible2"
            ref="saveTagInput2"
            v-model="inputValue2"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(2)"
            @blur="handleInputConfirm(2)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(2)">新增属性</el-button>
        </el-form-item>
        <!--修改-->
        <el-form-item v-if="msg2" label="中类集合">
          <el-tag
            v-for="tag in formLabelAlign.mediumName"
            :key="tag"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
          <el-tag
            v-for="tag in medium"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,5)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(0)"
            @blur="handleInputConfirm(0)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(0)">新增中类</el-button>
        </el-form-item>
        <el-form-item v-if="msg2" label="小类集合">
          <el-tag
            v-for="tag in formLabelAlign.typeArray"
            :key="tag"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
        </el-form-item>
        <el-form-item v-if="msg2" label="属性集合">
          <el-tag
            v-for="tag in formLabelAlign.attributeArray"
            :key="tag"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
          <el-tag
            v-for="tag in attribute"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,6)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible2"
            ref="saveTagInput2"
            v-model="inputValue2"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(2)"
            @blur="handleInputConfirm(2)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(2)">新增属性</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="diaClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { insertLarge, queryCodingRules, updateCodingRules } from '@/api/encodingRules/categories'
import tagMixin from '@/views/basic/encodingRules/categories/components/newClass/mixin'

export default {
  mixins: [tagMixin],
  props: {
    msg: { // 弹窗名称
      type: String,
      default: ''
    },
    msg2: { // 大类编码
      type: String,
      default: ''
    }
  },
  data() {
    return {
      xiaolei: true,
      classTitle: this.msg, // 弹窗名称
      isNewClass: true,
      formLabelAlign: {
        largeCode: '',
        largeName: '',
        mediumName: [],
        typeArray: [],
        attributeArray: []
      },
      medium: [], // 修改新增的中类
      attribute: [] // 修改新增的中类
    }
  },
  mounted() {
    this.queryCodingRules()
  },
  methods: {
    // 修改时获取数据
    queryCodingRules() {
      const DATA = { largeCode: this.msg2 }
      if (this.msg2) {
        this.xiaolei = false // 小类不可修改
        queryCodingRules(DATA).then(res => {
          this.formLabelAlign.largeCode = res.data.largeCode
          this.formLabelAlign.largeName = res.data.largeName
          this.formLabelAlign.mediumName = res.data.objects.map(item => {
            return item.mediumName
          })
          this.formLabelAlign.typeArray = res.data.serialList.map(item => {
            return item.serialName
          })
          this.formLabelAlign.attributeArray = res.data.attributeTypeList.map(item => {
            return item.attributeName
          })
        })
      }
    },
    // 新增大类
    async onSubmit() {
      if (!this.formLabelAlign.largeCode) {
        this.$message({
          message: '大类编码不能为空',
          type: 'error'
        })
        return
      }
      if (!this.formLabelAlign.largeName) {
        this.$message({
          message: '大类名称不能为空',
          type: 'error'
        })
        return
      }
      if (this.formLabelAlign.mediumName.length <= 0) {
        this.$message({
          message: '中类不能为空',
          type: 'error'
        })
        return
      }
      if (this.formLabelAlign.typeArray.length <= 0) {
        this.$message({
          message: '小类不能为空',
          type: 'error'
        })
        return
      }
      if (this.formLabelAlign.attributeArray.length <= 0) {
        this.$message({
          message: '属性不能为空',
          type: 'error'
        })
        return
      }
      if (this.msg2) {
        const data = {
          largeCode: this.formLabelAlign.largeCode,
          mediumName: this.medium.join(),
          attributeArray: this.attribute.join()
        }
        // 更新
        await updateCodingRules(data).then(res => {
          this.$message.success('更新成功')
        })
      } else {
        const DATA = {
          largeCode: this.formLabelAlign.largeCode,
          largeName: this.formLabelAlign.largeName,
          mediumName: this.formLabelAlign.mediumName.join(),
          typeArray: this.formLabelAlign.typeArray.join(),
          attributeArray: this.formLabelAlign.attributeArray.join()
        }
        // 新增
        await insertLarge(DATA).then(res => {
          this.$message.success('新增成功')
        })
      }
      this.$emit('newly', 1)
      return
    },
    // 关闭前回调
    diaClose() {
      this.$emit('newly', 2)
    }
  }
}
</script>

<style scoped lang="scss">
.tag-mar {
  margin-right: 3px;
  margin-bottom: 3px;
}

.tag-mar:hover {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin: 3px 5px;
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
