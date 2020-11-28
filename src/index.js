import JsonEditor from './json-editor.vue';
import ObjectView from './object-view.vue';
import ArrayView from './array-view.vue';
import draggable from 'vuedraggable';
import PackageFile from '../package.json';

const VERSION = PackageFile.version;

const install = Vue => {
  if (install.installed) return;

  Vue.component('draggable', draggable);
  Vue.component('json-editor', JsonEditor);
  Vue.component('object-view', ObjectView);
  Vue.component('array-view', ArrayView);
};

export default install;

export const components = {
  JsonEditor,
  VERSION
};
