<template>
  <div class="wrapper">
    <h1 class="page-title">Vue JSON visual editor</h1>
    <div class="container">
      <div class="json-editor">
        <json-editor
          :data-input="dataInput"
          @data-output="(data) => (dataOutput = data)"
        ></json-editor>
      </div>
      <div class="json-output">
        <vue-json-pretty :data="dataOutput"> </vue-json-pretty>
      </div>
    </div>
  </div>
</template>
<script>
import JsonEditor from '../../dist/vue-json-editor';
import VueJsonPretty from 'vue-json-pretty';

export default {
  name: 'app',
  components: {
    JsonEditor,
    VueJsonPretty,
  },
  data() {
    return {
      dataInput: {
        name: 'Taras',
        age: 28,
        address: [
          'Ukraine',
          {
            city: 'Kharkiv',
          },
        ],
        others: {
          id: 1246,
          time: new Date(),
          description: 'last example run',
          pattern: /abc/g,
        },
      },
      dataOutput: {},
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
  align-items: flex-start;
  padding: 30px;
}
.json {
  &-output {
    padding: 20px;
    border-radius: 5px;
    box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.25);
  }
}
</style>
