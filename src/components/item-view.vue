<template>
  <div class="object-view__container">
    <draggable
      v-model="currentData"
      class="object-view__drag"
      handle="[data-dragbar]"
      @end="dragEnd"
    >
      <div
        v-for="(item, i) in currentData"
        :key="`${item.type}-${i}`"
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
              <slot name="icon-collapse"
                ><span
                  class="btn-icon btn-icon_collapse"
                  :title="item.collapsed ? 'Expand' : 'Collapse'"
                  >^</span
                ></slot
              >
              <i v-if="item.type === 'object'">{{ `{ ${item.value.length} }` }}</i>
              <i v-if="item.type === 'array'">{{ `[ ${item.value.length} ]` }}</i>
            </b>
          </button>
          <input
            v-if="item.key !== null"
            v-model.trim="item.key"
            type="text"
            :placeholder="item.placeholder"
            class="json-editor__input key__input"
            @blur="checkItemKey(item, $event)"
          />
          <i v-else>{{ i }}. </i>
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
          <select
            v-model="item.type"
            class="json-editor__select"
            @change="item = changeItemType(item)"
          >
            <option v-for="(type, j) in typesList" :key="j" :value="type">
              {{ type }}
            </option>
          </select>
          <button type="button" class="json-editor__btn json-editor__btn_icon" data-dragbar>
            <slot name="icon-drag">
              <span class="btn-icon btn-icon_drag" title="Move">=</span>
            </slot>
          </button>
          <button
            type="button"
            class="json-editor__btn json-editor__btn_icon"
            @click="deleteItem(parsedData, item, i)"
          >
            <slot name="icon-delete">
              <span class="btn-icon btn-icon_delete" title="Delete">-</span>
            </slot>
          </button>
        </div>
      </div>
    </draggable>

    <item-form
      v-if="itemForm"
      :required-key="itemType !== 'array'"
      @add-new-item="createItem"
      @cancel-new-item="toggleForm"
    ></item-form>

    <button
      v-if="!itemForm"
      type="button"
      class="json-editor__btn json-editor__btn_icon"
      @click="toggleForm"
    >
      <slot name="icon-add">
        <span class="btn-icon btn-icon_add" title="Add">+</span>
      </slot>
    </button>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { changeType, checkKey } from '../helpers/data-handling';
import ItemForm from './item-form.vue';

export default {
  name: 'ItemView',
  components: {
    draggable,
    ItemForm,
  },
  inject: ['typesList'],
  props: {
    itemType: {
      type: String,
      required: true,
    },
    parsedData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentData: this.parsedData ?? [],
      itemForm: false,
    };
  },
  watch: {
    parsedData: {
      handler() {
        this.currentData = this.parsedData;
      },
    },
  },
  methods: {
    changeType,
    checkKey,
    deleteItem(parentDom, item, index) {
      this.currentData.splice(index, 1);
      this.$emit('input', this.currentData);
    },
    createItem(item) {
      this.currentData.push(item);
      this.$emit('input', this.currentData);
      this.toggleForm();
    },
    toggleForm() {
      this.itemForm = !this.itemForm;
    },
    dragEnd() {
      this.$emit('input', this.currentData);
    },
    checkItemKey(item, e) {
      if (!this.checkKey(item)) e.target.focus();
    },
    changeItemType(item) {
      if (item.type !== 'object' && item.type !== 'array') {
        item.collapsed = false;
      }

      item.value = this.changeType(item.type);
    },
  },
};
</script>
