<template>
  <div class="layout">
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'Index',
  computed: {
    title() {
      const route = this.$route
      const { meta } = route
      return meta.title
    }
  }
}
</script>

<style scoped lang="scss">
.layout{
  margin-bottom: 10px;
  .title{
    color: wheat;
    display: table-cell;
    font-weight: 800;
    background-color: #848383;
    width: 90vw;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    border-left: groove;
    letter-spacing: 5px;
    text-indent: 10px;
  }
}
</style>
