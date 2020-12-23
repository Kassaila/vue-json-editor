<template>
  <div class="object-view__container">
    <draggable
      v-model="currentData"
      class="object-view__drag"
      handle="[data-dragbar]"
      @end="dragEnd"
    >
      <div
        v-for="(item, index) in currentData"
        :key="`${item.type}-${index}`"
        class="object-view"
        :class="{
          'object-view_list': item.type === 'object' || item.type === 'array',
          'object-view--collapsed': collapsedList[index],
        }"
      >
        <div class="object-view__key">
          <button
            v-if="item.type === 'object' || item.type === 'array'"
            type="button"
            class="json-editor__btn json-editor__btn_icon"
            aria-controls="trigger"
            :aria-expanded="!collapsedList[index] ? 'true' : 'false'"
            @click="toggleList(index)"
          >
            <b>
              <slot name="icon-collapse"
                ><span
                  class="btn-icon btn-icon_collapse"
                  :title="collapsedList[index] ? 'Expand' : 'Collapse'"
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
            @blur="checkKey(item, $event)"
          />
          <i v-else>{{ index }}. </i>
        </div>
        <div class="object-view__value" v-show="!collapsedList[index]">
          <item-view
            v-if="item.type === 'object' || item.type === 'array'"
            :object-type="item.type"
            :parsed-data="item.childParams"
            v-model="item.childParams"
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
          <select v-model="item.type" class="json-editor__select" @change="changeType(item, index)">
            <option v-for="(type, index) in typesList" :value="type" :key="index">
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
            @click="deleteItem(parsedData, item, index)"
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
      @add-new-item="createItem"
      @cancel-new-item="toggleForm"
      :required-key="objectType !== 'array'"
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
      required: false,
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
      collapsedList: {},
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
      if (this.collapsedList[index]) this.collapsedList[index] = false;
      this.$emit('input', this.currentData);
    },
    toggleList(index) {
      this.$set(this.collapsedList, index, this.collapsedList[index] ? false : true);
    },
    createItem(item) {
      const newItem = {
        childParams: null,
        name: this.objectType === 'object' ? item.key : null,
        remark: null,
        type: item.type,
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
    checkKey(item, e) {
      if (item.name.length === 0) {
        this.placeholderKey = 'cannot be empty';
        e.target.focus();
      } else if (!isNaN(Number(item.name[0]))) {
        item.name = '';
        this.placeholderKey = 'not correct key';
        e.target.focus();
      }
    },
    changeType(item, index) {
      switch (item.type) {
        case 'array':
        case 'object':
          item.childParams = [];
          item.remark = null;
          break;
        case 'string':
          item.remark = '';
          this.collapsedList[index] = false;
          break;
        case 'number':
          item.remark = 0;
          this.collapsedList[index] = false;
          break;
        case 'boolean':
          item.remark = true;
          this.collapsedList[index] = false;
          break;
        case 'null':
          item.remark = null;
          this.collapsedList[index] = false;
          break;
        default:
          break;
      }
    },
  },
};
</script>
