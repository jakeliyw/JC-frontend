<template>
  <div>
    <el-form ref="form" :label-width="labelWidth" :model="optionValue">
      <el-row class="elRow" :gutter="30" type="flex" justify="start">
        <el-col
          v-for="(item, key) in options"
          :key="key"
          :span="item.span || 6"
          :offset="item.offset || 0"
          :push="item.push || 0"
          class="grid-content"
        >
          <!--BOM成本显示权限-->
          <el-form-item
            v-if="item.type === 'bom' && bomCost('bom:price')"
            class="active"
            :label="item.label"
            :prop="key"
            label-width="120px"
            :rules="item.rules"
          >
            <el-input
              v-model="optionValue[key]"
              size="mini"
              class="input-width"
              :disabled="item.disabled"
              :maxlength="item.maxlength || ''"
              :type="item.type"
              :placeholder="item.placeholder || `请输入${item.label || '内容'}`"
            />
          </el-form-item>
          <el-form-item
            v-if="item.type === 'slot'"
            :label="item.label"
            :prop="key"
            label-width="120px"
            :rules="item.rules"
          >
            <slot />
          </el-form-item>
          <!--          循环值-->
          <el-form-item
            v-else-if="item.type === 'text' || item.type === 'password' || !item.type"
            :label="item.label"
            :prop="key"
            label-width="120px"
            :rules="item.rules"
          >
            <el-input
              v-model="optionValue[key]"
              size="mini"
              class="input-width"
              :disabled="item.disabled"
              :maxlength="item.maxlength || ''"
              :type="item.type"
              :placeholder="item.placeholder || `请输入${item.label || '内容'}`"
            />
          </el-form-item>
          <!--          number-->
          <el-form-item
            v-else-if="item.type === 'number'"
            :label="item.label"
            :prop="key"
            :rules="item.rules"
            label-width="100px"
          >
            <el-input-number
              v-model="optionValue[key]"
              size="small"
              :precision="item.precision"
              :min="item.min"
              :step="item.step"
              class="input-width"
              :disabled="item.disabled"
            />
          </el-form-item>
          <!--select-->
          <el-form-item
            v-else-if="item.type === 'select'"
            :label="item.label"
            :prop="key"
            :rules="item.rules"
            label-width="120px"
          >
            <el-select
              v-model="optionValue[key]"
              :disabled="item.disabled"
              class="input-width"
              :allow-create="item.create || false"
              size="small"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              filterable
              default-first-option
            >
              <el-option
                v-for="option in item.selectItems"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <!--selectObj-->
          <el-form-item
            v-else-if="item.type === 'selectObj'"
            :label="item.label"
            :prop="key"
            :rules="item.rules"
            label-width="100px"
          >
            <el-select
              v-model="optionValue[key]"
              :disabled="item.disabled"
              :allow-create="item.create || false"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              value-key="value"
              size="small"
              filterable
              default-first-option
              clearable
            >
              <el-option
                v-for="option in item.selectItems"
                :key="option.value"
                :label="option.label"
                :value="option"
              />
            </el-select>
          </el-form-item>
          <!--select-multiple 是否多选-->
          <el-form-item
            v-else-if="item.type === 'multiple'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
            label-width="100px"
          >
            <el-select
              v-model="optionValue[name]"
              :disabled="item.disabled"
              :allow-create="item.create || false"
              size="small"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              multiple
              filterable
              clearable
            >
              <el-option
                v-for="option in item.selectItems"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <!--          单选框-->
          <el-form-item
            v-else-if="item.type === 'checkbox'"
            :label="item.label"
            :prop="key"
            :rules="item.rules"
            label-width="100px"
          >
            <el-checkbox
              v-model="optionValue[key]"
              name="type"
              :disabled="item.disabled"
            />
          </el-form-item>
          <!--textarea-->
          <el-form-item
            v-else-if="item.type === 'textarea'"
            :label="item.label"
            :datafld="item.datafld"
            :prop="key"
            size="mini"
            :rules="item.rules"
            label-width="100px"
            :class="{ 'describe': item.isActive }"
          >
            <el-input
              v-model="optionValue[key]"
              :disabled="item.disabled"
              type="textarea"
              :placeholder="item.placeholder || `请输入${item.label || '内容'}`"
              clearable
            />
          </el-form-item>
          <!--          时间区域-->
          <el-form-item
            v-else-if="item.type === 'date'"
            :label="item.label"
            :prop="key"
            :rules="item.rules"
            label-width="100px"
          >
            <el-date-picker
              v-model="optionValue[key]"
              :disabled="item.disabled"
              size="small"
              type="date"
              :editable="false"
              :picker-options="pickerOptions"
              :placeholder="item.placeholder || `请选择${item.label || '日期和时间'}`"
            />
          </el-form-item>
          <!--          dateTime 日期时间-->
          <el-form-item
            v-else-if="item.type === 'dateTime'"
            :label="item.label"
            :prop="key"
            :rules="item.rules"
            label-width="100px"
          >
            <el-date-picker
              v-model="optionValue[key]"
              :disabled="item.disabled"
              size="small"
              type="datetime"
              :editable="false"
              :placeholder="item.placeholder || `请选择${item.label || '日期和时间'}`"
            />

          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { GMTToStr } from '@/utils'

export default {
  name: 'Index',
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    optionValue: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    },
    xs: {
      type: Number,
      default: 6
    },
    sm: {
      type: Number,
      default: 6
    },
    md: {
      type: Number,
      default: 6
    },
    lg: {
      type: Number,
      default: 6
    },
    xl: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  methods: {
    // 表单预验证
    handleRefData() {
      let flag = null
      this.$refs.form.validate(valid => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    },
    reset() {
      this.$emit('reset', this.$refs.form.resetFields())
    },

    // 获取表单数据
    handleGetFormData() {
      Object.keys(this.options).map(v => {
        if (this.optionValue[v] && this.options[v].type === 'date') {
          this.optionValue[v] = GMTToStr(this.optionValue[v])
        } else if (this.optionValue[v] && this.options[v].type === 'dateTime') {
          this.optionValue[v] = GMTToStr(this.optionValue[v])
        }
      })
      return this.optionValue
    },
    getOptions() {
      return {
        options: this.options,
        optionValue: this.optionValue
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.elRow {
  display: flex;
  flex-wrap: wrap;
}
.active{
  width: 0;
  padding: 0;
}
.input-width {
  width: 10vw;
}
.input-width ::v-deep .el-input__inner{
  color: black;
}
.el-textarea ::v-deep .el-textarea__inner{
  color: black;
}

.describe {
  width: 35vw;
}
.el-form-item{
  margin-bottom: 15px;
}
</style>
