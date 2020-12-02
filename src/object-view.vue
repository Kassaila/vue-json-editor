<template>
  <div class="block_content">
    <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
      <div
        v-for="(item, index) in flowData"
        :key="`${item.type}${index}`"
        :class="[
          'block',
          'clearfix',
          { 'hide-block': hideMyBlock[index] == true },
        ]"
      >
        <span class="json-key">
          <input
            v-if="typeof item.name == 'string'"
            v-model="item.name"
            type="text"
            placeholder="cannot be empty"
            class="key-input"
            @blur="keyInputBlur(item, $event)"
          />
          <i
            class="collapse-down v-json-edit-icon-arrow_drop_down"
            v-if="item.type == 'object' || item.type == 'array'"
            @click="toggleBlock(index)"
          ></i>
          <i v-if="item.type == 'object'" class="i-type">{{
            "{" + item.childParams.length + "}"
          }}</i>
          <i v-if="item.type == 'array'" class="i-type">{{
            "[" + item.childParams.length + "]"
          }}</i>
        </span>
        <span class="json-val">
          <template v-if="item.type == 'object'">
            <object-view
              :parsedData="item.childParams"
              v-model="item.childParams"
            ></object-view>
          </template>

          <template v-else-if="item.type == 'array'">
            <array-view
              :parsedData="item.childParams"
              v-model="item.childParams"
            ></array-view>
          </template>

          <template v-else>
            <span class="val">
              <input
                type="text"
                v-model="item.remark"
                class="val-input"
                v-if="item.type == 'string'"
              />
              <input
                type="number"
                v-model.number="item.remark"
                class="val-input"
                v-if="item.type == 'number'"
                @input="numberInputChange(item)"
              />
              <select
                name="value"
                v-model="item.remark"
                class="val-input"
                v-if="item.type == 'boolean'"
              >
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>
            </span>
          </template>
        </span>

        <div class="tools">
          <select
            v-model="item.type"
            class="tools-types"
            @change="changeItemType(item, index)"
          >
            <option v-for="(type, index) in formats" :value="type" :key="index">
              {{ type }}
            </option>
          </select>
          <i class="dragbar v-json-edit-icon-drag"></i>
          <i class="del-btn" @click="delItem(parsedData, item, index)">
            <i class="v-json-edit-icon-huishouzhan_huaban"></i>
          </i>
        </div>
      </div>
    </draggable>

    <new-item-form
      v-if="toAddItem"
      @add-new-item="newItem"
      @cancel-new-item="cancelNewItem"
    ></new-item-form>

    <button
      v-if="!toAddItem"
      type="button"
      class="add-new-item"
      @click="addItem"
    >
      +
    </button>
  </div>
</template>

<script>
import NewItemForm from "./new-item-form.vue";

export default {
  name: "ObjectView",
  components: {
    "new-item-form": NewItemForm,
    "array-view": () => import("./array-view.vue"),
  },
  props: { parsedData: {} },
  data() {
    return {
      formats: ["string", "array", "object", "number", "boolean"],
      flowData: this.parsedData,
      toAddItem: false,
      hideMyBlock: {},
    };
  },
  created() {
    this.flowData = this.parsedData || {};
  },
  watch: {
    parsedData: {
      handler(newValue, oldValue) {
        this.flowData = this.parsedData;
      },
    },
  },
  methods: {
    delItem(parentDom, item, index) {
      this.flowData.splice(index, 1);
      if (this.hideMyBlock[index]) this.hideMyBlock[index] = false;
      this.$emit("input", this.flowData);
    },

    toggleBlock(index) {
      this.$set(
        this.hideMyBlock,
        index,
        this.hideMyBlock[index] ? false : true
      );
    },

    addItem() {
      this.toAddItem = true;
    },

    cancelNewItem() {
      this.toAddItem = false;
    },

    newItem(obj) {
      let oj = {
        name: obj.key,
        type: obj.type,
      };
      if (obj.type == "array" || obj.type == "object") {
        oj.childParams = obj.value;
        oj.remark = null;
      } else {
        oj.childParams = null;
        oj.remark = obj.value;
      }

      if (!oj.name) {
        alert("please must input a name!");
        return;
      } else {
        this.flowData.push(oj);
        this.$emit("input", this.flowData);
        this.cancelNewItem();
      }
    },

    keyInputBlur(item, e) {
      if (item.name.length <= 0) {
        e.target.focus();
      }
    },

    onDragEnd() {
      this.$emit("input", this.flowData);
    },

    changeItemType(item, index) {
      if (item.type === "array" || item.type === "object") {
        item.childParams = [];
        item.remark = null;
      }
      if (item.type === "boolean") {
        item.remark = true;
        this.hideMyBlock[index] = false;
      }
      if (item.type === "string") {
        item.remark = "";
        this.hideMyBlock[index] = false;
      }
      if (item.type === "number") {
        item.remark = 0;
        this.hideMyBlock[index] = false;
      }
    },

    numberInputChange(item) {
      if (item.remark !== "") {
        item.remark = item.remark ?? 0;
      } else {
        item.remark = 0;
      }
    },
  },
};
</script>
