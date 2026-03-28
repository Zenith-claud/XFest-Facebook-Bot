const path = require('path');
const fs = require('fs');

let data = {};
const dbPath = path.join('database', 'data', 'user.db');

// pastikan folder ada
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// ================= LOAD ================= //
if (fs.existsSync(dbPath)) {
  try {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    console.log('Gagal membaca user.db:', error);
    data = {};
  }
} else {
  fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

// ================= NEW USER ================= //
async function newUser(id, api) {
  if (!data[id]) {
    let userName = 'Facebook User';

    try {
      const userInfo = await api.getUserInfo(id);
      userName = userInfo[id]?.name || userName;
    } catch (err) {
      console.log('Gagal ambil user:', err.message);
    }

    data[id] = {
      nama: userName,
      userID: id,
      money: 0,
      exp: 0,
      level: 1,
      daily: null
    };

    console.log(`${userName} pengguna baru.`);
    simpan();
  }
}

// ================= SET (FLEX + NESTED) ================= //
function set(id, key, value) {
  if (!id || !key) return;

  // auto buat user kalau belum ada
  if (!data[id]) data[id] = { userID: id };

  const keys = key.split('.');
  let obj = data[id];

  while (keys.length > 1) {
    const k = keys.shift();

    // kalau bukan object → ubah jadi object
    if (typeof obj[k] !== 'object' || obj[k] === null) {
      obj[k] = {};
    }

    obj = obj[k];
  }

  obj[keys[0]] = value;

  simpan();
}

// ================= GET ================= //
function get(id) {
  return data[id] || null;
}

// ================= ALL ================= //
function all() {
  return data;
}

// ================= SAVE ================= //
function simpan() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ================= EXPORT ================= //
module.exports = {
  userData: {
    new: newUser,
    set,
    get,
    all
  }
};