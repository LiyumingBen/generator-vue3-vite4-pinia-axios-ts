"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `欢迎使用 ${chalk.red(
          "generator-vue3-vite4-ts5-axios-pinia-template"
        )}!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Your project name",
        defualt: this.appname
      },
      {
        type: "list",
        name: "projectRoute",
        message: "whether to create the router",
        choices: [
          {
            name: "Yes",
            value: "yes",
            checked: true
          },
          {
            name: "No",
            value: "no"
          }
        ]
      },
      {
        type: "list",
        name: "projectPinia",
        message: "whether to create the pinia",
        choices: [
          {
            name: "Yes",
            value: "yes",
            checked: true
          },
          {
            name: "No",
            value: "no"
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(`\nYour generator must be inside a folder named
        ${this.props.name}\n
        I will automatically create this folder.\n`);

      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  // 把每个文件通过模板转换到目标路径
  // 遍历
  writing() {
    const templates = [
      ".editorconfig",
      ".env.development",
      ".env.production",
      ".eslintrc-auto-import.json",
      ".eslintrc.cjs",
      ".prettierrc.json",
      "auto-imports.d.ts",
      "commitlint.config.js",
      "components.d.ts",
      "env.d.ts",
      "index.html",
      "package.json",
      "pnpm-lock.yaml",
      "README.md",
      "tsconfig.json",
      "vite.config.ts",
      "public/favicon.ico",
      ".husky/commit-msg",
      ".husky/pre-commit",
      "build/vite/proxy.ts",
      "docs/前端代码规范.md",
      "docs/Git管理规范.md",
      "src/App.vue",
      "src/main.ts",
      "src/api/index.ts",
      "src/assets/index.ts",
      "src/assets/styles/base.less",
      "src/assets/styles/main.less",
      "src/assets/styles/var.less",
      "src/components/index.ts",
      "src/config/index.ts",
      "src/constants/index.ts",
      "src/directives/index.ts",
      "src/hooks/index.ts",
      "src/layout/index.ts",
      "src/plugins/index.ts",
      "src/router/index.ts",
      "src/services/index.ts",
      "src/stores/common.ts",
      "src/stores/store.ts",
      "src/stores/types.ts",
      "src/utils/index.ts",
      "src/views/index.ts",
      "src/views/home/index.vue"
    ];
    const { name, projectRoute, projectPinia } = this.props || {};
    for (let temp of templates) {
      // 是否创建router pinia同理
      if (projectRoute === "yes" || projectPinia === "yes") {
        this.fs.copyTpl(this.templatePath(temp), this.destinationPath(temp), {
          name
        });
      } else {
        continue;
      }
    }
  }

  // 安装依赖
  install() {
    this.installDependencies();
  }
};
// 1.创建templates文件夹 放入vue项目所需文件
// 2.接受用户输入 并将vue项目中用到name的地方统一使用 <%= name %> 的方式替换
