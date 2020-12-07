<template>
  <form class="new-item-form" @submit.prevent="submit">
    <div class="new-item-form__group">
      <input
        v-if="requiredKey"
        v-model="item.key"
        type="text"
        :placeholder="keyPlaceholder"
        class="json-editor__input new-item-form__input"
        @change="checkKey"
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
        />
        <select
          v-if="item.type === 'boolean'"
          v-model="item.value"
          class="json-editor__input new-item-form__input"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </template>
      <select v-once v-model="item.type" class="json-editor__select" @change="changeType">
        <option v-for="(item, index) in typesList" :value="item" :key="index">
          {{ item }}
        </option>
      </select>
    </div>

    <div class="new-item-form__group new-item-form__group_btns">
      <button type="submit" class="json-editor__btn">Add</button>
      <button type="button" class="json-editor__btn" @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'NewItemForm',
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
      keyPlaceholder: 'key',
    };
  },
  methods: {
    checkKey() {
      this.keyPlaceholder = this.item.key !== '' ? 'key' : 'cannot be empty';

      if (this.requiredKey) {
        return this.item.key !== '';
      } else {
        return true;
      }
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

      switch (this.item.type) {
        case 'number':
          this.item.value = Number(this.item.value);
          break;
        case 'boolean':
          this.item.value = this.item.value === 'true' ? true : false;
          break;
        default:
          break;
      }

      this.$emit('add-new-item', this.item);
    },
    cancel() {
      this.$emit('cancel-new-item');
    },
  },
};
</script>
