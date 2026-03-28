module.exports = {
  config: { 
    nama: "status",  
    penulis: "Hez?", 
    kuldown: 6,
    peran: 0,
    tutor: ""
  }, 

  run: async function ({ api, event, userData }) {
    const senderID = event.senderID; 

    try {
      const data = await userData.get(senderID);  

      if (!data) {
        return api.sendMessage("❌ Data tidak ditemukan.", event.threadID, event.messageID);
      }

      const name = user.fakeName || user.nama;
      const exp = data.exp || 0;
      const money = data.money || 0;
      const level = data.level || 0;
      const maxExp = data.maxExp || 100; // default max EXP

      // PROGRESS BAR SIMPLE
      const totalBars = 10;
      const progress = Math.round((exp / maxExp) * totalBars);
      const bar = "█".repeat(progress) + "░".repeat(totalBars - progress);

      const statusMessage = `
╭━━〔 STATUS USER 〕━━⬣
┃  Nama   : ${name}
┃  ID     : ${senderID}
┃  Money  : $${money}
┃  Level  : ${level}
┃  Exp    : ${exp}/${maxExp}
┃  Progress:
┃ ${bar}
╰━━━━━━━━━━━━━━━━━━⬣
      `.trim();

      api.sendMessage(statusMessage, event.threadID, event.messageID);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      api.sendMessage("❌ Terjadi kesalahan saat mengambil data.", event.threadID, event.messageID);
    }
  }
};