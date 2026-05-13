const express = require('express');
const { randomUUID } = require('crypto');
const nanoid = () => randomUUID();
const { db } = require('../../database/db');
const { requireAuth } = require('../middleware/auth');
const { tables } = require('../services/excelService');
const router = express.Router();
function safeTable(req, res, next) { if (!tables.includes(req.params.table)) return res.status(404).json({ error: 'Unknown module' }); next(); }
router.use(requireAuth);
router.get('/:table', safeTable, (req, res) => {
  const q = req.query.q?.toLowerCase();
  let data = db.prepare(`SELECT * FROM ${req.params.table} ORDER BY rowid DESC`).all();
  if (q) data = data.filter(row => JSON.stringify(row).toLowerCase().includes(q));
  res.json(data);
});
router.post('/:table', safeTable, (req, res) => {
  const row = { id: nanoid(), created_at: new Date().toISOString(), ...req.body };
  const keys = Object.keys(row);
  db.prepare(`INSERT INTO ${req.params.table} (${keys.join(',')}) VALUES (${keys.map(k => '@' + k).join(',')})`).run(row);
  res.status(201).json(row);
});
router.put('/:table/:id', safeTable, (req, res) => {
  const keys = Object.keys(req.body);
  if (!keys.length) return res.json({ ok: true });
  db.prepare(`UPDATE ${req.params.table} SET ${keys.map(k => `${k}=@${k}`).join(',')} WHERE id=@id`).run({ ...req.body, id: req.params.id });
  res.json(db.prepare(`SELECT * FROM ${req.params.table} WHERE id=?`).get(req.params.id));
});
router.delete('/:table/:id', safeTable, (req, res) => { db.prepare(`DELETE FROM ${req.params.table} WHERE id=?`).run(req.params.id); res.json({ ok: true }); });
module.exports = router;
