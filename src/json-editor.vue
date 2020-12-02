<template>
  <object-view :parsed-data="parsedData" v-model="parsedData"></object-view>
</template>

<script>
import ObjectView from "./object-view.vue";

export default {
  name: "JsonEditor",
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
      lastParsedData: {},
      parsedData: this.parseJson(this.dataObject),
    };
  },
  watch: {
    dataObject: {
      handler(newValue) {
        this.parsedData = this.parseJson(this.dataObject);
      },
    },
    parsedData: {
      deep: true,
      handler(newValue) {
        const strNewValue = JSON.stringify(newValue);

        if (strNewValue === JSON.stringify(this.lastParsedData)) return;

        this.lastParsedData = JSON.parse(strNewValue);

        this.$emit("input", this.buildJson(this.parsedData));
      },
    },
  },
  components: {
    "object-view": ObjectView,
  },
  methods: {
    parseJson(jsonStr) {
      const parseObject = (json, objectType) => {
        const result = [];

        new Map(Object.entries(json)).forEach((value, key) => {
          const item = {
            name: objectType === "object" ? key : null,
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

          result.push(item);
        });

        return result;
      };

      const parseBody = (data) => {
        this.rootType = this.getType(data);

        return parseObject(data, this.rootType);
      };

      return parseBody(jsonStr);
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
};
</script>

<style lang="less">
@import "./assets/styles/common.less";
</style>
