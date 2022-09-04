const spawn = require("cross-spawn");

module.exports = function install(options) {
  console.log('options////////////////', options, process.cwd(), process.stdout, process.stderr);
  const cwd = options.name || process.cwd();
  return new Promise((resolve, reject) => {
    const command = options.installTool;
    const args = ["install", "--save", "--save-exact", "--loglevel", "error"];
    const child = spawn(command, args, {cwd, stdio: ["pipe", process.stdout, process.stderr]});

    child.once("close", code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`
        });
        return;
      }
      resolve();
    });
    child.once("error", reject);
  });
};