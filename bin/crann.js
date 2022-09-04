#! /usr/bin/env node
const program = require('commander');
const figlet = require('figlet');
const chalk = require('chalk');
const symbols = require('log-symbols');

program.command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    console.log(symbols.info, chalk.blue(`${name}项目正在创建中...`))
    // 在 create.js 中执行创建任务
    require('../lib/create.js')(name, options)
  })

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program
  .on('--help', () => {
    console.log('\r\n' + figlet.textSync('crann', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    console.log(`\r\nRun ${chalk.cyan(`crann <command> --help`)} for detailed usage of given command\r\n`)
  })

// 解析用户执行命令传入参数
program.parse(process.argv);
