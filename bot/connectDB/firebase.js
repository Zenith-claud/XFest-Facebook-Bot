const axios = require('axios');
const url = global.Akari.urlFire

const fireGetDats = async (real_id = null) => {
  try {
    const url = real_id ? `${url}${real_id}.json` : `${url}.json`;
    const response = await axios.get(url);
    return response.data || (real_id ? null : {}); 
  } catch (error) {
    console.error('Gagal mendapatkan data:', error.message);
    throw error;
  }
};

const fireSetData = async (real_id, data) => {
  try {
    await axios.put(`${url}${real_id}.json`, data);
    return { success: true, message: 'Data berhasil disimpan.' };
  } catch (error) {
    console.error('Gagal menyimpan data:', error.message);
    throw error;
  }
};

const generateFakeID = async () => {
  try {
    const response = await axios.get(`${url}.json`);
    let maxFakeID = 0;

    if (response.data) {
      Object.values(response.data).forEach(item => {
        if (item.fakeID && item.fakeID > maxFakeID) {
          maxFakeID = item.fakeID;
        }
      });
    }

    return maxFakeID + 1;
  } catch (error) {
    console.error('Gagal menghasilkan fakeID:', error.message);
    throw error;
  }
};

const createData = async (real_id, api) => {
  try {
    const userInfo = await api.getUserInfo(real_id);
    const userName = userInfo[id]?.name || 'Facebook User';
    const fakeID = await generateFakeID();
    const name = userName;
    const newData = {
      name,
      userID: real_id,
      fakeID,
      ban: "false",
      exp: 0,
      money: 0
    };
    await fireSetData(real_id, newData);
    return { success: true, message: 'Data berhasil dibuat.', data: newData };
  } catch (error) {
    console.error('Gagal membuat data baru:', error.message);
    throw error;
  }
};

module.exports = { fireGetData, fireSetData, createData };
