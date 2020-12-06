<template>
  <div class="wrapper">
    <h1 class="page-title">vue-json-editor</h1>
    <div class="container">
      <div class="editor">
        <json-editor
          :options="{
            confirmText: 'confirm',
            cancelText: 'cancel',
          }"
          :data-object="jsonData"
          v-model="jsonData"
        ></json-editor>
      </div>
      <div class="code">
        <code>{{ codeJson }}</code>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      jsonData: {
        name: 'Jack',
        age: 23,
        address: [
          'Iceland',
          {
            city: 'Reykjavík',
          },
        ],
        ohters: {
          id: 1246,
          time: new Date(),
          description: 'another',
          pattern: /daf/g,
        },
      },
    };
  },
  methods: {
    //JSON format print
    formatJson(txt, compress) {
      var indentChar = '  ';
      if (/^\s*$/.test(txt)) {
        console.error('The data is empty and cannot be formatted!');
        return;
      }
      try {
        var data = eval('(' + txt + ')');
      } catch (e) {
        throw `Data source syntax error, formatting failed! Error message: ${e.description}`;
        return;
      }
      var draw = [],
        last = false,
        This = this,
        line = compress ? '' : '\n',
        nodeCount = 0,
        maxDepth = 0;

      var notify = function (name, value, isLast, indent, formObj) {
        nodeCount++;
        for (var i = 0, tab = ''; i < indent; i++) tab += indentChar;
        tab = compress ? '' : tab;
        maxDepth = ++indent;
        if (value && value.constructor == Array) {
          draw.push(tab + (formObj ? '"' + name + '":' : '') + '[' + line);
          for (var i = 0; i < value.length; i++)
            notify(i, value[i], i == value.length - 1, indent, false);
          draw.push(tab + ']' + (isLast ? line : ',' + line));
        } else if (value && typeof value == 'object') {
          draw.push(tab + (formObj ? '"' + name + '":' : '') + '{' + line);
          var len = 0,
            i = 0;
          for (var key in value) len++;
          for (var key in value) notify(key, value[key], ++i == len, indent, true);
          draw.push(tab + '}' + (isLast ? line : ',' + line));
        } else {
          if (typeof value == 'string') value = '"' + value + '"';
          draw.push(tab + (formObj ? '"' + name + '":' : '') + value + (isLast ? '' : ',') + line);
        }
      };
      var isLast = true,
        indent = 0;
      notify('', data, isLast, indent, false);

      return draw.join('');
    },
  },
  computed: {
    codeJson() {
      return this.formatJson(JSON.stringify(this.jsonData));
    },
  },
};
</script>
<style lang="scss">
.page-title {
  text-align: center;
}
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 30px;
}
.code {
  padding: 20px;
  border-radius: 5px;
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.25);
  .json {
    white-space: pre-wrap;
  }
}
</style>
