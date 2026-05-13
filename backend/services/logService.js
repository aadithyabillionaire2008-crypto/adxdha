const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
function write(level, message, meta = {}) {
  fs.appendFileSync(path.join(logDir, 'garmentpro.log'), JSON.stringify({ ts: new Date().toISOString(), level, message, meta }) + '\n');
}
module.exports = { info: (m, meta) => write('info', m, meta), error: (m, meta) => write('error', m, meta) };
