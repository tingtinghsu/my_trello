require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

const images = require.context('../images', true)
const imagePath = (name) => images(name, true)

import 'scripts'
import 'styles'

// vue.js
import Vue from 'vue/dist/vue.esm';
import List from 'components/list';
import Rails from '@rails/ujs'; // 在vuedraggable之前
import draggable from 'vuedraggable';


document.addEventListener("turbolinks:load", function(event){
  let el = document.querySelector('#show-list');

  if (el) {
    new Vue({
      el,
      data: {
        lists: JSON.parse(el.dataset.lists)
      },
      components: { List, draggable },

      methods: {
        listMoved(event){
          // console.log(event)
          let data = new FormData();
          // acts as list 的 position：從1開始算，移動到新的位置
          data.append("list[position]", event.moved.newIndex + 1);

          Rails.ajax({
            // lists/2/move
            // 打到lists[編號為新移動完的序列]，那筆資料的id
            url: `/lists/${this.lists[event.moved.newIndex].id}/move`,
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
      }
    });
  }
})