module.exports = {
    config: {
        nama: "hapus",
        penulis: "Range",
        kuldown: 5,
        peran: 2,
        tutor: " <pesan>"
    },
    run: async function({ event }) {
        api.unsendMessage(event.messageReply.messageID); 
    }
};
