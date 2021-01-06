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
              <i v-if="item.type === 'object'">{{ `{ ${item.childParams.length} }` }}</i>
              <i v-if="item.type === 'array'">{{ `[ ${item.childParams.length} ]` }}</i>
            </b>
          </button>
          <input
            v-if="item.name !== null"
            v-model.trim="item.name"
            type="text"
            :placeholder="placeholderKey"
            class="json-editor__input key__input"
            @blur="checkItem(item, $event)"
          />
          <i v-else>{{ i }}. </i>
        </div>
        <div v-show="!item.collapsed" class="object-view__value">
          <item-view
            v-if="item.type === 'object' || item.type === 'array'"
            v-model="item.childParams"
            :object-type="item.type"
            :parsed-data="item.childParams"
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
              v-model.trim="item.remark"
              type="text"
              class="json-editor__input value__input"
            />
            <input
              v-if="item.type === 'number'"
              v-model.number="item.remark"
              type="number"
              class="json-editor__input value__input"
              step="0.1e-100"
            />
            <select
              v-if="item.type === 'boolean'"
              v-model="item.remark"
              class="json-editor__select value__input"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </template>
        </div>
        <div class="object-view__tools">
          <select v-model="item.type" class="json-editor__select" @change="item = changeType(item)">
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
      :required-key="objectType !== 'array'"
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
import ItemForm from './item-form.vue';

export default {
  name: 'ItemView',
  components: {
    draggable,
    ItemForm,
  },
  inject: ['typesList'],
  props: {
    objectType: {
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
      placeholderKey: 'key',
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
    deleteItem(parentDom, item, index) {
      this.currentData.splice(index, 1);
      this.$emit('input', this.currentData);
    },
    createItem(item) {
      const newItem = {
        name: this.objectType === 'object' ? item.key : null,
        type: item.type,
        remark: null,
        childParams: null,
        collapsed: false,
      };

      switch (newItem.type) {
        case 'array':
        case 'object':
          newItem.childParams = item.value;
          break;
        default:
          newItem.remark = item.value;
          break;
      }

      this.currentData.push(newItem);
      this.$emit('input', this.currentData);
      this.toggleForm();
    },
    toggleForm() {
      this.itemForm = !this.itemForm;
    },
    dragEnd() {
      this.$emit('input', this.currentData);
    },
    checkItem(item, e) {
      if (!this.checkKey(item)) e.target.focus();
    },
    checkKey(item) {
      if (item.name.length === 0) {
        this.placeholderKey = 'cannot be empty';
        return false;
      }
      if (item.name[0].match(/[a-zA-Z_]/) === null) {
        item.name = '';
        this.placeholderKey = 'not correct key';
        return false;
      }

      this.placeholderKey = 'key';
      return true;
    },
    changeType(item) {
      switch (item.type) {
        case 'array':
        case 'object':
          item.childParams = [];
          item.remark = null;
          break;
        case 'string':
          item.remark = '';
          item.collapsed = false;
          break;
        case 'number':
          item.remark = 0;
          item.collapsed = false;
          break;
        case 'boolean':
          item.remark = true;
          item.collapsed = false;
          break;
        case 'null':
          item.remark = null;
          item.collapsed = false;
          break;
        default:
          break;
      }
    },
  },
};
</script>
