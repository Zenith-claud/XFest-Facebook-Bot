module.exports = {
  config: {
    nama: "slot",
    penulis: "Hez?",
    kuldown: 5,
    peran: 0,
    deskripsi: "Main slot balance",
    tutor: "slot <jumlah taruhan>"
  },

  run: async ({ api, event, args, userData }) => {
    try {
      const user = userData.get(event.senderID);
      if (!user) return;

      const now = Date.now();
      const cdJackpot = 24 * 60 * 60 * 1000;

      // ================= CEK CD JACKPOT ================= //
      if (user.lastJackpot && (now - user.lastJackpot < cdJackpot)) {
        const sisa = cdJackpot - (now - user.lastJackpot);
        const jam = Math.floor(sisa / (1000 * 60 * 60));
        const menit = Math.floor((sisa / (1000 * 60)) % 60);

        return api.sendMessage(
          `⏳ Kamu habis jackpot!\nTunggu ${jam} jam ${menit} menit`,
          event.threadID,
          event.messageID
        );
      }

      let bet = parseInt(args[0]);

      if (!bet || bet < 20) {
        return api.sendMessage(
          "Minimal taruhan 20!",
          event.threadID,
          event.messageID
        );
      }

      if (user.money < bet) {
        return api.sendMessage(
          "Uang kamu tidak cukup!",
          event.threadID,
          event.messageID
        );
      }

      const emoji = ["🍒","🍉","🍇","🍋","⭐","💎"];

      // ================= DYNAMIC CHANCE ================= //
      let winChance = 25;
      let loseChance = 70;
      let jackpotChance = 5;

      if (bet >= 100) {
        winChance = 40;
        loseChance = 55;
        jackpotChance = 5;
      }

      const chance = Math.random() * 100;

      let spin = [];
      let result = "";
      let win = 0;

      // ================= JACKPOT ================= //
      if (chance < jackpotChance) {
        const e = emoji[Math.floor(Math.random() * emoji.length)];
        spin = [e, e, e];
        win = bet * 5;
        result = `💎 JACKPOT!\nMenang ${win}`;

        userData.set(event.senderID, 'lastJackpot', now);
      }

      // ================= MENANG ================= //
      else if (chance < jackpotChance + winChance) {
        let e1 = emoji[Math.floor(Math.random() * emoji.length)];
        let e2;

        do {
          e2 = emoji[Math.floor(Math.random() * emoji.length)];
        } while (e2 === e1);

        const type = Math.floor(Math.random() * 3);

        if (type === 0) spin = [e1, e1, e2];
        if (type === 1) spin = [e2, e1, e1];
        if (type === 2) spin = [e1, e2, e1];

        win = bet * 2;
        result = `✨ Menang!\n+${win}`;
      }

      // ================= KALAH ================= //
      else {
        do {
          spin = [
            emoji[Math.floor(Math.random() * emoji.length)],
            emoji[Math.floor(Math.random() * emoji.length)],
            emoji[Math.floor(Math.random() * emoji.length)]
          ];
        } while (
          spin[0] === spin[1] ||
          spin[1] === spin[2] ||
          spin[0] === spin[2]
        );

        win = -bet;
        result = `😢 Kalah!\n-${bet}`;
      }

      // ================= UPDATE ================= //
      const newMoney = user.money + win;
      userData.set(event.senderID, 'money', newMoney);

      api.sendMessage(
        `🎰 SLOT 🎰\n\n[ ${spin.join(" | ")} ]\n\n${result}\n💰 Uang: ${newMoney}`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.log("Slot Error:", err.message);
      api.sendMessage(
        "Terjadi kesalahan",
        event.threadID,
        event.messageID
      );
    }
  },
};