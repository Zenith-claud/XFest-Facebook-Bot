// handlers/commandHandler.js
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.commandsPath = path.join(process.cwd(), 'perintah');
    this.watcher = null;
  }

  async loadCommands() {
    try {
      const files = fs.readdirSync(this.commandsPath);
      const newCommands = new Map();

      for (const file of files) {
        if (file.endsWith('.js')) {
          const commandPath = path.join(this.commandsPath, file);
          try {
            delete require.cache[require.resolve(commandPath)];
            const command = require(commandPath);
            
            if (command.config && command.config.nama && typeof command.run === 'function') {
              newCommands.set(command.config.nama, command);
              console.log(global.bot.log.info + `✅ Loaded: ${command.config.nama} (${file})`);
            }
          } catch (error) {
            console.log(global.bot.log.error + `❌ Error ${file}: ${error.message}`);
          }
        }
      }

      this.commands = newCommands;
      console.log(global.bot.log.info + `📦 Total: ${this.commands.size} commands`);
    } catch (error) {
      console.log(global.bot.log.error + `❌ Error: ${error.message}`);
    }
  }

  watchCommands() {
    if (this.watcher) this.watcher.close();

    this.watcher = chokidar.watch(this.commandsPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true
    });

    this.watcher.on('change', async (filePath) => {
      if (filePath.endsWith('.js')) {
        console.log(global.bot.log.info + `\n📝 Changed: ${path.basename(filePath)}`);
        await this.reloadCommand(filePath);
      }
    });

    this.watcher.on('add', async (filePath) => {
      if (filePath.endsWith('.js')) {
        console.log(global.bot.log.info + `\n✨ Added: ${path.basename(filePath)}`);
        await this.reloadCommand(filePath);
      }
    });

    this.watcher.on('unlink', async (filePath) => {
      if (filePath.endsWith('.js')) {
        console.log(global.bot.log.info + `\n🗑️ Removed: ${path.basename(filePath)}`);
        const commandName = path.basename(filePath, '.js');
        if (this.commands.has(commandName)) {
          this.commands.delete(commandName);
          console.log(global.bot.log.info + `✅ Removed: ${commandName}`);
        }
      }
    });
  }

  async reloadCommand(filePath) {
    const fileName = path.basename(filePath);
    try {
      delete require.cache[require.resolve(filePath)];
      const command = require(filePath);
      
      if (command.config && command.config.nama && typeof command.run === 'function') {
        this.commands.set(command.config.nama, command);
        console.log(global.bot.log.info + `✅ Reloaded: ${command.config.nama} (${fileName})`);
      }
    } catch (error) {
      console.log(global.bot.log.info + `❌ Error reload ${fileName}: ${error.message}`);
    }
  }

  getCommand(name) {
    return this.commands.get(name);
  }

  hasCommand(name) {
    return this.commands.has(name);
  }
}

module.exports = CommandHandler;