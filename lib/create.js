const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Generator = require('./generator');
const chalk = require('chalk');
const symbols = require('log-symbols');

module.exports = async function(name, options) {
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name);
  // 判断目录是否已经存在
  if (!fs.existsSync(targetAir)) {
    fn(name, targetAir);
  } else {
    console.log(symbols.error, chalk.red('该目录下,项目已存在!'));
    // 是否要强制创建
    if (options.force) {
      await fs.remove(targetAir);
      fn(name, targetAir);
    }
  }
}

const fn = (name, targetAir) => {
  // 自定义模板项目信息
  inquirer.prompt([
    {
      name: 'version',
      message: '请输入项目版本',
      default: '0.0.1'
    },
    {
      name: 'description',
      message: '请输入项目描述信息',
      default: '这是一个脚手架生成的项目'
    },
    {
      name: 'homepage',
      message: '请输入项目homepage',
      default: '/'
    },
    {
      name: 'templateType',
      type: 'list',
      message: '请选择模板类型?',
      choices: ['default'],
      default: 'default'
    },
    {
      name:'mobx',
      type: 'confirm',
      message: '是否引入mobx和mobx-react?',
      choices: [
        {name: "Yes", value: true},
        {name: "No", value: false}
      ],
      default: true
    },
    {
      name: 'qiankun',
      type: 'confirm',
      message: '是否需要支持微服务?',
      choices:[
        {name: 'Yes', value: true},
        {name:'No', value: false}
      ],
      default: false
    }
  ]).then(res => {
    // 创建项目
    const generator = new Generator(name, targetAir, res);
    generator.download();
  })
}
