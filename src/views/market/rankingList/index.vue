<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: 'RankingList',
  created() {
    const route = this.$route.matched.find(item => item.name === this.$options.name)
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>

<style scoped>

</style>
