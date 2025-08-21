const { spawn } = require("child_process");

const npm = /^win/.test(process.platform) ? "npm.cmd" : "npm";

const client = spawn(npm, ["run", "dev"], { shell: true });
const parser = spawn(npm, ["run", "serve"], { shell: true, cwd: "./player-parser" });
const proxy = spawn(npm, ["run", "serve"], { shell: true, cwd: "./api-prox" });

const clientInfo = "\x1b[36m[client]\x1b[0m";
const parserInfo = "\x1b[33m[parser]\x1b[0m";
const proxyInfo = "\x1b[31m[proxy]\x1b[0m";

console.log(`${clientInfo} CMD: ${client.spawnargs.toString()}`);
console.log(`${clientInfo} PID: ${client.pid}`);
console.log(`${parserInfo} CMD: ${parser.spawnargs.toString()}`);
console.log(`${parserInfo} PID: ${parser.pid}`);
console.log(`${proxyInfo} CMD: ${proxy.spawnargs.toString()}`);
console.log(`${proxyInfo} PID: ${proxy.pid}`);
console.log(`\n`);

client.stdout.on("data", (data) =>
  console.log(clientInfo, data.toString())
);
parser.stdout.on("data", (data) =>
  console.log(parserInfo, data.toString())
);
proxy.stdout.on("data", (data) =>
  console.log(proxyInfo, data.toString())
);
