const express = require('express')

const app = express();
const port = global.bot.port

app.listen(port, () => {
  console.log(global.bot.log.info + `Server berjalan di port ${port}`);
}).on('error', (err) => {
  console.log(global.bot.log.error + 'Gagal memulai server: ', err);
});

app.get('/uptime', (req, res) => {
  res.send('Server is alive');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html')); 
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'html', '404.html'));
});