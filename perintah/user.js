module.exports = {
  config: {
    nama: "user",
    penulis: "Hez?",
    kuldown: 5,
    peran: 2,
    deskripsi: "Manage user (ban/unban/list/reset)",
    tutor: "user ban @tag | user unban @tag | user list | user reset"
  },

  run: async ({ api, event, args, userData }) => {
    try {
      const sub = args[0]?.toLowerCase();

      if (!sub) {
        return api.sendMessage(
          "Gunakan: ban / unban / list / reset",
          event.threadID,
          event.messageID
        );
      }

      // ================= AMBIL TARGET ================= //
      let target = event.senderID;

      if (event.messageReply) {
        target = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        target = Object.keys(event.mentions)[0];
      } else if (args[1]) {
        target = args[1];
      }

      // ================= BAN ================= //
      if (sub === "ban") {
        const user = userData.get(target);
        if (!user) return;

        userData.set(target, 'ban', 'true');

        return api.sendMessage(
          `🚫 User berhasil di ban\nID: ${target}`,
          event.threadID,
          event.messageID
        );
      }

      // ================= UNBAN ================= //
      if (sub === "unban") {
        const user = userData.get(target);
        if (!user) return;

        userData.set(target, 'ban', 'false');

        return api.sendMessage(
          `✅ User berhasil di unban\nID: ${target}`,
          event.threadID,
          event.messageID
        );
      }

      // ================= LIST ================= //
      if (sub === "list") {
        const allUser = userData.all();

        let teks = "📋 LIST USER\n\n";
        let no = 1;

        for (const id in allUser) {
          const u = allUser[id];
          teks += `${no++}. ${u.nama}\nID: ${id}\nBan: ${u.ban}\n\n`;
        }

        return api.sendMessage(teks, event.threadID, event.messageID);
      }

      // ================= RESET ================= //
      if (sub === "reset") {

        // 🔥 RESET SEMUA USER
        if (!args[1] && !event.messageReply && Object.keys(event.mentions).length === 0) {
          const allUser = userData.all();

          for (const id in allUser) {
            userData.set(id, 'money', 0);
            userData.set(id, 'exp', 0);
            userData.set(id, 'level', 1);
          }

          return api.sendMessage(
            "⚠️ Semua data user berhasil di reset!",
            event.threadID,
            event.messageID
          );
        }

        // 🔥 RESET TARGET
        const user = userData.get(target);
        if (!user) return;

        userData.set(target, 'money', 0);
        userData.set(target, 'exp', 0);
        userData.set(target, 'level', 1);

        return api.sendMessage(
          `♻️ Data user berhasil di reset\nID: ${target}`,
          event.threadID,
          event.messageID
        );
      }

      // ================= DEFAULT ================= //
      api.sendMessage(
        "Subcommand tidak valid!",
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.log("User CMD Error:", err.message);
      api.sendMessage(
        "Terjadi kesalahan",
        event.threadID,
        event.messageID
      );
    }
  },
};