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
      <select v-once v-model="item.type" class="json-editor__select" @change="changeType">
        <option v-for="(item, index) in typesList" :value="item" :key="index">
          {{ item }}
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
export default {
  name: 'ItemForm',
  props: {
    requiredKey: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  inject: ['typesList'],
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
    checkKey() {
      if (this.requiredKey) {
        if (this.item.key.length === 0) {
          this.placeholderKey = 'cannot be empty';
          return false;
        } else if (!isNaN(Number(this.item.key[0]))) {
          this.item.key = '';
          this.placeholderKey = 'not correct key';
          return false;
        }
        return true;
      }
      return true;
    },
    changeType() {
      switch (this.item.type) {
        case 'array':
        case 'object':
          this.item.value = [];
          break;
        case 'number':
          this.item.value = 0;
          break;
        case 'boolean':
          this.item.value = true;
          break;
        case 'null':
          this.item.value = null;
          break;
        default:
          this.item.value = '';
          break;
      }
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
