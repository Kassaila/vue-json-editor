<template>
  <object-view
    :object-type="rootType"
    :parsed-data="currentData"
    v-model="currentData"
  ></object-view>
</template>

<script>
import ObjectView from "./object-view.vue";

export default {
  name: "JsonEditor",
  components: {
    "object-view": ObjectView,
  },
  props: {
    dataObject: {
      type: Object | Array,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {
          confirmText: "confirm",
          cancelText: "cancel",
        };
      },
    },
  },
  provide() {
    return {
      typesList: ["object", "array", "string", "number", "boolean", "null"],
      formBtnText: this.options,
    };
  },
  data() {
    return {
      currentData: [],
      cachedData: {},
    };
  },
  watch: {
    dataObject: {
      handler() {
        this.currentData = this.parseJson(this.dataObject);
      },
    },
    currentData: {
      deep: true,
      handler() {
        const newDataStr = JSON.stringify(this.currentData);

        if (newDataStr === JSON.stringify(this.cachedData)) return;

        this.cachedData = JSON.parse(newDataStr);

        this.$emit("input", this.buildJson(this.currentData));
      },
    },
  },
  methods: {
    parseJson(dataObject) {
      const parseItem = (key, value, type) => {
        const item = {
          name: type === "object" ? key : null,
          type: this.getType(value),
          remark: null,
          childParams: null,
        };

        switch (item.type) {
          case "object":
          case "array":
            item.childParams = parseObject(value, item.type);
            break;
          case "transform":
            item.type = "string";
            item.remark = value.toString();
            break;
          default:
            item.remark = value;
            break;
        }

        return item;
      };

      const parseObject = (object, type) => {
        return Object.entries(object).map(([key, value]) =>
          parseItem(key, value, type)
        );
      };

      return parseObject(dataObject, this.rootType);
    },

    getType(object) {
      switch (Object.prototype.toString.call(object)) {
        case "[object Array]":
          return "array";
          break;
        case "[object Object]":
          return "object";
          break;
        case "[object Null]":
        case "[object Undefined]":
          return "null";
          break;
        case "[object Date]":
        case "[object RegExp]":
        case "[object Function]":
          return "transform";
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
            case "array":
            case "object":
              const value = buildObject(item.childParams, item.type);

              return item.name !== null ? [item.name, value] : value;
              break;
            default:
              return item.name !== null
                ? [item.name, item.remark]
                : item.remark;
              break;
          }
        });

        switch (type) {
          case "array":
            return buildData;
            break;
          case "object":
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
      return this.getType(this.dataObject);
    },
  },
  mounted() {
    this.currentData = this.parseJson(this.dataObject);
    this.$emit("input", this.buildJson(this.currentData));
  },
};
</script>

<style lang="less">
@import "./assets/styles/common.less";
</style>
