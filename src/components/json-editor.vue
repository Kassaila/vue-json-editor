<template>
  <div class="json-editor">
    <div
      class="object-view"
      :class="{
        'object-view_list': base.type === 'object' || base.type === 'array',
        'object-view--collapsed': base.collapsed,
      }"
    >
      <div class="object-view__key">
        <button
          v-if="base.type === 'object' || base.type === 'array'"
          type="button"
          class="json-editor__btn json-editor__btn_icon"
          aria-controls="trigger"
          :aria-expanded="!base.collapsed ? 'true' : 'false'"
          @click="base.collapsed = !base.collapsed"
        >
          <b>
            <slot name="icon-collapse">
              <span
                class="btn-icon btn-icon_collapse"
                :title="base.collapsed ? 'Expand' : 'Collapse'"
                >^</span
              >
            </slot>
            <i v-if="base.type === 'object'">{{ `{ ${currentData.length} }` }}</i>
            <i v-if="base.type === 'array'">{{ `[ ${currentData.length} ]` }}</i>
          </b>
        </button>
        <span class="json-editor__input key__input"><i>root</i></span>
      </div>
      <div class="object-view__value" v-show="!base.collapsed">
        <item-view
          v-if="base.type === 'object' || base.type === 'array'"
          v-model="currentData"
          :object-type="base.type"
          :parsed-data="currentData"
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
        </item-view>
        <template v-else>
          <span v-if="base.type === 'null'" class="json-editor__input value__input">null</span>
          <input
            v-if="base.type === 'string'"
            v-model.trim="currentData"
            type="text"
            class="json-editor__input value__input"
          />
          <input
            v-if="base.type === 'number'"
            v-model.number="currentData"
            type="number"
            class="json-editor__input value__input"
            step="0.1e-100"
          />
          <select
            v-if="base.type === 'boolean'"
            v-model="currentData"
            class="json-editor__select value__input"
          >
            <option :value="true">true</option>
            <option :value="false">false</option>
          </select>
        </template>
      </div>
      <div class="object-view__tools">
        <select v-model="base.type" class="json-editor__select" @change="changeBaseType">
          <option v-for="(type, index) in base.typesList" :value="type" :key="index">
            {{ type }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import ItemView from './item-view.vue';

const typesList = ['object', 'array', 'string', 'number', 'boolean', 'null'];

export default {
  name: 'JsonEditor',
  components: {
    ItemView,
  },
  props: {
    dataInput: {
      type: Object | Array,
      required: false,
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
      typesList: typesList,
      options: this.options,
    };
  },
  data() {
    return {
      base: {
        collapsed: false,
        typesList: typesList,
        type: this.getType(this.dataInput),
      },
      currentData: [],
      cachedData: {},
    };
  },
  watch: {
    dataInput: {
      handler() {
        this.processingData();
      },
    },
    currentData: {
      deep: true,
      handler() {
        const newDataStr = JSON.stringify(this.currentData);

        if (newDataStr === JSON.stringify(this.cachedData)) return;

        this.cachedData = JSON.parse(newDataStr);

        this.emitOutputData();
      },
    },
  },
  methods: {
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

      return parseObject(dataInput, this.base.type);
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

      return buildObject(dataTree, this.base.type);
    },
    processingData() {
      switch (this.base.type) {
        case 'array':
        case 'object':
          this.currentData = this.parseJson(this.dataInput);
          break;
        case 'transform':
          this.currentData = this.dataInput.toString();
          break;
        default:
          this.currentData = this.dataInput;
          break;
      }
    },
    emitOutputData() {
      switch (this.base.type) {
        case 'array':
        case 'object':
          this.$emit('data-output', this.buildJson(this.currentData));
          break;
        default:
          this.$emit('data-output', this.currentData);
          break;
      }
    },
    changeBaseType() {
      switch (this.base.type) {
        case 'array':
          this.currentData = this.parseJson([]);
          break;
        case 'object':
          this.currentData = this.parseJson({});
          break;
        case 'number':
          this.currentData = 0;
          break;
        case 'string':
          this.currentData = '';
          break;
        case 'boolean':
          this.currentData = true;
          break;
        case 'null':
          this.currentData = null;
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.processingData();
    this.emitOutputData();
  },
};
</script>
