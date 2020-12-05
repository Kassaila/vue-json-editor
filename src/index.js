import JsonEditor from './json-editor.vue';
import ObjectView from './object-view.vue';
import PackageFile from '../package.json';

const VERSION = PackageFile.version;

const install = (Vue) => {
  if (install.installed) return;

  Vue.component('json-editor', JsonEditor);
  Vue.component('object-view', ObjectView);
};

export default install;

export const components = {
  JsonEditor,
  VERSION,
};
