import Vue from 'vue';
import JsonEditor from '../../dist/vue-json-editor';
import App from './App.vue';

Vue.use(JsonEditor);

new Vue({
  el: '#app',
  render: (h) => h(App),
});
