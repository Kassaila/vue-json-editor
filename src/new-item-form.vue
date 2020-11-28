<template>
  <form class="new-item-form" @submit.prevent="submit">
    <div class="new-item-form__inputs-group">
      <input
        v-if="requiredKey"
        v-model="item.key"
        type="text"
        :placeholder="keyPlaceholder"
        class="new-item-form__input"
        @change="checkKey"
      />
      <template v-if="item.type !== 'array' && item.type !== 'object'">
        <input
          v-if="item.type === 'string'"
          v-model.trim="item.value"
          type="text"
          placeholder="value"
          class="new-item-form__input"
        />
        <input
          v-if="item.type === 'number'"
          v-model.number="item.value"
          type="number"
          placeholder="value"
          class="new-item-form__input"
        />
        <select
          v-if="item.type === 'boolean'"
          v-model="item.value"
          class="new-item-form__input"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </template>
      <select
        v-once
        v-model="item.type"
        class="new-item-form__input"
        @change="changeType"
      >
        <option v-for="(item, index) in typesList" :value="item" :key="index">
          {{ item }}
        </option>
      </select>
    </div>

    <div class="new-item-form__btns-group">
      <button type="submit" class="new-item-form__btn">
        {{ this.formBtnText.confirmText }}
      </button>
      <button type="button" class="new-item-form__btn" @click="cancel">
        {{ this.formBtnText.cancelText }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "NewItemForm",
  props: {
    requiredKey: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  inject: ["formBtnText"],
  data() {
    return {
      typesList: ["string", "array", "object", "number", "boolean"],
      item: {
        type: "string",
        key: "",
        value: "",
      },
      keyPlaceholder: "key",
    };
  },
  methods: {
    checkKey() {
      this.keyPlaceholder = this.item.key !== "" ? "key" : "cannot be empty";

      if (this.requiredKey) {
        return this.item.key !== "";
      } else {
        return true;
      }
    },
    changeType() {
      switch (this.item.type) {
        case "number":
          this.item.value = 0;
          break;
        case "boolean":
          this.item.value = true;
          break;
        case "array":
        case "object":
          this.item.value = [];
          break;
        default:
          this.item.value = "";
          break;
      }
    },
    submit() {
      if (!this.checkKey()) return;

      switch (this.item.type) {
        case "number":
          this.item.value = Number(this.item.value);
          break;
        case "boolean":
          this.item.value = Boolean(this.item.value);
        default:
          break;
      }

      this.$emit("add-new-item", this.item);
    },
    cancel() {
      this.$emit("cancel-new-item");
    },
  },
};
</script>

<style lang="less">
.new-item-form {
  display: block;
  margin-bottom: 20px;
  &__inputs-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    & > *:not(:last-child) {
      margin-right: 5px;
    }
  }
  &__input {
    flex-grow: 1;
    min-width: 0;
    padding: 3px 6px;
    select& {
      flex-shrink: 0;
    }
  }
  &__btns-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    & > *:not(:last-child) {
      margin-right: 5px;
    }
  }
}
</style>
