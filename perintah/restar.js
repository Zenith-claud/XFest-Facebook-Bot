module.exports = { 
config: { 
  nama: "restar",
  penulis: "Hady Zen", 
  kuldown: 6,
  peran: 2,
  tutor: ""
}, 

run: async function ({ api, event }) { 
  api.sendMessage("❄ Memulai ulang..", event.threadID, event.messageID);
  process.on('exit', function() {
  require('child_process').exec('npm restar');
});
 }
};
