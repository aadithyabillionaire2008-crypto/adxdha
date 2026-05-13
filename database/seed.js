const { randomUUID } = require('crypto');
const nanoid = () => randomUUID();
const bcrypt = require('bcryptjs');
const data = require('./sample-data.json');
const { db } = require('./db');
const now = new Date().toISOString();
function insert(table, row) {
  const withId = { id: nanoid(), created_at: now, ...row };
  const keys = Object.keys(withId);
  db.prepare(`INSERT OR IGNORE INTO ${table} (${keys.join(',')}) VALUES (${keys.map(k => '@' + k).join(',')})`).run(withId);
  return withId.id;
}
const adminHash = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT OR IGNORE INTO users (id,name,email,password_hash,role,created_at) VALUES (?,?,?,?,?,?)').run('admin', 'Admin User', 'admin@garmentpro.local', adminHash, 'admin', now);
const productIds = data.products.map(p => insert('products', p));
const employeeIds = data.employees.map(e => insert('employees', e));
data.customers.forEach(c => insert('customers', c));
data.suppliers.forEach(s => insert('suppliers', s));
data.production_jobs.forEach((j, i) => insert('production_jobs', { ...j, product_id: productIds[i % productIds.length], assigned_worker_id: employeeIds[i % employeeIds.length] }));
console.log('GarmentPro ERP demo data installed. Login: admin@garmentpro.local / admin123');
