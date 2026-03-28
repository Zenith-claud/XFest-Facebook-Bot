module.exports = {
  config: {
    nama: "daily",
    penulis: "Hez?",
    peran: 0,
    kuldown: 0,
    tutor: "<cmd/kosong>"
  },

  run: async function({ api, event, args, global, userData }) {
    const userID = event.senderID;
    const now = Date.now();

    // Ambil data user
    const user = await userData.get(userID) || {};
    if (!user.money) user.money = 0;
    if (!user.exp) user.exp = 0;
    if (!user.lastDaily) user.lastDaily = 0;

    const cooldown = 24 * 60 * 60 * 1000; // 24 jam

    if (now - user.lastDaily < cooldown) {
      const remaining = cooldown - (now - user.lastDaily);
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      return api.sendMessage(
        `Kamu sudah mengambil daily hari ini.\nCoba lagi dalam ${hours} jam ${minutes} menit.`,
        event.threadID,
        event.messageID
      );
    }

    // Gacha uang dan exp (max per gacha)
    const uangGacha = Math.floor(Math.random() * 30) + 1; // 1-100
    const expGacha = Math.floor(Math.random() * 30) + 1; // 1-50

    // Update user data
    const uangFinal = user.money + uangGacha;
    const expFinal = user.exp + expGacha;
    
    await userData.set(userID, 'lastDaily', now)
    await userData.set(userID, 'money', uangFinal);
    await userData.set(userID, 'exp', expFinal)

    return api.sendMessage(
      `Daily!\nUang: $${uangGacha}\nEXP: ${expGacha}`,
      event.threadID,
      event.messageID
    );
  }
};