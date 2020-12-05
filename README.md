# vue-json-editor

JSON visual editor - built as a Vue.js component. Provides a basic GUI

## **[Demo preview](https://github.com/Kassaila/vue-json-editor)**

## Getting Started

```
npm i @kassaila/vue-json-editor
```

## Usage

```javascript
import Vue from 'vue';
import JsonEditor from 'vue-json-editor';

Vue.use(JsonEditor);
```

### Props

- `obj-data` - json data
- `options`
  - `confirmText` - strings of the confirm button
  - `cancelText` - strings of the cancel button

## Example

Single file component

```html
<template>
  <json-editor
    :options="{
            confirmText: 'confirm',
            cancelText: 'cancel',
        }"
    :obj-data="jsonData"
    v-model="jsonData"
  >
  </json-editor>
</template>
<script>
  export default {
      ...
      data() {
          return {
              jsonData: {
                  name: 'mike',
                  age: 23,
                  phone: '18552129932',
                  address: ['AAA C1', 'BBB C2']
              }
          }
      }
  }
</script>
```
