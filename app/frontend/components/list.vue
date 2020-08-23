<template>
  <div class="list">
    <h2 class="header">{{ list.name }}</h2>
  </div>
</template>

<script>
  export default {              
    name: 'List',
    props: ["list"] // property
  }
</script>

<style lang="scss" scoped>
.list {
  @apply .bg-gray-200 .mx-2 .w-64 .rounded-md;
  
  .header {
    @apply .px-3 .py-1 .font-bold;
  }
}
</style>