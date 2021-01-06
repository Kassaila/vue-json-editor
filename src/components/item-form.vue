<template>
  <form class="new-item-form" @submit.prevent="submit">
    <div class="new-item-form__group">
      <input
        v-if="requiredKey"
        v-model.trim="item.key"
        type="text"
        :placeholder="placeholderKey"
        class="json-editor__input new-item-form__input"
      />
      <template v-if="item.type !== 'array' && item.type !== 'object'">
        <span v-if="item.type === 'null'" class="json-editor__input new-item-form__input"
          >null</span
        >
        <input
          v-if="item.type === 'string'"
          v-model.trim="item.value"
          type="text"
          placeholder="value"
          class="json-editor__input new-item-form__input"
        />
        <input
          v-if="item.type === 'number'"
          v-model.number="item.value"
          type="number"
          placeholder="value"
          class="json-editor__input new-item-form__input"
          step="0.1e-100"
        />
        <select
          v-if="item.type === 'boolean'"
          v-model="item.value"
          class="json-editor__select new-item-form__input"
        >
          <option :value="true">true</option>
          <option :value="false">false</option>
        </select>
      </template>
      <select
        v-once
        v-model="item.type"
        class="json-editor__select"
        @change="item.value = changeType(item.type)"
      >
        <option v-for="(type, index) in typesList" :key="index" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="new-item-form__group new-item-form__group_btns">
      <button type="submit" class="json-editor__btn new-item-form__btn">Add</button>
      <button type="button" class="json-editor__btn new-item-form__btn" @click="cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
import { changeType } from '../helpers/data-handling';

export default {
  name: 'ItemForm',
  inject: ['typesList'],
  props: {
    requiredKey: {
      type: Boolean,
      required: false,
      "default": true,
    },
  },
  data() {
    return {
      item: {
        type: 'string',
        key: '',
        value: '',
      },
      placeholderKey: 'key',
    };
  },
  methods: {
    changeType,
    checkKey() {
      if (this.requiredKey) {
        if (this.item.key.length === 0) {
          this.placeholderKey = 'cannot be empty';
          return false;
        }
        if (this.item.key[0].match(/[a-zA-Z_]/) === null) {
          this.item.key = '';
          this.placeholderKey = 'not correct key';
          return false;
        }
      }

      return true;
    },
    submit() {
      if (!this.checkKey()) return;

      this.$emit('add-new-item', this.item);
    },
    cancel() {
      this.$emit('cancel-new-item');
    },
  },
};
</script>
