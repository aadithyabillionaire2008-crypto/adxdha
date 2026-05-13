const express = require('express');
const { randomUUID } = require('crypto');
const nanoid = () => randomUUID();
const QRCode = require('qrcode');
const { db } = require('../../database/db');
const { requireAuth } = require('../middleware/auth');
const { invoicePdf } = require('../services/pdfService');
const router = express.Router();
router.use(requireAuth);
router.post('/invoice', async (req, res) => {
  const { customer_id, items, discount = 0, payment_method = 'Cash', paid = 0, type = 'sale' } = req.body;
  const invoice_no = `CCE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const tax = items.reduce((s, i) => s + (i.quantity * i.price * (i.tax_rate || 0) / 100), 0);
  const total = subtotal + tax - discount;
  const invoice = { id: nanoid(), invoice_no, customer_id, invoice_date: new Date().toISOString().slice(0,10), subtotal, discount, tax, total, paid, due: total - paid, payment_method, status: total - paid > 0 ? 'Due' : 'Paid', type };
  const tx = db.transaction(() => {
    db.prepare('INSERT INTO invoices (id,invoice_no,customer_id,invoice_date,subtotal,discount,tax,total,paid,due,payment_method,status,type) VALUES (@id,@invoice_no,@customer_id,@invoice_date,@subtotal,@discount,@tax,@total,@paid,@due,@payment_method,@status,@type)').run(invoice);
    for (const item of items) {
      db.prepare('INSERT INTO invoice_items (id,invoice_id,product_id,description,quantity,price,tax_rate,line_total) VALUES (?,?,?,?,?,?,?,?)').run(nanoid(), invoice.id, item.product_id || null, item.description, item.quantity, item.price, item.tax_rate || 0, item.quantity * item.price);
      if (item.product_id) db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
    }
  });
  tx();
  const qr = await QRCode.toDataURL(`${invoice.invoice_no}|${invoice.total}|${invoice.status}`);
  res.status(201).json({ ...invoice, qr, pdf: invoicePdf(invoice) });
});
router.get('/history', (req, res) => res.json(db.prepare('SELECT * FROM invoices ORDER BY invoice_date DESC, rowid DESC').all()));
module.exports = router;
