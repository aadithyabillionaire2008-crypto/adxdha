const { backupExcel } = require('../services/excelService');
backupExcel().then(file => console.log(file)).catch(err => { console.error(err); process.exit(1); });
