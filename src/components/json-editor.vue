<template>
  <object-view
    v-model="currentData"
    :object-type="rootType"
    :parsed-data="currentData"
    class="json-editor"
  >
    <template #icon-add>
      <slot name="icon-add"> </slot>
    </template>
    <template #icon-delete>
      <slot name="icon-delete"> </slot>
    </template>
    <template #icon-drag>
      <slot name="icon-drag"> </slot>
    </template>
    <template #icon-collapse>
      <slot name="icon-collapse"> </slot>
    </template>
  </object-view>
</template>
<script>
import ObjectView from './object-view.vue';

export default {
  name: 'JsonEditor',
  components: {
    ObjectView,
  },
  props: {
    dataInput: {
      type: Object | Array,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  provide() {
    return {
      typesList: ['object', 'array', 'string', 'number', 'boolean', 'null'],
      options: this.options,
    };
  },
  data() {
    return {
      currentData: [],
      cachedData: {},
    };
  },
  watch: {
    dataInput: {
      handler() {
        this.currentData = this.parseJson(this.dataInput);
      },
    },
    currentData: {
      deep: true,
      handler() {
        const newDataStr = JSON.stringify(this.currentData);

        if (newDataStr === JSON.stringify(this.cachedData)) return;

        this.cachedData = JSON.parse(newDataStr);

        this.$emit('data-output', this.buildJson(this.currentData));
      },
    },
  },
  methods: {
    parseJson(dataInput) {
      const parseItem = (key, value, type) => {
        const item = {
          name: type === 'object' ? key : null,
          type: this.getType(value),
          remark: null,
          childParams: null,
        };

        switch (item.type) {
          case 'object':
          case 'array':
            item.childParams = parseObject(value, item.type);
            break;
          case 'transform':
            item.type = 'string';
            item.remark = value.toString();
            break;
          default:
            item.remark = value;
            break;
        }

        return item;
      };

      const parseObject = (object, type) => {
        return Object.entries(object).map(([key, value]) => parseItem(key, value, type));
      };

      return parseObject(dataInput, this.rootType);
    },

    getType(object) {
      switch (Object.prototype.toString.call(object)) {
        case '[object Array]':
          return 'array';
          break;
        case '[object Object]':
          return 'object';
          break;
        case '[object Null]':
        case '[object Undefined]':
          return 'null';
          break;
        case '[object Date]':
        case '[object RegExp]':
        case '[object Function]':
          return 'transform';
          break;
        default:
          return typeof object;
          break;
      }
    },

    buildJson(dataTree) {
      const buildObject = (data, type) => {
        const buildData = data.map((item, i) => {
          switch (item.type) {
            case 'array':
            case 'object':
              const value = buildObject(item.childParams, item.type);

              return item.name !== null ? [item.name, value] : value;
              break;
            default:
              return item.name !== null ? [item.name, item.remark] : item.remark;
              break;
          }
        });

        switch (type) {
          case 'array':
            return buildData;
            break;
          case 'object':
            return Object.fromEntries(buildData);
            break;
          default:
            return buildData[0];
            break;
        }
      };

      return buildObject(dataTree, this.rootType);
    },
  },
  computed: {
    rootType() {
      return this.getType(this.dataInput);
    },
  },
  mounted() {
    this.currentData = this.parseJson(this.dataInput);
    this.$emit('data-output', this.buildJson(this.currentData));
  },
};
</script>
<style lang="scss">
@import '../styles/common.scss';
</style>
