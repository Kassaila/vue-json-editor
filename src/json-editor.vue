<template>
  <object-view :parsed-data="currentData" v-model="currentData"></object-view>
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
      formBtnText: this.options,
    };
  },
  data() {
    return {
      rootType: "object",
      currentData: this.parseJson(this.dataObject),
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
      handler(newData) {
        const newDataStr = JSON.stringify(newData);

        if (newDataStr === JSON.stringify(this.cachedData)) return;

        this.cachedData = JSON.parse(newDataStr);

        this.$emit("input", this.buildJson(this.currentData));
      },
    },
  },
  methods: {
    parseJson(jsonStr) {
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

      const parseObject = (json, objectType) => {
        return Object.entries(json).map(([key, value]) =>
          parseItem(key, value, objectType)
        );
      };

      const parseRoot = (data) => {
        this.rootType = this.getType(data);

        return parseObject(data, this.rootType);
      };

      return parseRoot(jsonStr);
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

    buildJson(dataArr) {
      const revertWithObj = (data) => {
        let r = {};
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let key, val;
          key = el.name;
          if (el.type == "array") {
            val = revertWithArray(el.childParams);
          } else if (el.type == "object") {
            val = revertWithObj(el.childParams);
          } else {
            val = el.remark;
          }

          r[key] = val;
        }
        return r;
      };

      const revertWithArray = (data) => {
        let arr = [];
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let r;
          if (el.type == "array") {
            r = revertWithArray(el.childParams);
          } else if (el.type == "object") {
            r = revertWithObj(el.childParams);
          } else {
            r = el.remark;
          }

          arr.push(r);
        }
        return arr;
      };

      const revertMain = (data) => {
        switch (this.rootType) {
          case "array":
            return revertWithArray(data);
            break;
          case "object":
            return revertWithObj(data);
            break;
        }
      };

      return revertMain(dataArr);
    },
  },
  mounted() {
    this.$emit("input", this.buildJson(this.currentData));
  },
};
</script>

<style lang="less">
@import "./assets/styles/common.less";
</style>
