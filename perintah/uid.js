module.exports = {
  config: { 
    nama: "uid", 
    penulis: "Hez?", 
    kuldown: 10,
    peran: 0,
    tutor: "<kosong/tag>"
  }, 
  Alya: async function ({ api, event, args }) {
    if (args[0]) {
          const { mentions } = event;
	    let hadi = ''; 
		for (const id in mentions) { 
            hadi += `${mentions[id].replace("@", "")}: ${id}\n`;
	}
      api.sendMessage(hadi, event.threadID, event.messageID);
    } else { 
      api.sendMessage(event.senderID, event.threadID, event.messageID);
    }
  }
};
