module.exports = {
config: { 
  nama: "add",
  penulis: "Hez?", 
  peran: 1,
  kuldown: 10,
  tutor: "<id>"
}, 
run: async function ({ api, event, args }) { 
 const id = args[0];
 if (event.isGroup == true) {
  if (text) {
     try { 
      api.addUserToGroup(id, event.threadID);
     } catch (e) {
       api.sendMessage("UID Tidak Valid Atau profile di kunci", event.threadID)
     }
   } else {
    return api.sendMessage("Masukan ID", event.threadID, event.messageID);
   }
  } else {
    api.sendMessage("Anda Harus Berada Di Dalam Grup", event.senderID)
  }
 }
};
