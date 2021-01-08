<template>
  <div class="json-editor">
    <div
      class="object-view"
      :class="{
        'object-view_list': item.type === 'object' || item.type === 'array',
        'object-view--collapsed': item.collapsed,
      }"
    >
      <div class="object-view__key">
        <button
          v-if="item.type === 'object' || item.type === 'array'"
          type="button"
          class="json-editor__btn json-editor__btn_icon"
          aria-controls="trigger"
          :aria-expanded="!item.collapsed ? 'true' : 'false'"
          @click="item.collapsed = !item.collapsed"
        >
          <b>
            <slot name="icon-collapse">
              <span
                class="btn-icon btn-icon_collapse"
                :title="item.collapsed ? 'Expand' : 'Collapse'"
                >^</span
              >
            </slot>
            <i v-if="item.type === 'object'">{{ `{ ${item.value.length} }` }}</i>
            <i v-if="item.type === 'array'">{{ `[ ${item.value.length} ]` }}</i>
          </b>
        </button>
        <span class="json-editor__input key__input"
          ><i>{{ item.key }}</i></span
        >
      </div>
      <div v-show="!item.collapsed" class="object-view__value">
        <item-view
          v-if="item.type === 'object' || item.type === 'array'"
          v-model="item.value"
          :item-type="item.type"
          :parsed-data="item.value"
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
          <span v-if="item.type === 'null'" class="json-editor__input value__input">null</span>
          <input
            v-if="item.type === 'string'"
            v-model.trim="item.value"
            type="text"
            class="json-editor__input value__input"
          />
          <input
            v-if="item.type === 'number'"
            v-model.number="item.value"
            type="number"
            class="json-editor__input value__input"
            step="0.1e-100"
          />
          <select
            v-if="item.type === 'boolean'"
            v-model="item.value"
            class="json-editor__select value__input"
          >
            <option :value="true">true</option>
            <option :value="false">false</option>
          </select>
        </template>
      </div>
      <div class="object-view__tools">
        <select v-model="item.type" class="json-editor__select" @change="item.changeType()">
          <option v-for="(type, i) in typesList" :key="i" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
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
      item: new Item({ key: 'root', value: this.dataInput }, 'object'),
      cache: {
        value: null,
        type: 'null',
      },
      typesList,
    };
  },
  watch: {
    item: {
      deep: true,
      handler() {
        const newValue = JSON.stringify(this.item.value);

        if (newValue === JSON.stringify(this.cache.value) && this.item.type === this.cache.type)
          return;

        this.cache.type = `${this.item.type}`;

        this.cache.value = JSON.parse(newValue);

        this.$emit('data-output', this.item.buildItem());
      },
    },
  },
  mounted() {
    this.$emit('data-output', this.item.buildItem());
  },
};
</script>
