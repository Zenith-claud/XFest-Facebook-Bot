const path = require('path');
const fs = require('fs');

let data = {};
const threadDbPath = path.join('database', 'data', 'thread.db');

// pastikan folder ada
fs.mkdirSync(path.dirname(threadDbPath), { recursive: true });

// load database
if (fs.existsSync(threadDbPath)) {
  try {
    data = JSON.parse(fs.readFileSync(threadDbPath, 'utf-8'));
  } catch (err) {
    console.log('❌ Gagal membaca thread.db:', err);
    data = {};
  }
} else {
  fs.writeFileSync(threadDbPath, JSON.stringify({}, null, 2));
}

// =========================
// CREATE THREAD (ambil dari API)
// =========================
async function newThread(threadID, api) {
  if (data[threadID]) return; // biar gak overwrite

  try {
    const info = await api.getThreadInfo(threadID);

    data[threadID] = {
      nama: info.threadName || 'unknown',
      id: threadID,
      anggota: info.participantIDs?.length || 0,
      admin: info.adminIDs?.length || 0,
      ban: false
    };

    console.log(`✅ Thread disimpan: ${data[threadID].nama}`);
  } catch (err) {
    console.log('❌ Gagal ambil thread info:', err);

    data[threadID] = {
      nama: 'unknown',
      id: threadID,
      anggota: 0,
      admin: 0,
      ban: false
    };
  }

  simpan();
}

// =========================
// UPDATE THREAD (refresh data)
// =========================
async function update(threadID, api) {
  if (!data[threadID]) return;

  try {
    const info = await api.getThreadInfo(threadID);

    data[threadID].nama = info.threadName || data[threadID].nama;
    data[threadID].anggota = info.participantIDs?.length || 0;
    data[threadID].admin = info.adminIDs?.length || 0;

    console.log(`🔄 Thread diupdate: ${data[threadID].nama}`);
    simpan();
  } catch (err) {
    console.log('❌ Gagal update thread:', err);
  }
}

// =========================
// GET THREAD
// =========================
function get(threadID) {
  return data[threadID] || null;
}

// =========================
// GET ALL
// =========================
function all() {
  return data;
}

// =========================
// SAVE
// =========================
function simpan() {
  try {
    fs.writeFileSync(threadDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('❌ Gagal menyimpan thread.db:', err);
  }
}

// =========================
// EXPORT
// =========================
const threadData = {
  new: newThread,
  update,
  get,
  all
};

module.exports = { threadData };