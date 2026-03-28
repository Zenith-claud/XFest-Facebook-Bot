module.exports = {
  config: {
    nama: "setn",
    penulis: "Hez?",
    kuldown: 5,
    peran: 0,
    deskripsi: "Ganti nama user (cooldown 7 hari)",
    tutor: "setn Nama Kamu"
  },

  run: async ({ api, event, args, userData }) => {
    try {
      if (!args.length) {
        return api.sendMessage(
          "Contoh: setn Nama Baru",
          event.threadID,
          event.messageID
        );
      }

      const user = userData.get(event.senderID);
      if (!user) return;

      const now = Date.now();
      const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 hari

      const lastSet = user.lastSetName || 0;

      // cek cooldown
      if (now - lastSet < cooldown) {
        const sisa = cooldown - (now - lastSet);

        const hari = Math.floor(sisa / (1000 * 60 * 60 * 24));
        const jam = Math.floor((sisa / (1000 * 60 * 60)) % 24);

        return api.sendMessage(
          `⏳ Kamu masih cooldown!\nTunggu ${hari} hari ${jam} jam lagi`,
          event.threadID,
          event.messageID
        );
      }

      const newName = args.join(" ").trim();

      if (newName.length < 2) {
        return api.sendMessage(
          "Nama terlalu pendek!",
          event.threadID,
          event.messageID
        );
      }

      if (newName.length > 30) {
        return api.sendMessage(
          "Nama terlalu panjang! Max 30 karakter",
          event.threadID,
          event.messageID
        );
      }

      // simpan
      userData.set(event.senderID, 'fakeName', newName);
      userData.set(event.senderID, 'lastSetName', now);

      api.sendMessage(
        `✅ Nama berhasil diganti menjadi:\n${newName}`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.log("SetName Error:", err.message);
      api.sendMessage(
        "Terjadi kesalahan",
        event.threadID,
        event.messageID
      );
    }
  }
};