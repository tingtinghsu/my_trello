<template>
  <div class="list">
    <h2 class="header">{{ list.name }}</h2>

    <div class="cardset">
      <!-- lists: html @lists.to_json(include: :cards), 所以我們已經有cards可以利用 -->
      <Card v-for="card in list.cards" :card="card" :key="card.id" ></Card>
    </div>
  </div>
</template>

<script>
  import Card from 'components/card';
  export default {              
    name: 'List',
    props: ["list"], // property
    components: { Card }
  }
</script>

<style lang="scss" scoped>
.list {
  @apply .bg-gray-200 .mx-2 .w-64 .rounded-md;
  
  .header {
    @apply .px-3 .py-1 .font-bold;
  }

  .cardset {
    @apply .mx-2 .mt-2 .mb-2 .rounded-lg;
  }
}
</style>