<template>
  <div class="wrapper">
    <h1 class="page-title">Vue JSON visual editor</h1>
    <div class="container">
      <div class="json-editor">
        <json-editor
          :options="{
            confirmText: 'confirm',
            cancelText: 'cancel',
          }"
          :data-object="jsonData"
          v-model="jsonData"
        ></json-editor>
      </div>
      <div class="json-output">
        <vue-json-pretty :data="jsonData"> </vue-json-pretty>
      </div>
    </div>
  </div>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty';

export default {
  name: 'app',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      jsonData: {
        name: 'Taras',
        age: 28,
        address: [
          'Ukraine',
          {
            city: 'Kharkiv',
          },
        ],
        ohters: {
          id: 1246,
          time: new Date(),
          description: 'last example update',
          pattern: /abc/g,
        },
      },
    };
  },
};
</script>
<style lang="scss">
@import 'vue-json-pretty/lib/styles.css';

.page-title {
  text-align: center;
}
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 30px;
}
.json-output {
  padding: 20px;
  border-radius: 5px;
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.25);
}
</style>
