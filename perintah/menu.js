const fs = require('fs/promises');
const path = require('path');
const { awalan, nama } = global.bot;

module.exports = {
  config: {
    nama: "menu",
    penulis: "Hez? ",
    peran: 0,
    kuldown: 10,
    tutor: "<cmd/kosong>"
  },
    
  run: async function ({ api, event, args, global }) {
    const files = await fs.readdir(path.join('./perintah'));
    const jsFiles = files.filter(file => path.extname(file) === '.js');
    jsFiles.sort();

    const commandList = { user: [], adminGroups: [], adminBot: [] };
    const commandInfo = {};

    for (const file of jsFiles) {
      const filePath = path.join(path.join('./perintah'), file);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      let configMatch = fileContent.match(/const\s+config\s*=\s*{[^}]*nama\s*:\s*"([^"]+)"/);
      if (!configMatch) {
        configMatch = fileContent.match(/config\s*:\s*{[^}]*nama\s*:\s*"([^"]+)"/);
      }

      if (configMatch) {
        const commandName = configMatch[1];

        let configObj = fileContent.match(/const\s+config\s*=\s*{([^}]+)}/);
        if (!configObj) {
          configObj = fileContent.match(/config\s*:\s*{([^}]+)}/);
        }

        if (configObj) {
          const configData = configObj[1].split(',').reduce((acc, line) => {
            const [key, value] = line.split(':').map(str => str.trim().replace(/"/g, ''));
            acc[key] = value;
            return acc;
          }, {});

          if (args[0] && args[0] === commandName) {
            commandInfo[commandName] = configData;
            break;
          }

          const peran = parseInt(configData.peran, 10);
          if (peran === 0) {
            commandList.user.push(commandName);
          } else if (peran === 1) {
            commandList.adminGroups.push(commandName);
          } else if (peran === 2) {
            commandList.adminBot.push(commandName);
          }
        }
      }
    }

    if (args[0] && commandInfo[args[0]]) {
      const info = commandInfo[args[0]];
      const msg = `
╔═══════════════╗
      📝 𝗜𝗻𝗳𝗼 𝗣𝗲𝗿𝗶𝗻𝘁𝗮𝗵
╚═══════════════╝

🔹 Nama      : ${info.nama}
🔹 Penulis   : ${info.penulis}
🔹 Peran     : ${info.peran === "0" ? "User" : info.peran === "1" ? "Admin Groups" : "Admin Bot"}
🔹 Kuldown   : ${info.kuldown} detik
🔹 Tutorial  : ${info.tutor}
`;
      api.sendMessage(msg, event.threadID, event.messageID);
    } else if (args[0] && !commandInfo[args[0]]) {
      api.sendMessage(`❌ Perintah "${args[0]}" tidak ditemukan.`, event.threadID, event.messageID);
    } else if (!args[0]) {
      const description = `Gunakan ${awalan}menu <nama perintah> untuk melihat deskripsi lengkap.`;

      const formatCommandsInline = (list) => list.length ? list.join(' | ') : 'Tidak ada perintah.';

      const msg = `
╔═══════════════╗
       📜 𝗗𝗮𝗳𝘁𝗮𝗿 𝗣𝗲𝗿𝗶𝗻𝘁𝗮𝗵
╚═══════════════╝

 *USER*
${formatCommandsInline(commandList.user)}

*ADMIN GROUPS*
${formatCommandsInline(commandList.adminGroups)}

*ADMIN*
${formatCommandsInline(commandList.adminBot)}

${description}
`;
      api.sendMessage(msg, event.threadID, event.messageID);
    }
  }
};