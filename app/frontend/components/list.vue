<template>
  <div class="list">
    <h2 class="header">{{ list.name }}</h2>

    <div class="cardset">
      <!-- lists: html @lists.to_json(include: :cards), 所以我們已經有cards可以利用 -->
      
      <draggable v-model="cards" ghost-class="ghost" group="list" @change="cardMoved">
        <Card v-for="card in cards" :card="card" :key="card.id" ></Card>
      </draggable>
      <!-- 卡片最下方可新增卡片 -->
      <div class="input-area">
        <button v-if="!editing" class="card-button bg-blue-200" @click="newCard">新增卡片</button>

        <textarea v-if="editing" class="content" v-model="content"></textarea>
        <button v-if="editing" class="card-button bg-blue-400" @click="createCard">建立卡片</button>
        <button v-if="editing" class="card-button bg-red-400" @click="editing = false">取消</button>        
      </div>
    </div>
  </div>
</template>

<script>
  import Rails from '@rails/ujs';
  import Card from 'components/card';
  import draggable from 'vuedraggable';

  export default {              
    name: 'List',
    props: ["list"], // property
    components: { Card, draggable },
    data: function(){
      return {
        content: '',
        cards: this.list.cards, // cardset的`v-for`就可以改成cards
        editing: false // 預設輸入框不顯示
      }
    },
    methods: {
      cardMoved(event){
        // event.preventDefault();
        console.log(event)
        let evt = event.added || event.moved;
        if (evt) {
          // 先透過element確定哪張卡片被移
          let el = evt.element;
          // 把id存起來
          let card_id = el.id;

          console.log(card_id);
          // 準備一包FormData
          let data = new FormData();
          // 找到card在哪個list (可能是新移動的list，或是原本的list)
          data.append("card[list_id]", this.list.id);
          // acts as list 的 position：從1開始算，移動到新的位置
          data.append("card[position]", evt.newIndex + 1);
          Rails.ajax({
            // cards/2/move
            // 打到cards[編號為新移動完的序列]，那筆資料的id
            url: `/cards/${card_id}/move`,
            type: 'PUT',
            data,
            dataType: 'json',
            success: response => {
              console.log(response);
            },
            error: error => {
              console.log(error);
            }
          })
        }
      },
      newCard(event){
        event.preventDefault();
        this.editing = true;
      },

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
        this.editing = false;        
      }
    }
  }
</script>

<style lang="scss" scoped>
.ghost {
  @apply .border-2 .border-blue-400 .border-dashed;
}
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
        @apply .mx-1 .px-2 .py-1 .rounded-md .text-sm .text-gray-800 .font-thin;
      }
    }
  }
}
</style>