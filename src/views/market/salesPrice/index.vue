<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'SalesPrice',
  created() {
    const route = this.$route.matched.find(item => item.name === this.$options.name)
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>
