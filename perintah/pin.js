const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    nama: "pin",
    penulis: "Range",
    kuldown: 15,
    peran: 0,
    tutor: "pin <kata kunci> <number>",
  },
  run: async function ({ api, event, args }) {
    api.sendMessage("Tunggu bentar yaa...", event.threadID, event.messageID);
    try {
      if (args.length < 2) return api.sendMessage("Format salah! Gunakan: /pin <kata kunci> <number>\nContoh: /pin pemandangan 3", event.threadID, event.messageID);
      const jumlahGambar = parseInt(args.pop(), 10);
      const kataKunci = args.join(" ");
      if (isNaN(jumlahGambar) || jumlahGambar <= 0) {
        return api.sendMessage(
          "Jumlah gambar harus berupa angka positif!\nContoh: /pin pemandangan 3",
          event.threadID,
          event.messageID
        );
      }
      const jumlahGambarTerbatas = Math.min(jumlahGambar, 5);
      const apiUrl = `https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(kataKunci)}`;
      const response = await axios.get(apiUrl);
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        return api.sendMessage(
          "Tidak ada hasil ditemukan untuk kata kunci tersebut!",
          event.threadID,
          event.messageID
        );
      }
      const hasilGambar = response.data.slice(0, jumlahGambarTerbatas);
      const attachments = [];
      for (const [index, data] of hasilGambar.entries()) {
        try {
          const imageResponse = await axios.get(data.image, { responseType: "arraybuffer" });
          const imageBuffer = Buffer.from(imageResponse.data, "binary");
          const imagePath = path.join(__dirname, `pinterest_${index + 1}.png`);
          fs.writeFileSync(imagePath, imageBuffer);
          attachments.push(fs.createReadStream(imagePath));
        } catch (error) {
          api.sendMessage(
            `Gagal mengambil gambar ke-${index + 1}. Error: ${error.message}`,
            event.threadID,
            event.messageID
          );
        }
      }
      if (attachments.length > 0) {
        await api.sendMessage({ body: `ini gambar ${kataKunci} nya^^`, attachment: attachments }, event.threadID, event.messageID);
        attachments.forEach((file) => {
          file.destroy();
          fs.unlinkSync(file.path);
        });
      } else {
        api.sendMessage(
          "Gagal mengunduh gambar. Tidak ada gambar yang dapat dikirim.",
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  },
};
