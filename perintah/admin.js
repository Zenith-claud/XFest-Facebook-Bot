module.exports = {
  config: {
    nama: "admin",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 2,
    tutor: "<list/add/del>"
  },
  run: async function({ api, event, args }) {
    // edit by Range
    const fs = require('fs');
    const noah = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    switch (args[0]) {
      case 'list':
            try {
          if (!Array.isArray(noah.admin) || noah.admin.length === 0) {
            return api.sendMessage("Tidak ada admin yang terdaftar.", event.threadID);
          }
          
          const mentions = [];
          let nama = '';

          for (let adminID of noah.admin) {
            const userInfo = await api.getUserInfo(adminID);
            if (userInfo && userInfo[adminID] && userInfo[adminID].name) {
              const name = userInfo[adminID].name;
              mentions.push({
                id: adminID,
                tag: name
              });
              nama += "@" + name + '\n';
            } else {
              console.log(`Nama pengguna dengan ID ${adminID} tidak ditemukan.`);
            }
          }

          api.sendMessage({
            body: "Admin List\n" + `${nama}`, 
            mentions: mentions
          }, event.threadID);
        } catch (error) {
          console.error(error);
        }
        break;
      case 'add':
        if (args.length < 2) return api.sendMessage('Masukkan nama admin!', event.threadID, event.messageID);
        noah.admin.push(args[1]);
        fs.writeFileSync('config.json', JSON.stringify(noah, null, 2));
        api.sendMessage('Admin berhasil ditambahkan!', event.threadID, event.messageID);
        break;
      case 'del':
        if (args.length < 2) return api.sendMessage('Masukkan nama admin!', event.threadID, event.messageID);
        const index = noah.admin.indexOf(args[1]);
        if (index !== -1) {
          noah.admin.splice(index, 1);
          fs.writeFileSync('config.json', JSON.stringify(noah, null, 2));
          api.sendMessage('Admin berhasil dihapus!', event.threadID, event.messageID);
        } else {
          api.sendMessage('Admin tidak ditemukan!', event.threadID, event.messageID);
        }
        break;
      default:
        api.sendMessage('Perintah tidak valid! Gunakan <list/add/del>', event.threadID, event.messageID);
    }
  }
};
