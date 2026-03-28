const path = require('path');
const fs = require('fs');

let data = {};
const dbPath = path.join('database', 'data', 'user.db');

// pastikan folder ada
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

if (fs.existsSync(dbPath)) {
  try {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    console.log(global.bot?.log?.error + ' Gagal membaca user.db: ', error);
    data = {};
  }
} else {
  fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

async function newUser(id, api) {
  if (!data[id]) {
    try {
      const userInfo = await api.getUserInfo(id);
      const userName = userInfo[id]?.name || 'Facebook User';

      data[id] = {
        nama: userName,
        userID: id,
        money: 0,
        exp: 0,
        ban: false,
        level: 1,
        daily: null
      };

      console.log(`${userName} pengguna baru.`);
    } catch (error) {
      console.log('Gagal ambil user:', error);

      data[id] = {
        nama: 'Facebook User',
        userID: id,
        money: 0,
        exp: 0,
        ban: false,
        level: 1,
        daily: null
      };
    }

    simpan();
  }
}

function set(id, item, value) {
  if (!data[id]) return console.log("User belum ada");

  if (['nama', 'daily', 'ban'].includes(item)) {
    data[id][item] = value;
  } else if (['money', 'exp', 'level'].includes(item)) {
    if (typeof value !== 'number') return console.log("Harus angka");
    data[id][item] = value;
  }

  simpan();
}

function get(id) {
  return data[id] || null;
}

function all() {
  return data;
}

function simpan() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const userData = {
  new: newUser,
  set,
  get,
  all
};

module.exports = { userData };