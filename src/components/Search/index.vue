<template>
  <div class="search" :class="{active: !caret}">
    <div class="hang" v-for="(item, index) in searData" :key="index">
      <el-select v-model="item.value" placeholder="请选择" size="mini">
        <el-option
          v-for="item in options"
          :key="item.english"
          :label="item.display"
          :value="item.english"
        />
      </el-select>
      <el-input v-model="item.value" size="mini" />
    </div>
    <div class="posit">
      <i v-show="caret" class="el-icon-caret-bottom" @click="searShow()" />
      <i v-show="!caret" class="el-icon-caret-top" @click="noShow()" />
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
    }
  },
  data() {
    return {
      caret: true,
      searData: [{}] // 搜索下拉框数据
    }
  },
  methods: {
    searShow() {
      this.caret = false
      this.searData.push({}, {})
      this.$refs
    },
    noShow() {
      this.caret = true
      this.searData = this.searData.splice(0, 1)
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
  width: 380px;
  background: #fff;
  z-index: 111;

  .hang{
   margin-bottom: 10px;
  }
  .el-input{
    margin-left: 10px;
    width: 163px;
  }
  .posit{
    position: absolute;
    top: 5px;
    right: -20px;
    i{
      font-size: 20px;
    }
  }
}

</style>
