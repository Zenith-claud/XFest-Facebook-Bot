onst axios = require("axios");

module.exports = {
  config: {
    nama: "gemini",
    penulis: "Hez?",
    kuldown: 5,
    peran: 0,
    deskripsi: "Chat dengan AI Gemini",
    tutor: "gemini <pertanyaan>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.length) {
        return api.sendMessage(
          "Contoh: gemini Hai Apa Kabar",
          event.threadID,
          event.messageID
        );
      }

      const prompt = args.join(" ");

      // 🔑 GANTI APIKEY LU
      const apiKey = "AIzaSyDUW0nISDX_kTfU5OpIVlee_6bocybfXnA";

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const res = await axios.post(url, {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      });

      const hasil = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!hasil) {
        return api.sendMessage(
          "AI tidak merespon!",
          event.threadID,
          event.messageID
        );
      }

      api.sendMessage(
        `🤖 Gemini AI\n\n${hasil}`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.log("Gemini Error:", err.response?.data || err.message);

      api.sendMessage(
        "Terjadi kesalahan saat menghubungi AI",
        event.threadID,
        event.messageID
      );
    }
  },
};