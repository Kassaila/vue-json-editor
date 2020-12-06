<template>
  <div class="block_content">
    <draggable v-model="currentData" handle="[data-dragbar]" @end="dragEnd">
      <div
        v-for="(item, index) in currentData"
        :key="`${item.type}-${index}`"
        class="block"
        :class="{ 'hide-block': hidenBlocks[index] }"
      >
        <span class="json-key">
          <button
            v-if="item.type === 'object' || item.type === 'array'"
            type="button"
            class="json-editor__btn json-editor__btn_collapse"
            :data-collapsed="hidenBlocks[index]"
            @click="toggleBlock(index)"
          >
            <span class="btn-icon" :title="hidenBlocks[index] ? 'Expand' : 'Collapse'">^</span>
          </button>
          <i v-if="item.type === 'object'">{{ `{ ${item.childParams.length} }` }}</i>
          <i v-if="item.type === 'array'">{{ `[ ${item.childParams.length} ]` }}</i>
          <input
            v-if="item.name !== null"
            v-model="item.name"
            type="text"
            placeholder="cannot be empty"
            class="key-input"
            @blur="blurKeyInput(item, $event)"
          />
          <i v-else>{{ index }}. </i>
        </span>
        <span class="json-val">
          <template v-if="item.type === 'object' || item.type === 'array'">
            <object-view
              :object-type="item.type"
              :parsed-data="item.childParams"
              v-model="item.childParams"
            ></object-view>
          </template>
          <template v-else>
            <span class="val">
              <span v-if="item.type === 'null'" class="val-input">null</span>
              <input
                v-if="item.type === 'string'"
                v-model="item.remark"
                type="text"
                class="val-input"
              />
              <input
                v-if="item.type === 'number'"
                v-model.number="item.remark"
                type="number"
                class="val-input"
                @input="changeInputNumber(item)"
              />
              <select v-if="item.type === 'boolean'" v-model="item.remark" class="val-input">
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>
            </span>
          </template>
        </span>

        <div class="tools">
          <select v-model="item.type" class="tools-types" @change="changeItemType(item, index)">
            <option v-for="(type, index) in typesList" :value="type" :key="index">
              {{ type }}
            </option>
          </select>
          <button type="button" class="json-editor__btn json-editor__btn_drag" data-dragbar>
            <span class="btn-icon" title="Move">=</span>
          </button>
          <button
            type="button"
            class="json-editor__btn json-editor__btn_delete"
            @click="deleteItem(parsedData, item, index)"
          >
            <span class="btn-icon" title="Delete">-</span>
          </button>
        </div>
      </div>
    </draggable>

    <new-item-form
      v-if="itemForm"
      @add-new-item="createItem"
      @cancel-new-item="toggleItemForm"
      :requiredKey="objectType !== 'array'"
    ></new-item-form>

    <button
      v-if="!itemForm"
      type="button"
      class="json-editor__btn json-editor__btn_add"
      @click="toggleItemForm"
    >
      <span class="btn-icon" title="Add">+</span>
    </button>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import NewItemForm from './new-item-form.vue';

export default {
  name: 'ObjectView',
  components: {
    draggable,
    NewItemForm,
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
      hidenBlocks: {},
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
      if (this.hidenBlocks[index]) this.hidenBlocks[index] = false;
      this.$emit('input', this.currentData);
    },

    toggleBlock(index) {
      this.$set(this.hidenBlocks, index, this.hidenBlocks[index] ? false : true);
    },

    toggleItemForm() {
      this.itemForm = !this.itemForm;
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
      this.toggleItemForm();
    },
    blurKeyInput(item, e) {
      if (item.name.length === 0) {
        e.target.focus();
      }
    },
    dragEnd() {
      this.$emit('input', this.currentData);
    },
    changeItemType(item, index) {
      switch (item.type) {
        case 'array':
        case 'object':
          item.childParams = [];
          item.remark = null;
          break;
        case 'string':
          item.remark = '';
          this.hidenBlocks[index] = false;
          break;
        case 'number':
          item.remark = 0;
          this.hidenBlocks[index] = false;
          break;
        case 'boolean':
          item.remark = true;
          this.hidenBlocks[index] = false;
          break;
        case 'null':
          item.remark = null;
          this.hidenBlocks[index] = false;
          break;
        default:
          break;
      }
    },
    changeInputNumber(item) {
      if (item.remark !== '') {
        item.remark = item.remark ?? 0;
      } else {
        item.remark = 0;
      }
    },
  },
};
</script>
