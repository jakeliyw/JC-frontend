<template>
  <div class="search" :class="{active: !caret}">
    <div v-for="(item, index) in searData" :key="index" class="hang">
      <span v-if="index<conceal">
        <el-select v-model="item.fenglish" placeholder="请选择" size="mini" filterable @change="gatherData()">
          <el-option
            v-for="iten in options"
            :key="iten.fenglish"
            :label="iten.fdisplay"
            :value="iten.fenglish"
          />
        </el-select>
        <el-input v-model.trim="item.val" size="mini" @keyup.enter.native="handleSearch" @blur="gatherData()" />
        <i v-if="index>0" class="el-icon-remove-outline" @click="delSear(index)" />
      </span>
    </div>
    <div v-show="!caret" class="newSear" @click="newSearch">
      <i class="el-icon-circle-plus-outline" />
      新增条件
    </div>
    <div class="posit">
      <i v-show="caret" class="el-icon-d-arrow-left" @click="searShow()" />
      <i v-show="!caret" class="el-icon-d-arrow-right" @click="noShow()" />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    msg: {
      type: String,
      default: ''
    },
    msg2: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      conceal: 1, // 最多显示几条数据
      caret: true,
      searData: [{ fenglish: this.msg, val: '' }], // 搜索下拉框数据
      hunt: {} // 搜索下拉框数据(向父传值)
    }
  },
  watch: {
    msg2() {
      this.noShow()
    }
  },
  methods: {
    // 下拉
    searShow() {
      if (this.searData.length < 2) {
        this.searData.push({})
      }
      this.caret = false
      this.conceal = 15
    },
    // 收回
    noShow() {
      this.caret = true
      this.conceal = 1
    },
    // 新增条件
    newSearch() {
      this.searData.push({})
    },
    // 删除条件
    delSear(index) {
      this.searData.splice(index, 1)
      this.gatherData()
    },
    // 向父组件传值
    gatherData() {
      this.hunt = {}
      this.searData.forEach(item => {
        this.$set(this.hunt, item.fenglish, item.val)
        this.$emit('seek', this.hunt)
      })
    },
    handleSearch() {
      this.gatherData() // 获取搜索数据
      this.noShow() // 收回
      this.$emit('hand', '')
    }
  }
}
</script>
<style scoped lang="scss">
.active{
  border-radius: 3px;
  box-shadow: 0 0 3px #1e9fff;
}
.search{
  padding: 0 10px;
  padding-top: 5px;
  position: absolute;
  top: 0px;
  width: 395px;
  background: #fff;
  z-index: 10;
  .el-icon-remove-outline{
    cursor: pointer;
    color: #1e9fff;
    margin-left: 5px;
    padding-top: 5px;
  }
  .hang{
    margin-bottom: 10px;
  }
  .el-input{
    margin-left: 10px;
    width: 163px;
  }
  .posit{
    position: absolute;
    top: 10px;
    right: 10px;
    i{
      font-size: 14px;
      color: #737577;
    }
    .el-icon-d-arrow-left{
      transform: rotate(90deg);
    }
    .el-icon-d-arrow-right{
      transform: rotate(90deg);
    }
  }
  .posit:hover{
    box-shadow: 0 0 1px #aaa;
  }
  .newSear{
    cursor: pointer;
    font-size: 12px;
    color: #409EFF;
    margin-bottom: 10px;
  }
}

</style>
