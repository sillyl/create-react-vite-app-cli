const ora = require('ora');
const inquirer = require("inquirer");
const symbols = require('log-symbols');
const fs = require('fs-extra');
const downloadGitRepo = require('download-git-repo');
const chalk = require('chalk');
const install = require('./install');
const handlebar = require('handlebars');
const path = require('path');

class Generator {
  constructor(name, targetDir, res) {
    this.name = name;
    this.targetDir = targetDir;
    this.res = res;
  }

  async download() {
    // 1）拼接下载地址
   const requestUrl = 'direct:git@github.com:sillyl/testone.git';

    const spinner = ora(`正在下载模板，源地址：${requestUrl}`);
    spinner.start();
    // 2）调用下载方法
    await downloadGitRepo(
      // 直连下载，默认下载master
      requestUrl,
      this.targetDir,
      {clone: true},
      async(error) => {
        if (error) {
          spinner.fail();
          console.log(symbols.error, chalk.red(error));
        } else {
          spinner.succeed();
          const fileName =  `${this.name}/package.json`;
          const meta = {
            name: this.name,
            version: this.res.version,
            description: this.res.description,
            homepage: this.res.homepage
          }
          // 读写package.json文件
          if (fs.existsSync(fileName)) {
            let content = fs.readFileSync(fileName).toString();
            if(this.res?.mobx) {
              const res = JSON.parse(content);
              res.dependencies["mobx"] = "^6.6.1";
              res.dependencies["mobx-react"] = "^7.5.2";
              content = JSON.stringify(res, null, 2);
              const resultContent = handlebar.compile(content)(meta);
              fs.writeFileSync(fileName, resultContent);
            }
          }

          const entryFile = `${this.name}/src/index.tsx`;
          //全局store
          if(this.res?.mobx) {
            try {
              const data = fs.readFileSync(path.join(__dirname, './statics/mobx/index.tsx'), 'utf8');
              fs.writeFileSync(entryFile, data);
            } catch (error) {
              throw  error;
            }
          } else {
            if(fs.existsSync(`${this.name}/src/stores`)){
              fs.removeSync(`${this.name}/src/stores`);// 删除模板全局引入store方法
            }
          }

         // 安装依赖
          const {isInstall, installTool} = await inquirer.prompt([
            {
              name: "isInstall",
              type: "confirm",
              default: false,
              message: "Would you like to help you install dependencies?",
              choices: [
                {name: "Yes", value: true},
                {name: "No", value: false}
              ]
            },
            // 选择了安装依赖，则使用哪一个包管理工具
            {
              name: "installTool",
              type: "list",
              default: "yarn",
              message: 'Which package manager you want to use for the project?',
              choices: ["npm", "yarn"],
              when: function (answers) {
                console.log('answers/////////////', answers);
                return answers.isInstall;
              }
            }
          ]);

          if (isInstall) {
            await install({name: this.name, ...this.res, installTool});
          }

          console.log(symbols.success, chalk.green('项目初始化完成'));
          console.log(symbols.info, `cd ${chalk.cyan(this.name)}`);
          if (installTool === 'yarn') {
            console.log(symbols.info, 'yarn start');
          } else if (installTool === 'npm'){
            console.log(symbols.info, 'npm run start');
          } else {
            console.log(symbols.info, `npm install 或 yarn`);
            console.log(symbols.info, 'npm run start 或 yarn start\r\n');
          }

        }
      }
    )
  }
}

module.exports = Generator;
