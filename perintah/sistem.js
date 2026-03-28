const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const packageJson = require(process.cwd() + '/package.json');

module.exports = {
  config: {
    nama: "sistem",
    kuldown: 10,
    penulis: "hez?",
    peran: 1,
    tutor: ""
  },

  run: async function ({ api, event }) {
    const start = Date.now();

    const uptime = process.uptime();
    const jam = Math.floor(uptime / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    const up = `${jam}j ${menit}m`;

    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - os.freemem();
    const ram = `${prettyBytes(usedMemory)} / ${prettyBytes(totalMemory)}`;

    const diskUsage = await getDiskUsage();
    const disk = `${prettyBytes(diskUsage.used)} / ${prettyBytes(diskUsage.total)}`;

    const cpu = `${os.cpus()[0].model} (${os.cpus().length} cores)`;
    const osInfo = `${os.type()} ${os.release()} (${os.arch()})`;

    const nodeVer = process.version;
    const botVer = packageJson.version || "Unknown";

    const pingMs = Date.now() - start;

    // FUNCTION BIAR SEJAJAR
    const format = (label, value) => {
      return label.padEnd(10, ' ') + ': ' + value;
    };

    const message = `
╭──〔 SISTEM 〕
│ ${format("Uptime", up)}
│ ${format("Ping", pingMs + " ms")}
│
│ ${format("RAM", ram)}
│ ${format("Disk", disk)}
│ ${format("CPU", cpu)}
│
│ ${format("OS", osInfo)}
│ ${format("Node", nodeVer)}
│ ${format("Version", "v" + botVer)}
╰──────────────
    `.trim();

    api.sendMessage(message, event.threadID, event.messageID);

    async function getDiskUsage() {
      const { stdout } = await exec('df -k /');
      const [_, total, used] = stdout.split('\n')[1].split(/\s+/).filter(Boolean);
      return { total: parseInt(total) * 1024, used: parseInt(used) * 1024 };
    }

    function prettyBytes(bytes) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let i = 0;
      while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
      }
      return `${bytes.toFixed(2)} ${units[i]}`;
    }
  }
};