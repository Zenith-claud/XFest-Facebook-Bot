module.exports = {
  config: {
    nama: "egg",
    penulis: "Hez?",
    kuldown: 5,
    peran: 2,
    deskripsi: "egg command",
    tutor: "egg"
  },

  run: async ({ api, event }) => {
    const message = `
module.exports = {
  config: {
    nama: "commandName",
    penulis: "Hez?",
    kuldown: 5,
    peran: 0,
    deskripsi: "",
    tutor: ""
  },

  run: async ({ api, event, args, userData }) => {
    api.sendMessage("Hello World", event.threadID, event.messageID)
  }
};
`;

    api.sendMessage(message, event.threadID, event.messageID);
  }
};