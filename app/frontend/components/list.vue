<template>
  <div class="list">
    <h2 class="header">{{ list.name }}</h2>

    <div class="cardset">
      <!-- lists: html @lists.to_json(include: :cards), 所以我們已經有cards可以利用 -->
      <Card v-for="card in cards" :card="card" :key="card.id" ></Card>
      <!-- 卡片最下方可新增卡片 -->
      <div class="input-area">
        <textarea class="content" v-model="content"></textarea>
        <button class="card-button" @click="createCard">新增卡片</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Rails from '@rails/ujs';
  import Card from 'components/card';
  export default {              
    name: 'List',
    props: ["list"], // property
    components: { Card },
    data: function(){
      return {
        content: '',
        cards: this.list.cards // cardset的`v-for`就可以改成cards
      }
    },
    methods: {
      createCard(event){
        event.preventDefault();
        // console.log(this.content)
      let data = new FormData();
      // 準備好一包資料（把新增的資料接到原本資料的後面）
      data.append("card[list_id]", this.list.id);
      data.append("card[name]", this.content);
      Rails.ajax({
          url: '/cards',
          type: 'POST',
          data,
          dataType: 'json',
          success: response => {
            // console.log(response)
            // 把response push進去 cards
            this.cards.push(response);
            // 清空輸入框
            this.content = "";
          },
          error: err => {
            console.log(err)
          }
        });
      }
    }
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

    .input-area {
      @apply .mt-2;  

      .content {
        @apply .w-full .px-2 .py-2 .rounded-md;
        &:focus {
          @apply .outline-none;
        }
      }
      .card-button {
      @apply .mx-1 .px-2 .py-1 .bg-blue-300 .rounded-md .text-sm .text-gray-800 .font-thin;
        &:hover {
          @apply .bg-blue-400;
        }
      }
    }
  }
}
</style>