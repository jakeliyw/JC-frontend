<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    // 局部刷新
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style lang="scss">
@media screen and (max-width: 1440px){
  .el-dialog{
    margin-top: 5vh!important;
    .el-dialog__body{
      padding: 0 20px;
    }
  }
}
</style>
