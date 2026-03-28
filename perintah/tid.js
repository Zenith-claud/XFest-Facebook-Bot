module.exports = {
  config: { 
    nama: "tid", 
    penulis: "Hez?", 
    kuldown: 10,
    peran: 0,
    tutor: ""
  }, 
  run: async function ({ api, event }) {
    api.sendMessage(event.threadID, event.threadID, event.messageID)
  }
};
