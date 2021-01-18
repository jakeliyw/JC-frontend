<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Purchase',
  created() {
    const route = this.$route.matched.find(item => item.name === this.$options.name)
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>
<style lang="scss">
</style>
