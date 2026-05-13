const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { stringify } = require('csv-stringify/sync');
const { Builder, parseStringPromise } = require('xml2js');
const { db } = require('../../database/db');
const exportDir = path.join(__dirname, '..', '..', 'exports');
const backupDir = path.join(__dirname, '..', '..', 'backups');
for (const dir of [exportDir, backupDir]) if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const tables = ['students','courses','admissions','fee_payments','departments','projects','assets','customers','suppliers','products','invoices','invoice_items','employees','production_jobs','expenses','activity_logs'];
function rows(table) { return db.prepare(`SELECT * FROM ${table}`).all(); }
async function exportExcel(target = exportDir) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CampusCompany ERP';
  for (const table of tables) {
    const sheet = workbook.addWorksheet(table);
    const data = rows(table);
    if (data[0]) sheet.columns = Object.keys(data[0]).map(k => ({ header: k, key: k, width: 20 }));
    sheet.addRows(data);
  }
  const file = path.join(target, `campuscompany-${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(file);
  return file;
}
function exportCsv(table) {
  const file = path.join(exportDir, `${table}-${Date.now()}.csv`);
  fs.writeFileSync(file, stringify(rows(table), { header: true }));
  return file;
}
function exportXml(table = 'all') {
  const payload = table === 'all' ? Object.fromEntries(tables.map(t => [t, rows(t)])) : { [table]: rows(table) };
  const file = path.join(exportDir, `${table}-${Date.now()}.xml`);
  fs.writeFileSync(file, new Builder({ rootName: 'campusCompanyERP' }).buildObject(payload));
  return file;
}
async function importXml(xml) { return parseStringPromise(xml, { explicitArray: false }); }
async function backupExcel() { return exportExcel(backupDir); }
module.exports = { tables, exportExcel, exportCsv, exportXml, importXml, backupExcel };
