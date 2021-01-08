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
      <div v-show="!base.collapsed" class="object-view__value">
        <item-view
          v-if="base.type === 'object' || base.type === 'array'"
          v-model="currentData"
          :item-type="base.type"
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
        <select
          v-model="base.type"
          class="json-editor__select"
          @change="currentData = changeType(base.type)"
        >
          <option v-for="(type, index) in base.typesList" :key="index" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { changeType, getType } from '../helpers/data-handling';
import Item from '../helpers/item';
import ItemView from './item-view.vue';

const typesList = ['object', 'array', 'string', 'number', 'boolean', 'null'];

export default {
  name: 'JsonEditor',
  components: {
    ItemView,
  },
  provide() {
    return {
      typesList,
      options: this.options,
    };
  },
  props: {
    dataInput: {
      type: [String, Number, Boolean, Array, Object],
      default() {
        return null;
      },
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      base: {
        collapsed: false,
        typesList,
        type: this.getType(this.dataInput),
        cachedType: `${this.type}`,
      },
      currentData: [],
      cachedData: [],
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

        if (
          newDataStr === JSON.stringify(this.cachedData) &&
          this.base.type === this.base.cachedType
        )
          return;

        this.base.cachedType = `${this.base.type}`;

        this.cachedData = JSON.parse(newDataStr);

        this.emitOutputData();
      },
    },
  },
  mounted() {
    this.processingData();
    this.emitOutputData();
  },
  methods: {
    changeType,
    getType,
    buildObject(data, type) {
      const buildData = data.map((item) => {
        switch (item.type) {
          case 'array':
          case 'object':
            return item.key !== null
              ? [item.key, this.buildObject(item.value, item.type)]
              : this.buildObject(item.value, item.type);
          default:
            return item.key !== null ? [item.key, item.value] : item.value;
        }
      });

      switch (type) {
        case 'array':
          return buildData;
        case 'object':
          return Object.fromEntries(buildData);
        default:
          return buildData[0];
      }
    },
    processingData() {
      this.currentData = Item.processValue(this.dataInput, this.base.type);
    },
    emitOutputData() {
      switch (this.base.type) {
        case 'array':
        case 'object':
          this.$emit('data-output', this.buildObject(this.currentData, this.base.type));
          break;
        default:
          this.$emit('data-output', this.currentData);
          break;
      }
    },
  },
};
</script>
