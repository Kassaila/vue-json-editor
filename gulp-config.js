const global = {
  task: {
    buildJs: 'build-js',
    buildStyles: 'build-styles',
    cleanBuild: 'clean-build',
    copyFiles: 'copy-files',
    watch: 'watch',
    build: 'build',
  },
  folder: {
    tasks: 'tasks',
    dev: 'src',
    build: 'dist',
  },
  file: {
    js: {
      main: 'index',
      build: 'vue-json-editor',
    },
    styles: {
      build: 'common',
    },
  },
  buildJs: {
    externalLibs: {
      vue: 'Vue',
    },
    getEntryPoints() {
      return {
        [global.file.js.build]: `./src/${global.file.js.main}`,
      };
    },
  },
  error: {
    sound: true,
    title: '< SYSTEM ERROR >',
    icon: './system_files/icons/error_icon.png',
    wait: true,
  },
  isProduction() {
    return process.argv[process.argv.length - 1] === this.task.build;
  },
};

module.exports = global;
