const { exec } = require("child_process");

module.exports = {
  config: {
    nama: "shell", 
    kuldown: 6,
    peran: 2,
    penulis: "Hady Zen", 
    tutor: "<kode>"
},
bahasa: { 
  id: { salah: "Kamu belum memasukkan kode terminal nya." }, 
  en: { salah: " You haven't entered the terminal code."}
}, 
run: async function ({ api, event, args, bhs }) {
    if (!args.join(' ')) return api.sendMessage(bhs('salah'), event.threadID, event.messageID);
    exec(args.join(" "), (error, stdout, stderr) => {
      let hadi = "";
      if (error) {
        hadi = error.message;
      }
      if (stdout) {
        hadi = stdout;
      }
      if (stderr) {
        hadi = stderr;
      }
      api.sendMessage(hadi, event.threadID, event.messageID);
    });
  },
};
