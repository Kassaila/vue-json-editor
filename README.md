# vue-json-editor

> JSON visual editor - built as a Vue.js component. Provides a basic GUI

Please preview - [demo example](https://kassaila.github.io/vue-json-editor/)

## Install

Install package from `npm`:

```
npm i @kassaila/vue-json-editor
```

## Usage

Single file component

```html
<template>
  <json-editor
  :data-input="dataInput"
  @data-output="(data) => (dataOutput = data)">
  </json-editor>
</template>
<script>
  import JsonEditor from '@kassaila/vue-json-editor';

  export default {
      ...
      components: {
        JsonEditor,
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
                  time: new Date()
                  description: 'last example run',
                  pattern: /abc/g,
                },
              },
              dataOutput: {},
          };
      },
  }
</script>
```

## Capability

| Name | Options | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `data-input` | `props` | `Object` or `Array` | `true` | Input data |
| `options` | `props` | `Object` | `false` | Reserved (now empty) |
| `data-output` | `event` | `Object` or `Array` | - | Output data, return modified data |
| `icon-add` | `slot` | `<template>` | `false` | Icon for button - add new item |
| `icon-delete` | `slot` | `<template>` | `false` | Icon for button - delete item |
| `icon-drag` | `slot` | `<template>` | `false` | Icon for dragbar |
| `icon-collapse` | `slot` | `<template>` | `false` | Icon for button - collapse object list |

For for some types of the data, like `Date`, `RegExp`, `Function` will be applied transformation to `string` (by the method `.toString()`)

This is a modified version of the fork [vue-json-edit](https://github.com/jinkin1995/vue-json-edit)
