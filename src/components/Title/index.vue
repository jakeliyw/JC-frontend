<template>
  <div class="bg-color">
    <span class="title-left">{{ titleLeft }}</span>
    <span v-if="titleRight" class="title-right">{{ titleRight }}</span>
    <span v-else class="title-href" @click="more">{{ titleHref }}</span>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    titleLeft: {
      type: String,
      require: true,
      default: ''
    },
    titleRight: {
      type: String,
      default: ''
    },
    titleHref: {
      type: String,
      default: ''
    }
  },
  methods: {
    more() {
      this.$message.error('页面未开发！！')
    }
  }
}
</script>

<style scoped lang="scss">
.bg-color {
  background-color: #848383;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .title-left {
    color: #ffd04b;
    padding-left: 10px;
  }

  .title-right {
    color: white;
    padding-right: 10px;
  }

  .title-href {
    color: white;
    padding-right: 10px;
    cursor:pointer;
    &:hover{
      text-decoration: underline;
    }
  }
}
</style>
