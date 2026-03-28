// ================== MODULE ================== //
const login = require('./fca-hez');
const { logo, warna, font, log } = require('./func/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const { version } = require('./package');
const gradient = require('gradient-string');
const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting, zonawaktu, web } = require('./config');
const { kuldown } = require('./func/kuldown');
const moment = require('moment-timezone');
const now = moment.tz(zonawaktu);
const { userData } = require('./database/user')
const { threadData } = require('./database/thread')

// ================== ERROR ================== //
process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));

// ================== VAR ================== //
const ip = { host: proxy, port: port };
const xfest = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.run);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');

// ================== GLOBAL ================== //
global.bot = { awalan, nama, admin, logo, aikey, bahasa: nakano, web, maintain, waktu, tanggal, port };

// ================== FUNC ================== //
async function notiferr(notif) {
  try {
    const oreki = `Error Project\n\nNama: ${nama}\nError: ${notif}`;
    await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
  } catch (error) {
    console.log(logo.error + 'Terjadi kesalahan pada notif', error);
  }
}

// ================== UTILS ================== //
async function getStream(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filePath = path.join(__dirname, 'cache', filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    throw error;
  }
}

function loadC() {
  try {
    const data = fs.readFileSync('config.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(logo.error + 'Gagal membaca config.json: ', error);
    return {};
  }
}

console.log(xfest);
setInterval(loadC, 1000);

console.log(log('VERSI') + `${version}.`);
console.log(log('NODEJS') + process.version);
console.log(log('PREFIX') + `${awalan}`);
console.log(log('BAHASA') + `${nakano}.`);
console.log(log('ADMIN') + `${admin}.`);

if (web == true) {
  require('./func/web.js')
} else {
  console.log(log('WEBVIEW') + 'WEBVIEW di matikan')
}

fs.readdir('./perintah', (err, files) => {
  const commands = files.map(file => path.parse(file).name);
  console.log(log('CMD') + `${commands}.`);
});

let akun;
try {
  akun = fs.readFileSync('account.txt', 'utf8');
  if (!akun || !JSON.parse(akun)) {
    console.log(logo.error + 'Kamu belum memasukkan cookie atau cookie tidak valid.');
    process.exit();
  }
} catch (error) {
  console.log(logo.error + 'Gagal membaca account.txt: ', error);
  process.exit();
}

// ================== LOGIN ================== //
login({ appState: JSON.parse(akun, ip) }, setting, (err, api) => {
  if (err) {
    notiferr(`Terjadi kesalahan saat login: ${err.message || err.error}`);
    console.log(logo.error + `Terjadi kesalahan saat login: ${err.message || err.error}`);
    process.exit();
  }
  
  // ================== EXP ================== //
  function addExp(event) {
    try {
      const user = userData.get(event.senderID);
      if (!user) return;

      let exp = (user.exp || 0) + 2;
      let level = user.level || 0;

      if (exp >= 100) {
        level += 1;
        exp = 0;

        api.sendMessage(
          `🎉 Selamat ${user.nama || user.fakeName || 'user'}!\nLevel kamu sekarang ${level}`,
          event.threadID
        );
      }

      userData.set(event.senderID, 'exp', exp);
      userData.set(event.senderID, 'level', level);

    } catch (err) {
      console.log(logo.error + 'EXP error: ' + err.message);
    }
  }

  api.listenMqtt(async (err, event) => {
    if (err) {
      notiferr(`${err.message || err.error}`);
      console.log(logo.error + `${err.message || err.error}`);
      process.exit();
    }

    const body = event.body;
    if (!body || (global.bot.maintain === true && !admin.includes(event.senderID)) || (chatdm === false && event.isGroup == false && !admin.includes(event.senderID))) return;
    
    // INIT USER
    await userData.new(event.senderID, api);
    const userInfo = userData.get(event.senderID);
    
    // INIT THREAD
    await threadData.new(event.threadID, api);

    // TAMBAH EXP (SEMUA PESAN)
    addExp(event);
    
if (userInfo?.ban === 'true') {
  if (!body.startsWith(awalan)) return;
  return api.sendMessage(
    "🚫 Kamu telah di ban!",
    event.threadID,
    event.messageID
  );
}

    // PREFIX INFO
    if (body.toLowerCase() == "prefix") {
      return api.sendMessage(`PREFIX ${nama}: ${awalan}`, event.threadID, event.messageID);
    }
    
    // NON COMMAND
    if (!body.startsWith(awalan)) return;
    
    // HANYA PREFIX
    if (body.trim() === awalan) {
      return api.sendMessage(`Gunakan ${awalan}menu`, event.threadID, event.messageID);
    }

    const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();
 
    async function cmdRun(cmd, api, event) {
      const args = body?.replace(`${awalan}${cmd}`, "")?.trim().split(' ');

      try {
        const threadInfo = await new Promise((resolve, reject) => {
          api.getThreadInfo(event.threadID, (err, info) => {
            if (err) reject(err);
            else resolve(info);
          });
        });

        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const files = fs.readdirSync(path.join(__dirname, '/perintah'));
        let commandFound = false;

        for (const file of files) {
          if (file.endsWith('.js')) {
            const commandPath = path.join(path.join(__dirname, '/perintah'), file);
            
            let commandModule;
            try {
              commandModule = require(commandPath);
            } catch (requireError) {
              console.log(logo.error + `Gagal load command ${file}: ${requireError.message}`);
              continue;
            }

            const { config, run, bahasa } = commandModule;

            if (!config) continue;

            if (config.nama === cmd && typeof run === 'function') {
              commandFound = true;
              console.log(logo.cmds + `Menjalankan perintah ${config.nama}.`);
              const bhs = veng => bahasa?.[nakano]?.[veng] || veng;

              if (kuldown(event.senderID, config.nama, config.kuldown) == 'hadi') {
                if (config.peran == 0 || !config.peran) {
                  await run({ api, event, args, bhs, getStream, loadC, threadData, userData });
                  return;
                }
                if ((config.peran == 2 || config.peran == 1) && admin.includes(event.senderID)) {
                  await run({ api, event, args, bhs, getStream, loadC, threadData, userData });
                  return;
                } else if (config.peran == 1 && adminIDs.includes(event.senderID)) {
                  await run({ api, event, args, bhs, getStream, loadC, threadData, userData });
                  return;
                } else {
                  api.setMessageReaction("❗", event.messageID);
                }
              } else {
                api.setMessageReaction('⌛', event.messageID);
              }
            }
          }
        }

        if (!commandFound) {
          return api.sendMessage(`Perintah ${cmd} Tidak di Temukan`, event.threadID);
        }
      } catch (error) {
        console.log(logo.error + 'Perintah error: ' + error.message);
      }
    }

    cmdRun(cmd, api, event);
  });
});